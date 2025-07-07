import React from "react";

function PersonalInfoSection({formData, errors, onChange}) {
    return (  
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                📋 Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md ${
                            errors.fullName ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.fullName && (
                        <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        placeholder="0123456789"
                        className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md ${
                            errors.phone ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="example@email.com"
                        className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md ${
                            errors.email ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                        Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={onChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md ${
                            errors.birthDate ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.birthDate && (
                        <p className="mt-2 text-sm text-red-600">{errors.birthDate}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={onChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="female">Nữ</option>
                        <option value="male">Nam</option>
                    </select>
                    {errors.gender && (
                        <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                    )}
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Địa chỉ
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={onChange}
                        placeholder="Nhập địa chỉ của bạn"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
}

export default PersonalInfoSection;
