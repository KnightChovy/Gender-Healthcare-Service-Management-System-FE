import React from "react";
import PropTypes from 'prop-types';

function PersonalInfoSection({formData, errors, onChange}) {
    return (  
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                📋 Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                        Họ và tên *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fullName ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.fullName && <span className="text-red-500 text-sm font-medium">{errors.fullName}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                        Số điện thoại *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        placeholder="0123456789"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.phone && <span className="text-red-500 text-sm font-medium">{errors.phone}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="example@email.com"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.email && <span className="text-red-500 text-sm font-medium">{errors.email}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700">
                        Ngày sinh *
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={onChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.birthDate ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.birthDate && <span className="text-red-500 text-sm font-medium">{errors.birthDate}</span>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="gender-female" className="block text-sm font-semibold text-gray-700">
                    Giới tính *
                </label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white">
                        <input
                            type="radio"
                            id="gender-female"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={onChange}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 font-medium">Nữ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={onChange}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 font-medium">Nam</span>
                    </label>
                </div>
                {errors.gender && <span className="text-red-500 text-sm font-medium">{errors.gender}</span>}
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