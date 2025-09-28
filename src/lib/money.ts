export const toDollars = (cents: number) => Math.round(cents) / 100;
export const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });