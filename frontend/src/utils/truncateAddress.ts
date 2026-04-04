export function truncateAddress(
  address: string,
  start = 10,
  end = 8,
): string {
  if (address.length <= start + end + 1) return address;
  return `${address.slice(0, start)}…${address.slice(-end)}`;
}
