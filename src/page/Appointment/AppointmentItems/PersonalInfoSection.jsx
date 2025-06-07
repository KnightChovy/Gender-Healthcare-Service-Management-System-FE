import React from "react";
import classNames from "classnames/bind";
import styles from "../Appointment.module.scss";

const cx = classNames.bind(styles);

function PersonalInfoSection({formData, errors, onChange}) {
    return (  
        <div className={cx('form-section')}>
            <h3>📋 Thông tin cá nhân</h3>

            <div className={cx('form-row')}>
                <div className={cx('form-group')} style={{ display: 'block'}}>
                    <label htmlFor="fullName">Họ và tên *</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={errors.fullName ? cx('error') : ''}
                    />
                    {errors.fullName && <span className={cx('error-message')}>{errors.fullName}</span>}
                </div>

                <div className={cx('form-group')} style={{ display: 'block'}}>
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        placeholder="0123456789"
                        className={errors.phone ? cx('error') : ''}
                    />
                    {errors.phone && <span className={cx('error-message')}>{errors.phone}</span>}
                </div>
            </div>

            <div className={cx('form-row')}>
                <div className={cx('form-group')} style={{ display: 'block'}}>
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="example@email.com"
                        className={errors.email ? cx('error') : ''}
                    />
                    {errors.email && <span className={cx('error-message')}>{errors.email}</span>}
                </div>

                <div className={cx('form-group')} style={{ display: 'block'}}>
                    <label htmlFor="birthDate">Ngày sinh *</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={onChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={errors.birthDate ? cx('error') : ''}
                    />
                    {errors.birthDate && <span className={cx('error-message')}>{errors.birthDate}</span>}
                </div>
            </div>

            <div className={cx('form-group')}>
                <label htmlFor="gender-female">Giới tính *</label>
                <div className={cx('radio-group')}>
                    <label className={cx('radio-label')}>
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
                    <label className={cx('radio-label')}>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={onChange}
                        />
                        <span>Nam</span>
                    </label>
                </div>
                {errors.gender && <span className={cx('error-message')}>{errors.gender}</span>}
            </div>
        </div>
    );
}

export default PersonalInfoSection;