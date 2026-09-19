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

/** "50671565232" -> "+506 7156 5232". Formatea código país (3) + resto en grupos de 4. */
export function formatPhoneDisplay(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  if (clean.length <= 3) return clean ? `+${clean}` : "";
  const country = clean.slice(0, 3);
  const rest = clean.slice(3).replace(/(\d{4})(?=\d)/g, "$1 ");
  return `+${country} ${rest}`;
}
