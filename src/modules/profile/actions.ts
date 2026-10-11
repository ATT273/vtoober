"use server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/prisma/db";
import { getSession } from "@/app/actions";
import { fetchYoutubeChannel, parseChannelInput } from "@/lib/youtube";
import { ChannelLinkResult, IChannelClaim, IMyProfile } from "./types/profile.types";

// A claim code stays valid this long; after that the user starts over.
const CLAIM_TTL_MS = 24 * 60 * 60 * 1000;

const requireUserId = async () => {
  const session = await getSession();
  if (!session?.id) throw new Error("Bạn cần đăng nhập");
  return { userId: session.id, session };
};

const getOwnedChannelId = async (userId: string) => {
  const channel = await db.orm.public.Channel.select("id").first({ ownerId: userId });
  return channel?.id ?? null;
};

const claimExpiresAt = (createdAt: { epochMilliseconds: number }) =>
  new Date(createdAt.epochMilliseconds + CLAIM_TTL_MS);

const toClaimView = async (claim: {
  youtubeChannelId: string;
  code: string;
  createdAt: { epochMilliseconds: number };
}): Promise<IChannelClaim> => {
  // Only for display: a YouTube hiccup should not hide the pending claim.
  const channel = await fetchYoutubeChannel({ id: claim.youtubeChannelId }).catch(() => null);
  return {
    youtubeChannelId: claim.youtubeChannelId,
    channelName: channel?.name ?? null,
    thumbnailUrl: channel?.thumbnailUrl ?? null,
    code: claim.code,
    expiresAt: claimExpiresAt(claim.createdAt).toISOString(),
  };
};

export const getMyProfile = async (): Promise<IMyProfile> => {
  const { userId, session } = await requireUserId();
  const linkedChannelId = await getOwnedChannelId(userId);

  const claim = linkedChannelId
    ? null
    : await db.orm.public.ChannelClaim.select("youtubeChannelId", "code", "createdAt").first({ userId });
  const isClaimValid = claim && claimExpiresAt(claim.createdAt).getTime() > Date.now();

  return {
    name: session.name,
    email: session.email ?? null,
    linkedChannelId,
    pendingClaim: isClaimValid ? await toClaimView(claim) : null,
  };
};

// Public profile: other users only see the linked channel.
export const getLinkedChannelId = async (userId: string): Promise<string | null> => {
  if (!z.uuid().safeParse(userId).success) return null;
  return getOwnedChannelId(userId);
};

export const startChannelLink = async (input: string): Promise<ChannelLinkResult> => {
  const { userId } = await requireUserId();
  if (await getOwnedChannelId(userId)) return { ok: false, error: "Tài khoản đã liên kết với một kênh" };

  const ref = parseChannelInput(input);
  if (!ref) return { ok: false, error: "Link kênh không hợp lệ. Ví dụ: https://www.youtube.com/@tenkenh" };

  const channel = await fetchYoutubeChannel(ref);
  if (!channel) return { ok: false, error: "Không tìm thấy kênh YouTube này" };

  const existing = await db.orm.public.Channel.select("ownerId").first({
    youtubeChannelId: channel.youtubeChannelId,
  });
  if (existing?.ownerId && existing.ownerId !== userId) {
    return { ok: false, error: "Kênh này đã được liên kết với tài khoản khác" };
  }

  const code = `VTOOBER-${randomBytes(4).toString("hex").toUpperCase()}`;
  await db.transaction(async (tx) => {
    await tx.orm.public.ChannelClaim.where({ userId }).delete();
    await tx.orm.public.ChannelClaim.create({ userId, youtubeChannelId: channel.youtubeChannelId, code });
  });
  return { ok: true };
};

export const verifyChannelLink = async (): Promise<ChannelLinkResult> => {
  const { userId } = await requireUserId();
  if (await getOwnedChannelId(userId)) return { ok: false, error: "Tài khoản đã liên kết với một kênh" };

  const claim = await db.orm.public.ChannelClaim.select("id", "youtubeChannelId", "code", "createdAt").first({
    userId,
  });
  if (!claim || claimExpiresAt(claim.createdAt).getTime() <= Date.now()) {
    return { ok: false, error: "Mã xác minh đã hết hạn, vui lòng bắt đầu lại" };
  }

  const channel = await fetchYoutubeChannel({ id: claim.youtubeChannelId });
  if (!channel) return { ok: false, error: "Không tìm thấy kênh YouTube này" };
  if (!channel.description.includes(claim.code)) {
    return {
      ok: false,
      error: "Chưa thấy mã trong mô tả kênh. YouTube có thể mất vài phút để cập nhật, hãy thử lại sau.",
    };
  }

  const existing = await db.orm.public.Channel.select("id", "ownerId").first({
    youtubeChannelId: channel.youtubeChannelId,
  });
  if (existing?.ownerId && existing.ownerId !== userId) {
    return { ok: false, error: "Kênh này đã được liên kết với tài khoản khác" };
  }

  await db.transaction(async (tx) => {
    if (existing) {
      await tx.orm.public.Channel.where({ id: existing.id }).update({ ownerId: userId });
    } else {
      await tx.orm.public.Channel.create({
        url: channel.customUrl
          ? `https://www.youtube.com/${channel.customUrl}`
          : `https://www.youtube.com/channel/${channel.youtubeChannelId}`,
        youtubeChannelId: channel.youtubeChannelId,
        name: channel.name,
        description: channel.description,
        thumbnailUrl: channel.thumbnailUrl ?? "",
        subscriberCount: channel.subscriberCount,
        viewCount: channel.viewCount,
        videoCount: channel.videoCount,
        source: "user",
        ownerId: userId,
      });
    }
    await tx.orm.public.ChannelClaim.where({ id: claim.id }).delete();
  });
  return { ok: true };
};

export const cancelChannelLink = async (): Promise<void> => {
  const { userId } = await requireUserId();
  await db.orm.public.ChannelClaim.where({ userId }).delete();
};
