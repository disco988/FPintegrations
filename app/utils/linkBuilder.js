export function getFprTid() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)_fprom_tid=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}


export function withFprTid(chargebeeUrl) {
  const tid = getFprTid();
  if (!tid) return chargebeeUrl;

  const separator = chargebeeUrl.includes("?") ? "&" : "?";
  return `${chargebeeUrl}${separator}customer[cf_tid]=${encodeURIComponent(tid)}`;
}

