const currencyFormatter = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

export function formatColones(value: number): string {
  return currencyFormatter.format(value).replace("CRC", "₡").replace(/\s+/g, " ").trim();
}

export function formatDiscountPercent(regular: number, current: number): number {
  if (!regular || regular <= current) return 0;
  return Math.round(((regular - current) / regular) * 100);
}
