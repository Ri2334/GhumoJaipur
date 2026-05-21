export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

export const validateName = (name) => {
  return /^[A-Za-z ]{2,50}$/.test(name.trim());
};

export const validateMobile = (m) => {
  return /^[0-9]{7,15}$/.test(m);
};

export const validatePassword = (pw) => {
  // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special
  return /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*/.test(pw);
};
