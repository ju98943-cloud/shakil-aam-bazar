const bnDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
export function toBn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => bnDigits[+d]);
}
export function bdt(n: number): string {
  return `৳ ${toBn(n.toLocaleString("en-US"))}`;
}
