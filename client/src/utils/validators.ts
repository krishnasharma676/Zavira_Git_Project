// ─────────────────────────────────────────────────────────────────────────────
//  Zavira — Central Validation Utility
//  Import from: utils/validators.ts
// ─────────────────────────────────────────────────────────────────────────────

// ── Field-level validators (return error string, or '' if valid) ──────────────

export const V = {
  /** Exactly 6 numeric digits */
  pincode: (v: string) =>
    /^\d{6}$/.test(v) ? '' : 'Pincode must be exactly 6 digits',

  /** 10-digit Indian mobile starting with 6-9 */
  phone: (v: string) =>
    /^[6-9]\d{9}$/.test(v) ? '' : 'Enter a valid 10-digit Indian mobile number',

  /** Letters only, min 2 chars */
  firstName: (v: string) =>
    /^[A-Za-z]{2,}$/.test(v.trim()) ? '' : 'First name: letters only, min 2 characters',

  /** Optional — if filled, letters only */
  lastName: (v: string) =>
    !v || /^[A-Za-z\s]{1,}$/.test(v.trim()) ? '' : 'Last name: letters only',

  /** Full name (for address receiver etc.) min 2 chars */
  fullName: (v: string) =>
    v.trim().length >= 2 ? '' : 'Name must be at least 2 characters',

  /** Valid email format */
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address',

  /** Min 5 chars for house/street */
  address: (v: string) =>
    v.trim().length >= 5 ? '' : 'Please enter a valid address (min 5 chars)',

  /** Min 3 chars for area/sector */
  area: (v: string) =>
    v.trim().length >= 3 ? '' : 'Please enter area / street name',

  /** Letters & spaces only, min 2 */
  city: (v: string) =>
    /^[A-Za-z\s]{2,}$/.test(v.trim()) ? '' : 'City must contain only letters',

  /** Letters & spaces only, min 2 */
  state: (v: string) =>
    /^[A-Za-z\s]{2,}$/.test(v.trim()) ? '' : 'State must contain only letters',

  /** Password min 6 chars */
  password: (v: string) =>
    v.length >= 6 ? '' : 'Password must be at least 6 characters',

  /** Non-empty subject */
  subject: (v: string) =>
    v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters',

  /** Non-empty message */
  message: (v: string) =>
    v.trim().length >= 10 ? '' : 'Message must be at least 10 characters',

  /** Review comment */
  comment: (v: string) =>
    v.trim().length >= 5 ? '' : 'Review must be at least 5 characters',

  /** Order number format: ORD-... */
  orderNumber: (v: string) =>
    v.trim().length >= 3 ? '' : 'Enter a valid order number',

  /** GSTIN: 15-char format */
  gstin: (v: string) =>
    !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.toUpperCase())
      ? ''
      : 'Invalid GSTIN — format: 07AABCU9603R1ZX',

  /** Min 3 chars for landmark */
  landmark: (v: string) =>
    v.trim().length >= 3 ? '' : 'Landmark must be at least 3 characters',

  /** Any required field — just not empty */
  required: (v: string, label = 'This field') =>
    v.trim().length > 0 ? '' : `${label} is required`,
};

// ── Keyboard-level blockers (return true = allow, false = block) ──────────────

export const KB = {
  /** Only digits */
  numericOnly: (value: string) => /^\d*$/.test(value),

  /** Only letters and spaces */
  lettersOnly: (value: string) => /^[A-Za-z\s]*$/.test(value),

  /** Block digits in a string */
  noDigits: (value: string) => !/\d/.test(value),
};

// ── Convenience: run validators on a fields map ───────────────────────────────

type ValidatorMap = Record<string, (v: string) => string>;

export function validateAll(
  fields: Record<string, string>,
  rules: ValidatorMap
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key in rules) {
    const err = rules[key](fields[key] ?? '');
    if (err) errors[key] = err;
  }
  return errors;
}

// ── Input className helper (red border on error, purple on focus) ─────────────
export const inputCls = (
  error: string | undefined,
  base = 'w-full border rounded-none px-4 py-3 text-xs font-bold focus:outline-none transition-all'
) =>
  `${base} ${
    error
      ? 'border-red-400 bg-red-50 focus:border-red-500'
      : 'border-gray-100 bg-gray-50/50 focus:border-[#7A578D]'
  }`;

// ── Small component helper: error paragraph ───────────────────────────────────
export const errMsg = (msg: string | undefined) =>
  msg ? `<p class="text-[9px] text-red-500 font-bold ml-1 mt-0.5">${msg}</p>` : '';
