const compactFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export const formatCompact = (value: number) => compactFormatter.format(value);

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
