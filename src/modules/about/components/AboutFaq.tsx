import type { ReactNode } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";

const CONTACTS = [
  {
    label: "Facebook",
    value: "facebook.com/emtuanzz",
    href: "https://www.facebook.com/emtuanzz/",
    icon: "/images/socials/facebook.webp",
  },
  {
    label: "YouTube",
    value: "@GamingTogether273",
    href: "https://www.youtube.com/@GamingTogether273",
    icon: "/images/socials/youtube.webp",
  },
  {
    label: "Gmail",
    value: "gaming.together273@gmail.com",
    href: "mailto:gaming.together273@gmail.com",
    icon: "/images/socials/gmail.webp",
  },
];

const SocialContent = () => {
  return (
    <ul className="flex flex-col gap-2">
      {CONTACTS.map((contact) => {
        const isExternal = contact.href.startsWith("http");
        return (
          <li key={contact.label}>
            <a
              href={contact.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Image src={contact.icon} alt="" width={20} height={20} className="size-5 shrink-0 object-contain" />
              <span className="font-medium">{contact.label}:</span>
              <span className="text-muted-foreground">{contact.value}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

interface IFaqItem {
  question: string;
  answer: string;
  additional?: ReactNode;
}

const FAQS: IFaqItem[] = [
  {
    question: "Dữ liệu channel lấy từ đâu?",
    answer: "Thông tin channel (subscriber, video, lượt xem) được lấy trực tiếp từ YouTube Data API.",
  },
  {
    question: "Số liệu được cập nhật bao lâu một lần?",
    answer: "Dữ liệu channel được đồng bộ tự động mỗi ngày một lần vào khoảng 00:00 (giờ Việt Nam).",
  },
  {
    question: "Danh sách live lấy từ đâu?",
    answer: "Các stream đang live và sắp live được lấy từ Holodex, nên sẽ luôn sát với thời gian thực.",
  },
  {
    question: "Tôi có cần đăng nhập để sử dụng không?",
    answer:
      "Không. Bảng xếp hạng, danh sách channel và trang live đều xem được công khai. Đăng nhập chỉ cần cho các tính năng gắn với tài khoản như trang profile.",
  },
  {
    question: "Custom chat dùng như thế nào?",
    answer:
      "Vào trang Tools, chọn Custom chat, tuỳ chỉnh giao diện và xem trước trực tiếp. Sau đó dùng CSS được tạo ra cho phần chat trong phần mềm stream của bạn (ví dụ Browser Source trong OBS).",
  },
  {
    question: "Channel của tôi chưa có trên Vtoober, làm sao để được thêm vào?",
    answer: "Hãy liên hệ với đội ngũ phát triển, chúng tôi sẽ xem xét bổ sung channel vào danh sách theo dõi.",
  },
  {
    question: "Tôi muốn đóng góp ý kiến của mình cho dự án thì phải làm sao?",
    answer: "Hãy liên hệ với mình qua các hình thức dưới đây.",
    additional: <SocialContent />,
  },
];

const AboutFaq = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Câu hỏi thường gặp</h2>
      <div className="flex flex-col divide-y rounded-xl ring-1 ring-foreground/10">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-medium transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="flex flex-col gap-3 px-4 pb-4 text-sm">
              <p className="text-muted-foreground">{faq.answer}</p>
              {faq.additional}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default AboutFaq;
