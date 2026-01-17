export function formatPrice(amountCents: number) {
  const amount = amountCents / 100;
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} UM`;
}
