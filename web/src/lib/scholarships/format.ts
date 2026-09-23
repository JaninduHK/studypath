export function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
  return (words[0]?.[0] ?? "").toUpperCase() + (words[1]?.[0] ?? "").toUpperCase();
}
