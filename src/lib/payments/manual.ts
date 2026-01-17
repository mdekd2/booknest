export const manualPayments = {
  bankily: "31777732",
  sedad: "31777732",
  masrivi: "31777732",
  whatsappNumber: "22231777732",
};

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${manualPayments.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}
