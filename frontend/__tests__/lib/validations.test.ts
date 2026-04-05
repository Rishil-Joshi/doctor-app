import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFirstName,
  validateLastName,
  validateUsername,
  validateConfirmPassword,
} from '@/lib/validations';

describe('validateEmail', () => {
  it('returns valid for empty string (email is optional)', () => {
    expect(validateEmail('')).toEqual({ isValid: true });
    expect(validateEmail('   ')).toEqual({ isValid: true });
  });

  it('returns valid for a correct email', () => {
    expect(validateEmail('doctor@hospital.com')).toEqual({ isValid: true });
  });

  it('returns invalid for a malformed email', () => {
    const result = validateEmail('not-an-email');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validatePassword', () => {
  it('returns invalid when empty', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  it('returns invalid when shorter than minimum length', () => {
    const result = validatePassword('abc');
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/5 characters/i);
  });

  it('returns valid for a password that meets requirements', () => {
    expect(validatePassword('secure123')).toEqual({ isValid: true });
  });
});

describe('validatePhone', () => {
  it('returns invalid when empty', () => {
    const result = validatePhone('');
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  it('returns invalid when not 10 digits', () => {
    expect(validatePhone('12345').isValid).toBe(false);
    expect(validatePhone('12345678901').isValid).toBe(false);
  });

  it('returns valid for a 10-digit phone number', () => {
    expect(validatePhone('9876543210')).toEqual({ isValid: true });
  });

  it('strips non-digit characters before validating', () => {
    // 10 digits with formatting → valid
    expect(validatePhone('98 7654 3210').isValid).toBe(true);
    // 12 digits (country code included) → invalid (exceeds 10)
    expect(validatePhone('+91 98765 43210').isValid).toBe(false);
  });
});

describe('validateFirstName', () => {
  it('returns invalid when empty', () => {
    expect(validateFirstName('').isValid).toBe(false);
  });

  it('returns valid for a non-empty name', () => {
    expect(validateFirstName('John')).toEqual({ isValid: true });
  });
});

describe('validateLastName', () => {
  it('returns invalid when empty', () => {
    expect(validateLastName('').isValid).toBe(false);
  });

  it('returns valid for a non-empty name', () => {
    expect(validateLastName('Doe')).toEqual({ isValid: true });
  });
});

describe('validateUsername', () => {
  it('returns invalid when empty', () => {
    expect(validateUsername('').isValid).toBe(false);
  });

  it('returns valid for a non-empty username', () => {
    expect(validateUsername('drsmith')).toEqual({ isValid: true });
  });
});

describe('validateConfirmPassword', () => {
  it('returns invalid when confirmPassword is empty', () => {
    expect(validateConfirmPassword('pass123', '').isValid).toBe(false);
  });

  it('returns invalid when passwords do not match', () => {
    const result = validateConfirmPassword('pass123', 'different');
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/match/i);
  });

  it('returns valid when passwords match', () => {
    expect(validateConfirmPassword('pass123', 'pass123')).toEqual({ isValid: true });
  });
});
