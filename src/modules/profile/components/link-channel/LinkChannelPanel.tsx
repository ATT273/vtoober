"use client";
import { useState } from "react";
import Image from "next/image";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import { Form } from "react-aria-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resizeYoutubeAvatar } from "@/modules/home/utils/image";
import { useCancelChannelLink, useStartChannelLink, useVerifyChannelLink } from "../../hooks/useChannelLink";
import { IChannelClaim } from "../../types/profile.types";

const expiryFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

const PendingClaim = ({ claim }: { claim: IChannelClaim }) => {
  const verify = useVerifyChannelLink();
  const cancel = useCancelChannelLink();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(claim.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code stays visible for manual copy.
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-muted/50 p-4">
      <div className="flex items-center gap-3">
        {claim.thumbnailUrl && (
          <Image
            src={resizeYoutubeAvatar(claim.thumbnailUrl, 80)}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        )}
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{claim.channelName ?? claim.youtubeChannelId}</span>
          <span className="text-xs text-muted-foreground">
            Mã hết hạn lúc {expiryFormatter.format(new Date(claim.expiresAt))}
          </span>
        </div>
      </div>

      <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
        <li>Mở YouTube Studio → Tuỳ chỉnh → Thông tin cơ bản của kênh.</li>
        <li>Dán mã bên dưới vào bất kỳ đâu trong phần mô tả kênh rồi bấm Xuất bản.</li>
        <li>Quay lại đây và bấm Xác minh. Sau khi liên kết thành công bạn có thể xoá mã khỏi mô tả.</li>
      </ol>

      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-md bg-background px-3 py-2 font-mono text-sm tracking-wider ring-1 ring-foreground/10">
          {claim.code}
        </code>
        <Button variant="outline" size="icon-lg" aria-label="Sao chép mã" onPress={copyCode}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>

      {verify.isError && <p className="text-sm text-destructive">{verify.error.message}</p>}

      <div className="flex flex-wrap gap-2">
        <Button onPress={() => verify.mutate()} isDisabled={verify.isPending}>
          {verify.isPending ? "Đang xác minh..." : "Xác minh"}
        </Button>
        <Button variant="ghost" onPress={() => cancel.mutate()} isDisabled={cancel.isPending || verify.isPending}>
          Huỷ
        </Button>
      </div>
    </div>
  );
};

const StartLinkForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const start = useStartChannelLink();

  if (!isOpen) {
    return (
      <Button size="lg" className="self-start" onPress={() => setIsOpen(true)}>
        <LinkIcon />
        Liên kết đến kênh của bạn
      </Button>
    );
  }

  return (
    <Form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (input.trim()) start.mutate(input);
      }}
    >
      <label htmlFor="channel-link-input" className="text-sm font-medium">
        Link hoặc handle kênh YouTube của bạn
      </label>
      <div className="flex flex-wrap gap-2">
        <Input
          id="channel-link-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="https://www.youtube.com/@tenkenh"
          autoFocus
          className="h-9 min-w-60 flex-1"
        />
        <Button type="submit" size="lg" isDisabled={start.isPending || !input.trim()}>
          {start.isPending ? "Đang kiểm tra..." : "Tiếp tục"}
        </Button>
        <Button variant="ghost" size="lg" onPress={() => setIsOpen(false)}>
          Huỷ
        </Button>
      </div>
      {start.isError && <p className="text-sm text-destructive">{start.error.message}</p>}
    </Form>
  );
};

const LinkChannelPanel = ({ pendingClaim }: { pendingClaim: IChannelClaim | null }) =>
  pendingClaim ? <PendingClaim claim={pendingClaim} /> : <StartLinkForm />;

export default LinkChannelPanel;
