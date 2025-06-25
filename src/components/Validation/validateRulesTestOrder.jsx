export const validateTestOrderRules = () => ({
    fullName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
        message: 'Họ tên chỉ chứa chữ cái và khoảng trắng'
    },
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Email không hợp lệ'
    },
    phone: {
        required: true,
        pattern: /^(\+84|84|0)(3[2-9]|5[689]|7[0679]|8[16-9]|9[0-46-9])\d{7}$/,
        message: 'Số điện thoại không hợp lệ'
    },
    birthDate: {
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        message: 'Ngày sinh không hợp lệ'
    },
    gender: {
        required: true,
        pattern: /^(male|female|other)$/,
        message: 'Vui lòng chọn giới tính'
    },
    testType: {
        required: true,
        message: 'Vui lòng chọn loại xét nghiệm'
    },
    preferredDate: {
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        message: 'Ngày mong muốn không hợp lệ'
    },
    preferredTime: {
        required: true,
        pattern: /^\d{2}:\d{2}$/,
        message: 'Giờ mong muốn không hợp lệ'
    },
    healthInsurance: {
        required: false,
        pattern: /^[a-zA-Z0-9\s-]*$/,
        message: 'Số thẻ bảo hiểm y tế không hợp lệ'
    },
    priority: {
        required: true,
        pattern: /^(normal|urgent|very-urgent)$/,
        message: 'Độ ưu tiên không hợp lệ'
    }
});

export const validateTestOrderForm = (formData) => {
    const rules = validateTestOrderRules();
    const errors = {};

    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = formData[field];

        // Check required fields
        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = `${getFieldDisplayName(field)} là bắt buộc`;
            return;
        }

        // Skip validation for empty optional fields
        if (!rule.required && (!value || value.trim() === '')) {
            return;
        }

        // Validate field based on rules
        validateField(field, value, rule, errors);
    });

    return errors;
};

const validateField = (field, value, rule, errors) => {
    // Check minimum length
    if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${getFieldDisplayName(field)} phải có ít nhất ${rule.minLength} ký tự`;
        return;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `${getFieldDisplayName(field)} không hợp lệ`;
        return;
    }

    // Special validations
    if (field === 'preferredDate') {
        validatePreferredDate(value, errors, field);
    }

    if (field === 'birthDate') {
        validateBirthDate(value, errors, field);
    }
};

const validatePreferredDate = (value, errors, field) => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errors[field] = 'Ngày mong muốn không thể là ngày quá khứ';
    }
};

const validateBirthDate = (value, errors, field) => {
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (birthDate >= today) {
        errors[field] = 'Ngày sinh không thể là ngày tương lai';
        return;
    }
    
    if (age > 120 || age < 0) {
        errors[field] = 'Ngày sinh không hợp lệ';
    }
};

const getFieldDisplayName = (field) => {
    const displayNames = {
        fullName: 'Họ và tên',
        email: 'Email',
        phone: 'Số điện thoại',
        birthDate: 'Ngày sinh',
        gender: 'Giới tính',
        testType: 'Loại xét nghiệm',
        preferredDate: 'Ngày mong muốn',
        preferredTime: 'Giờ mong muốn',
        healthInsurance: 'Số thẻ bảo hiểm y tế',
        priority: 'Độ ưu tiên'
    };

    return displayNames[field] || field;
};
