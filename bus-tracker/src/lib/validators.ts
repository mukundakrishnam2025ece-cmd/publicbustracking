/**
 * Validates Indian 10-digit mobile number format (starts with 6-9, followed by 9 digits)
 */
export function validate10DigitPhone(phone: string): { isValid: boolean; message: string } {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 0) {
    return { isValid: false, message: "Phone number is required." };
  }
  
  if (cleaned.length !== 10) {
    return { isValid: false, message: `Phone number must be exactly 10 digits (entered ${cleaned.length} digits).` };
  }
  
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: false, message: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9." };
  }
  
  return { isValid: true, message: "" };
}

/**
 * Sanitizes input to only allow up to 10 digits
 */
export function sanitizePhoneInput(input: string): string {
  return input.replace(/\D/g, "").slice(0, 10);
}
