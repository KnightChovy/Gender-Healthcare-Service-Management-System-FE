export const validateRules = (formData) => {
    const errors = {};

    if (!formData.firstname?.trim()) errors.firstname = 'Tên là bắt buộc';
    else if (formData.firstname.length < 2) errors.firstname = 'Tên phải có ít nhất 2 ký tự';
    else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.firstname)) errors.firstname = 'Tên chỉ chứa chữ cái';

    if (!formData.lastname?.trim()) errors.lastname = 'Họ là bắt buộc';
    else if (formData.lastname.length < 2) errors.lastname = 'Họ phải có ít nhất 2 ký tự';
    else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.lastname)) errors.lastname = 'Họ chỉ chứa chữ cái và khoảng trắng';

    if (!formData.username?.trim()) errors.username = 'Tên đăng nhập là bắt buộc';
    else if (formData.username.length < 3) errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    else if (!/^\w+$/.test(formData.username)) errors.username = 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới';

    if (!formData.email?.trim()) errors.email = 'Email là bắt buộc';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) errors.email = 'Email không hợp lệ';

    if (!formData.phone?.trim()) errors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^(\+84|84|0)(3[2-9]|5[689]|7[0679]|8[1-689]|9[0-46-9])\d{7}$/.test(formData.phone)) errors.phone = 'Số điện thoại không hợp lệ';

    if (!formData.address?.trim()) errors.address = 'Địa chỉ là bắt buộc';
    else if (formData.address.length < 5) errors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
    else if (!/^[a-zA-ZÀ-ỹ0-9\s,.'-]{5,}$/.test(formData.address)) errors.address = 'Địa chỉ không hợp lệ';

    if (!formData.password?.trim()) errors.password = 'Mật khẩu là bắt buộc';
    else if (formData.password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        errors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

    if (!formData.confirmPassword?.trim()) errors.confirmPassword = 'Mật khẩu xác nhận là bắt buộc';
    else if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    return errors;
};