"use client";

import React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { IChatBackground, PaddingSize } from "../../types/customChat.types";

const PADDING_OPTIONS: { value: PaddingSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

interface IColorFieldProps {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const ColorField = ({ id, label, value, disabled, onChange }: IColorFieldProps) => (
  <div className={cn("flex items-center justify-between gap-2", disabled && "opacity-50")}>
    <Label htmlFor={id}>{label}</Label>
    <input
      id={id}
      type="color"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-12 cursor-pointer rounded border border-input bg-transparent disabled:cursor-not-allowed"
    />
  </div>
);

interface IRangeFieldProps {
  id: string;
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export const RangeField = ({ id, label, valueLabel, value, min, max, disabled, onChange }: IRangeFieldProps) => (
  <div className={cn("flex flex-col gap-2", disabled && "opacity-50")}>
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{label}</Label>
      <span className="text-xs font-medium text-gray-500">{valueLabel}</span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="accent-primary disabled:cursor-not-allowed"
    />
  </div>
);

interface IToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleField = ({ label, checked, onChange }: IToggleFieldProps) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="size-4 accent-primary"
    />
    {label}
  </label>
);

interface ISegmentedFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  disabled?: boolean;
  onChange: (value: T) => void;
}

export const SegmentedField = <T extends string>({
  label,
  value,
  options,
  disabled,
  onChange,
}: ISegmentedFieldProps<T>) => (
  <div className={cn("flex flex-col gap-2", disabled && "opacity-50")}>
    <span className="text-sm font-medium">{label}</span>
    <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-gray-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-gray-500 transition-colors disabled:cursor-not-allowed",
            value === option.value ? "bg-white text-foreground shadow-sm" : "enabled:hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

interface IBackgroundFieldProps {
  id: string;
  label: string;
  value: IChatBackground;
  onChange: (value: IChatBackground) => void;
}

export const BackgroundField = ({ id, label, value, onChange }: IBackgroundFieldProps) => (
  <div className="flex flex-col gap-3">
    <ToggleField label={label} checked={value.enabled} onChange={(enabled) => onChange({ ...value, enabled })} />
    <ColorField
      id={`${id}-color`}
      label="Background color"
      value={value.color}
      disabled={!value.enabled}
      onChange={(color) => onChange({ ...value, color })}
    />
    <RangeField
      id={`${id}-opacity`}
      label="Background opacity"
      valueLabel={`${value.opacity}%`}
      value={value.opacity}
      min={0}
      max={100}
      disabled={!value.enabled}
      onChange={(opacity) => onChange({ ...value, opacity })}
    />
    <SegmentedField
      label="Padding"
      value={value.padding}
      options={PADDING_OPTIONS}
      disabled={!value.enabled}
      onChange={(padding) => onChange({ ...value, padding })}
    />
  </div>
);
