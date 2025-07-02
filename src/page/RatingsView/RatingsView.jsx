import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faStar, 
    faCalendarAlt, 
    faFlask, 
    faUser,
    faComment,
    faFilter
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

const RatingsView = () => {
    const [ratings, setRatings] = useState([]);
    const [filteredRatings, setFilteredRatings] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRatings();
    }, []);

    useEffect(() => {
        filterRatings();
    }, [ratings, filterType, filterRating]);

    const loadRatings = () => {
        try {
            const storedRatings = JSON.parse(localStorage.getItem('ratings') || '[]');
            // Sort by timestamp descending (newest first)
            const sortedRatings = storedRatings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setRatings(sortedRatings);
        } catch (error) {
            console.error('Error loading ratings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterRatings = () => {
        let filtered = ratings;

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(rating => rating.requestType === filterType);
        }

        // Filter by rating
        if (filterRating !== 'all') {
            const minRating = parseInt(filterRating);
            filtered = filtered.filter(rating => 
                rating.serviceRating >= minRating || rating.doctorRating >= minRating
            );
        }

        setFilteredRatings(filtered);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={`w-4 h-4 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAverageRating = () => {
        if (filteredRatings.length === 0) return 0;
        const total = filteredRatings.reduce((sum, rating) => 
            sum + rating.serviceRating + rating.doctorRating, 0
        );
        return (total / (filteredRatings.length * 2)).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        filteredRatings.forEach(rating => {
            distribution[rating.serviceRating]++;
            distribution[rating.doctorRating]++;
        });
        return distribution;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải đánh giá...</p>
                    </div>
                </div>
            </div>
        );
    }

    const ratingDistribution = getRatingDistribution();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
            <Navbar />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Đánh giá dịch vụ
                        </h1>
                        <p className="text-gray-600">
                            Xem và phân tích đánh giá từ bệnh nhân
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faStar} className="h-8 w-8 text-yellow-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Đánh giá trung bình
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {getAverageRating()}/5.0
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faComment} className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng đánh giá
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {filteredRatings.length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tư vấn
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {filteredRatings.filter(r => r.requestType === 'appointment').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faFlask} className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Xét nghiệm
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {filteredRatings.filter(r => r.requestType === 'test').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <div className="flex items-center space-x-4">
                            <FontAwesomeIcon icon={faFilter} className="h-5 w-5 text-gray-400" />
                            <div className="flex space-x-4">
                                <div>
                                    <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại dịch vụ
                                    </label>
                                    <select
                                        id="filterType"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="appointment">Tư vấn</option>
                                        <option value="test">Xét nghiệm</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="filterRating" className="block text-sm font-medium text-gray-700 mb-1">
                                        Đánh giá tối thiểu
                                    </label>
                                    <select
                                        id="filterRating"
                                        value={filterRating}
                                        onChange={(e) => setFilterRating(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="5">5 sao</option>
                                        <option value="4">4 sao trở lên</option>
                                        <option value="3">3 sao trở lên</option>
                                        <option value="2">2 sao trở lên</option>
                                        <option value="1">1 sao trở lên</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {filteredRatings.length === 0 ? (
                            <div className="text-center py-12">
                                <FontAwesomeIcon icon={faStar} className="text-4xl text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Chưa có đánh giá nào
                                </h3>
                                <p className="text-gray-500">
                                    Chưa có đánh giá nào phù hợp với bộ lọc hiện tại.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filteredRatings.map((rating) => (
                                    <div key={rating.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-start space-x-4">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                rating.requestType === 'appointment' 
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-purple-100 text-purple-600'
                                            }`}>
                                                <FontAwesomeIcon 
                                                    icon={rating.requestType === 'appointment' ? faCalendarAlt : faFlask} 
                                                    className="w-5 h-5" 
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                        {rating.patientName}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(rating.timestamp)}
                                                    </span>
                                                </div>

                                                <div className="mb-3">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        rating.requestType === 'appointment'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {rating.requestType === 'appointment' ? 'Tư vấn' : 'Xét nghiệm'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Dịch vụ:</span>
                                                        <div className="flex items-center mt-1">
                                                            {renderStars(rating.serviceRating)}
                                                            <span className="ml-2 text-sm text-gray-600">
                                                                ({rating.serviceRating}/5)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Bác sĩ:</span>
                                                        <div className="flex items-center mt-1">
                                                            {renderStars(rating.doctorRating)}
                                                            <span className="ml-2 text-sm text-gray-600">
                                                                ({rating.doctorRating}/5)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {rating.comment && (
                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                        <span className="text-sm font-medium text-gray-700">Nhận xét:</span>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            "{rating.comment}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rating Distribution */}
                    {filteredRatings.length > 0 && (
                        <div className="mt-8 bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Phân bổ đánh giá
                            </h3>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700 w-8">
                                            {star}
                                        </span>
                                        <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-2" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{
                                                    width: `${filteredRatings.length > 0 
                                                        ? (ratingDistribution[star] / (filteredRatings.length * 2)) * 100 
                                                        : 0}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">
                                            {ratingDistribution[star]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default RatingsView;
