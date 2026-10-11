"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrushCleaningIcon, HouseIcon, MenuIcon, RadioIcon, TvIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  // Route prefix that marks the item active; defaults to href.
  activePrefix?: string;
}

const MENU_ITEMS: IMenuItem[] = [
  { href: "/home", label: "Home", icon: HouseIcon },
  { href: "/live", label: "Live", icon: RadioIcon },
  // Active for the whole /channel section: list and detail pages.
  { href: "/channel/list", label: "Channels", icon: TvIcon, activePrefix: "/channel" },
  { href: "/tools", label: "Tools", icon: BrushCleaningIcon },
];

// Auth screens are full-page flows without app navigation.
const HIDDEN_ON = ["/welcome", "/authentication"];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

const SidebarMenu = () => {
  const pathname = usePathname();
  // Pinned via the hamburger button; hovering only expands temporarily.
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  if (HIDDEN_ON.some((path) => isActive(pathname, path))) return null;

  return (
    <>
      {/* Reserves space in the page flow: hover overlays the content, pinning pushes it aside. */}
      <div aria-hidden className={cn("shrink-0 transition-[width] duration-200", isPinned ? "w-55" : "w-16")} />
      <nav
        aria-label="Menu chính"
        data-expanded={isExpanded}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col gap-2 overflow-hidden border-r bg-background p-3 transition-[width,box-shadow] duration-200",
          isExpanded ? "w-56" : "w-16",
          isHovered && !isPinned && "shadow-lg",
        )}
      >
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={isPinned ? "Thu gọn menu" : "Mở rộng menu"}
          aria-expanded={isPinned}
          onPress={() => setIsPinned((pinned) => !pinned)}
          className="mb-2"
        >
          <MenuIcon className="size-5" />
        </Button>
        <ul className="flex flex-col gap-1">
          {MENU_ITEMS.map(({ href, label, icon: Icon, activePrefix }) => {
            const active = isActive(pathname, activePrefix ?? href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={isExpanded ? undefined : label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-opacity duration-200",
                      isExpanded ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default SidebarMenu;
