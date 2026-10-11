"use server";
import { redirect } from "next/navigation";
import { ISession } from "@/types/auth.types";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/prisma/db";
import { SUPABASE_ERRORS_TRANSLATION } from "@/shared/constants/supabase-errors";
import { FEATURES } from "@/shared/constants/features";
import {
  AuthActionResult,
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "@/modules/welcome/authentication/schemas/auth.schemas";

const AUTH_DISABLED_ERROR = "Tính năng đăng nhập / đăng ký tạm thời bị tắt";

export const getSession = async (): Promise<ISession | null> => {
  // With auth switched off everyone is a guest, even with a leftover session cookie.
  if (!FEATURES.auth) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await db.orm.public.User.select("id", "email", "role").first({
    id: user.id,
  });

  if (!profile) return null;

  // A user counts as linked to YouTube when they own a channel.
  const linkedChannel = await db.orm.public.Channel.select("thumbnailUrl").first({ ownerId: profile.id });

  return {
    id: profile.id,
    email: profile.email,
    name: user.user_metadata?.name ?? profile.email,
    role: profile.role,
    avatarUrl: linkedChannel?.thumbnailUrl ?? null,
  };
};

// Make sure every Supabase auth user has a matching row in `users`.
const ensureProfile = async (id: string, email: string) => {
  const existing = await db.orm.public.User.select("id").first({ id });
  if (!existing) {
    await db.orm.public.User.create({ id, email });
  }
};

export const login = async (input: LoginInput): Promise<AuthActionResult> => {
  if (!FEATURES.auth) return { error: AUTH_DISABLED_ERROR };
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: "Thông tin đăng nhập không hợp lệ" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    const code = error?.code;
    if (code && code in SUPABASE_ERRORS_TRANSLATION) {
      return { error: SUPABASE_ERRORS_TRANSLATION[code as keyof typeof SUPABASE_ERRORS_TRANSLATION] };
    }
    return { error: "Email hoặc mật khẩu không đúng" };
  }

  await ensureProfile(data.user.id, data.user.email ?? parsed.data.email);

  redirect("/home");
};

export const signup = async (input: SignupInput): Promise<AuthActionResult> => {
  if (!FEATURES.auth) return { error: AUTH_DISABLED_ERROR };
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { error: "Thông tin đăng ký không hợp lệ" };

  const { email, password, userName } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: userName } },
  });

  if (error) return { error: error.message };
  // Supabase returns a user with no identities when the email is already registered.
  if (!data.user || data.user.identities?.length === 0) {
    return { error: "Email đã được sử dụng" };
  }

  await ensureProfile(data.user.id, email);

  // Email confirmation is enabled: no session until the user confirms.
  if (!data.session) {
    return { message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản." };
  }

  redirect("/home");
};

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/home");
};
