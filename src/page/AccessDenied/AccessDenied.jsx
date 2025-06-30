import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

function AccessDenied() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-red-600" />
                        </div>
                        
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Truy cập bị từ chối
                        </h1>
                        
                        <p className="text-gray-600 mb-6">
                            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản có quyền hạn phù hợp.
                        </p>
                        
                        <div className="space-y-3">
                            <Link
                                to="/"
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FontAwesomeIcon icon={faHome} className="mr-2" />
                                Về trang chủ
                            </Link>
                            
                            <Link
                                to="/login"
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                                Đăng nhập lại
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default AccessDenied;
