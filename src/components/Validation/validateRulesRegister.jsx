export const validateRules = (formData) => ({
        firstname: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
            message: 'Tên chỉ chứa chữ cái'
        },
        lastname: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
            message: 'Họ chỉ chứa chữ cái và khoảng trắng'
        },
        username: {
            required: true,
            minLength: 3,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới'
        },
        email: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Email không hợp lệ'
        },
        phone: {
            required: true,
            pattern: /^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
            message: 'Số điện thoại không hợp lệ'
        },
        address: {
            required: true,
            minLength: 5,
            pattern: /^[a-zA-ZÀ-ỹ0-9\s,.'-]{5,}$/,
            message: 'Địa chỉ phải có ít nhất 5 ký tự'
        },
        password: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
        },
        confirmPassword: {
            required: true,
            confirmPassword: formData.password,
            message: 'Mật khẩu xác nhận không khớp',
        }
    });