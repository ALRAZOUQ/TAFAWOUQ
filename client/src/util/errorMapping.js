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
  } else if (value === "email or password is incorrect") {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة ";
  } else if (value === "An account with this email already exists") {
    return "هناك حساب مسجل بهذا البريد الإلكتروني بالفعل";
  } else if (value === "This account is banded") {
    return "عذرا هذا الحساب محظور";
  } else if (value === "terms not agreed") {
    return "يجب الموافقة على الشروط والأحكام";
  } else {
    return "خطأ غير معروف";
  }
}
