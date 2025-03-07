export function isEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function hasMinLength(value, minLength) {
  return value && value.length >= minLength;
}

export function isEmpty(value) {
  return !value || value.trim() === "";
}

export function isEqualToOtherValue(value1, value2) {
  return value1 === value2;
}
