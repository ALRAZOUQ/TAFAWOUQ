export function errorMapping(value) {
  if (value === "not email") {
    return "الإيميل غير صالح";
  } else if (
    value === "password is empty or has characters less than minimum length"
  ) {
    return "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";
  } else if (value === "password and confirm password does not match") {
    return "كلمة المرور و تأكيد كلمة المرور لا يتشابهان";
  } else if (value === "name is empty") {
    return "الإسم لا يمكن ان يكون فارغا";
  } else if (value === "email or password cannot be empty") {
    return "لديك بعض الحقول الفارغة الرجاء تعبئتها";
  } else {
    return "خطأ غير معروف";
  }
}
