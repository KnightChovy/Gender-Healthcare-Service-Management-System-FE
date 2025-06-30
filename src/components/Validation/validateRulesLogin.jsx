export const validateRulesLogin = (formData) => {
  const errors = {};

  // Username validation
  if (!formData.username?.trim()) {
    errors.username = "Tên đăng nhập là bắt buộc";
  } else if (formData.username.length < 3) {
    errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  } else if (!/^\w+$/.test(formData.username)) {
    errors.username = "Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới";
  }

  // Password validation
  if (!formData.password?.trim()) {
    errors.password = "Mật khẩu là bắt buộc";
  } else if (formData.password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
  }

  return errors;
};
