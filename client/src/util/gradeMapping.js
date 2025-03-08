function removeSpaces(str) {
  return str.replace(/\s+/g, "");
}
export function gradeMapping(grade) {
  removeSpaces(grade);
  grade.toLowerCase();
  if (
    grade === "a+" ||
    grade === "أ+" ||
    grade === "+أ" ||
    grade === "+a" ||
    Number(grade) === 5
  )
    return 5;
  else if (grade === "أ" || grade === "a" || Number(grade) === 4.75)
    return 4.75;
  else if (
    grade === "b+" ||
    grade === "ب+" ||
    grade === "+ب" ||
    grade === "+b" ||
    Number(grade) === 4.5
  )
    return 4.5;
  else if (grade === "ب" || grade === "b" || Number(grade) === 4) return 4;
  else if (
    grade === "c+" ||
    grade === "ج+" ||
    grade === "+ج" ||
    grade === "+c" ||
    Number(grade) === 3.5
  )
    return 3.5;
  else if (grade === "ج" || grade === "c" || Number(grade) === 3) return 3;
  else if (
    grade === "d+" ||
    grade === "د+" ||
    grade === "+د" ||
    grade === "+d" ||
    Number(grade) === 2.5
  )
    return 2.5;
  else if (grade === "d" || grade === "د" || Number(grade) === 2) return 2;
  else if (grade === "ه" || grade === "f" || Number(grade) === 1) return 1;
  else {
    throw new Error("it must be from one of the predefined values");
  }
}
