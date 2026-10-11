import Link from "next/link";

const FEATURES = [
  {
    title: "Bảng xếp hạng",
    description: "Xếp hạng các channel VTuber theo số subscriber, kèm số video và lượt xem.",
    href: "/home",
  },
  {
    title: "Danh sách channel",
    description: "Duyệt toàn bộ channel và xem trang chi tiết của từng channel.",
    href: "/channel/list",
  },
  {
    title: "Đang live",
    description: "Theo dõi các stream đang diễn ra và sắp diễn ra.",
    href: "/live",
  },
  {
    title: "Custom tools",
    description: "Tự thiết kế giao diện chat riêng để dùng khi stream.",
    href: "/tools",
  },
];

const AboutIntro = () => {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-center text-3xl font-semibold">Về Vtoober</h1>
        <p className="text-muted-foreground">
          Vtoober là nơi tổng hợp thông tin về cộng đồng VTuber: từ thứ hạng, số liệu của các channel YouTube cho tới
          những buổi live đang diễn ra. Dự án hướng tới việc giúp fan dễ dàng khám phá VTuber mới và hỗ trợ các streamer
          bằng những công cụ nhỏ, tiện dụng.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature.href}>
            <Link
              href={feature.href}
              className="flex h-full flex-col gap-1 rounded-xl px-4 py-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">{feature.title}</span>
              <span className="text-sm text-muted-foreground">{feature.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AboutIntro;
