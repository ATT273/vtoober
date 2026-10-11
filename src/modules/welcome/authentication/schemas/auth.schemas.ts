import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export const signupSchema = z
  .object({
    email: z.email({ message: "Email không hợp lệ" }),
    userName: z.string().trim().min(1, { message: "Vui lòng nhập tên người dùng" }),
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export interface AuthActionResult {
  error?: string;
  message?: string;
}
