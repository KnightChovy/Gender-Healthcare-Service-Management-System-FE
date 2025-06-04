import React from "react";

function PersonalInfoSection({formData, errors, onChange}) {
    return (  
        <div className="form-section">
            <h3>📋 Thông tin cá nhân</h3>
            
            <div className="form-row">
                <div className="form-group" style={{ display: 'block'}}>
                    <label htmlFor="fullName">Họ và tên *</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group" style={{ display: 'block'}}>
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        placeholder="0123456789"
                        className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" style={{ display: 'block'}}>
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="example@email.com"
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group" style={{ display: 'block'}}>
                    <label htmlFor="birthDate">Ngày sinh *</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={onChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={errors.birthDate ? 'error' : ''}
                    />
                    {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
                </div>
            </div>

            <div className="form-group" style={{ display: 'block'}}>
                <label htmlFor="gender-female">Giới tính *</label>
                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            id="gender-female"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={onChange}
                        />
                        <span>Nữ</span>
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={onChange}
                        />
                        <span>Nam</span>
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={formData.gender === 'other'}
                            onChange={onChange}
                        />
                        <span>Khác</span>
                    </label>
                </div>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
        </div>
    );
}

export default PersonalInfoSection;