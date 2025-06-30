import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function UserStatusCard({ isLoggedIn, userProfile }) {
    if (isLoggedIn && userProfile) {
        return (
            <div className="max-w-4xl mx-auto px-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-800 mb-1">
                                Chào mừng, {userProfile.first_name} {userProfile.last_name}!
                            </h3>
                            <p className="text-green-600 text-sm mb-2">
                                Thông tin cá nhân của bạn đã được điền tự động
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-green-700">
                                <span className="flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-1" />
                                    {userProfile.email}
                                </span>
                                <span className="flex items-center">
                                    📞 {userProfile.phone}
                                </span>
                                <span className="flex items-center">
                                    🎂 {userProfile.birthday}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-4xl mx-auto px-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                                Bạn chưa đăng nhập
                            </h3>
                            <p className="text-yellow-600 text-sm">
                                Vui lòng điền thông tin cá nhân bên dưới hoặc{' '}
                                <a href="/login" className="font-medium text-yellow-700 hover:text-yellow-800 underline">
                                    đăng nhập
                                </a>{' '}
                                để được điền tự động
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

UserStatusCard.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    userProfile: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        birthday: PropTypes.string
    })
};

export default UserStatusCard;
