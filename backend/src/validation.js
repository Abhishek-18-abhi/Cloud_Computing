export function cleanText(value, field, { required = true, max = 255 } = {}) {
  const text = typeof value === "string" ? value.trim() : "";
  if (required && !text) throw new Error(`${field} is required.`);
  if (text.length > max) throw new Error(`${field} must be at most ${max} characters.`);
  return text || null;
}

export function email(value, { required = true } = {}) {
  const result = cleanText(value, "Email", { required, max: 100 });
  if (result && !/^\S+@\S+\.\S+$/.test(result)) throw new Error("Email is not valid.");
  return result?.toLowerCase() || null;
}
