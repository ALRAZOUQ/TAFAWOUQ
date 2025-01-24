import {
    isEmail,
    isEqualToOtherValue,
    isEmpty,
    hasMinLength,
  } from "./validation.js";
export function handleSignupSubmission(prevFormState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  let errors = [];

  // Validate email
  if (!isEmail(email)) {
    errors.push("not email");
  }

  // Validate password length and emptiness
  if (!hasMinLength(password, 8) || isEmpty(password)) {
    errors.push("password is empty or has characters less than minimum length");
  }

  // Validate password and confirm password match
  if (!isEqualToOtherValue(password, confirmPassword)) {
    errors.push("password and confirm password does not match");
  }

  // Return errors if any exist
  if (errors.length > 0) {
    return {
      errors,
      enteredValues: {
        email,
        password,
        confirmPassword,
      },
    };
  }

  // If no errors, return null errors
  return { errors: null };
}
