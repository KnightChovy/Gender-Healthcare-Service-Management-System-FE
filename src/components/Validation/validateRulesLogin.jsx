export const validateRulesLogin = () => ({
  username: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới",
  },
  password: {
    required: true,
    minLength: 8,
    message: "Mật khẩu phải có ít nhất 8 ký tự",
  },
});
