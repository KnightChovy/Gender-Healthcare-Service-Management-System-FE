import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FormInputText from '../../../components/ui/FormInputText';

function PersonalInfoSection({ formData, errors, onChange }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Thông Tin Cá Nhân</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
                    <FormInputText
                        textHolder="Nhập họ và tên"
                        textName="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Ngày sinh *</label>
                    <input
                        id="birthDate"
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.birthDate && <span className="text-red-500 text-sm">{errors.birthDate}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính *</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="female">Nữ</option>
                        <option value="male">Nam</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
                    <FormInputText
                        textHolder="Nhập số điện thoại"
                        textName="phone"
                        value={formData.phone}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <FormInputText
                        textHolder="Nhập email"
                        textName="email"
                        type="email"
                        value={formData.email}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <FormInputText
                        textHolder="Nhập địa chỉ"
                        textName="address"
                        value={formData.address}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}

PersonalInfoSection.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default PersonalInfoSection;
