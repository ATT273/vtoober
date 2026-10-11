"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import CustomChatSettings from "./custom-chat-settings/CustomChatSettings";

const RESIZE_DURATION = 400;
const RESIZE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const ToolList = () => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prevRectRef = useRef<DOMRect | null>(null);

  const handleToggle = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      prevRectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
      setIsResizing(true);
    }
    setIsChatExpanded((prev) => !prev);
  };

  // FLIP: measure the new layout, then animate the size from the old one to it
  useLayoutEffect(() => {
    const card = cardRef.current;
    const prevRect = prevRectRef.current;
    if (!card || !prevRect) return;
    prevRectRef.current = null;

    const nextRect = card.getBoundingClientRect();
    const animation = card.animate(
      [
        { width: `${prevRect.width}px`, height: `${prevRect.height}px` },
        { width: `${nextRect.width}px`, height: `${nextRect.height}px` },
      ],
      { duration: RESIZE_DURATION, easing: RESIZE_EASING },
    );
    animation.onfinish = () => setIsResizing(false);

    return () => animation.cancel();
  }, [isChatExpanded]);

  const showContent = isChatExpanded || isResizing;

  return (
    <div
      className={cn(
        "grid min-h-0 flex-1 grid-cols-4 gap-4",
        isChatExpanded ? "grid-rows-[minmax(0,1fr)]" : "content-start",
      )}
    >
      <div
        ref={cardRef}
        className={cn(
          "flex min-h-0 flex-col overflow-hidden rounded-lg border p-2 transition-[border-color,box-shadow,padding] duration-300",
          isChatExpanded
            ? "col-span-4 border-primary p-4 shadow-md"
            : "h-40 cursor-pointer border-gray-300 hover:shadow-md",
        )}
        onClick={!isChatExpanded ? handleToggle : undefined}
      >
        <div className="shrink-0">
          <div className="flex flex-row gap-2 items-center">
            {isChatExpanded && (
              <button type="button" aria-label="Back to tools" onClick={handleToggle} className="cursor-pointer">
                <ChevronLeft className="size-4" />
              </button>
            )}
            <h3 className="text-lg font-semibold">Custom chat</h3>
          </div>
          <p className="font-medium text-gray-400">Create your own custom chat layout</p>
        </div>
        {/* <button
          type="button"
          aria-expanded={isChatExpanded}
          onClick={handleToggle}
          className="flex w-full cursor-pointer items-start justify-between gap-2 text-left"
        >
          <div>
            <h3 className="text-lg font-semibold">Custom chat</h3>
            <p className="font-medium text-gray-400">Create your own custom chat layout</p>
          </div>
          <ChevronDownIcon
            className={cn("mt-1 size-5 shrink-0 transition-transform duration-300", isChatExpanded && "rotate-180")}
          />
        </button> */}

        {showContent && (
          <div
            className={cn(
              "mt-4 min-h-0 flex-1 overflow-y-auto border-t pt-4 transition-opacity duration-300 lg:overflow-hidden",
              isChatExpanded ? "animate-in fade-in" : "opacity-0",
            )}
          >
            <CustomChatSettings />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolList;
