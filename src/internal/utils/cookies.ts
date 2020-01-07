export function get(name: string): string | undefined {
  const match = document.cookie.split(/;\s*/).map(s => s.split("=")).filter(p => p[0] === name)[0];
  return match && match[1] && decodeURIComponent(match[1]) || undefined;
}

export function set(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}`;
}
