import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faHeart, faCalendar, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import { blogPosts, blogCategories } from '../../data/blogs';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        // Lấy danh sách blog từ localStorage hoặc dữ liệu mặc định
        const savedBlogs = JSON.parse(localStorage.getItem('blogPosts')) || blogPosts;
        const publishedPosts = savedBlogs.filter(post => post.status === 'published');
        setPosts(publishedPosts);
        setFilteredPosts(publishedPosts);
    }, []);

    useEffect(() => {
        let filtered = posts;

        // Lọc theo category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(post => 
                post.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Sắp xếp
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
                case 'oldest':
                    return new Date(a.publishedAt) - new Date(b.publishedAt);
                case 'mostViewed':
                    return b.views - a.views;
                case 'mostLiked':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
    }, [posts, selectedCategory, searchTerm, sortBy]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryColor = (categoryName) => {
        const category = blogCategories.find(cat => 
            cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        return category ? category.color : '#3B82F6';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                        Blog Sức Khỏe
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                        Chia sẻ kiến thức y tế từ các chuyên gia hàng đầu
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Tất cả chủ đề</option>
                                {blogCategories.map(category => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="mostViewed">Xem nhiều nhất</option>
                                <option value="mostLiked">Yêu thích nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Hiển thị {filteredPosts.length} bài viết
                        {selectedCategory !== 'all' && ` trong chủ đề "${selectedCategory}"`}
                        {searchTerm && ` cho từ khóa "${searchTerm}"`}
                    </p>
                </div>

                {/* Blog Posts */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                            <div className="relative">
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                    <span 
                                        className="text-white px-3 py-1 rounded-full text-sm font-medium"
                                        style={{ backgroundColor: getCategoryColor(post.category) }}
                                    >
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <img 
                                        src={post.author.avatar} 
                                        alt={post.author.name}
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    <span className="flex items-center">
                                        <FontAwesomeIcon icon={faUser} className="mr-1" />
                                        {post.author.name}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                        {formatDate(post.publishedAt)}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {post.title}
                                </h3>
                                
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                                            {post.readTime} phút
                                        </span>
                                        <span className="flex items-center">
                                            <FontAwesomeIcon icon={faEye} className="mr-1" />
                                            {post.views}
                                        </span>
                                        <span className="flex items-center">
                                            <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                            {post.likes}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <span 
                                            key={tag}
                                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <Link 
                                    to={`/blog/${post.slug}`}
                                    className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Đọc bài viết
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* No results */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Không tìm thấy bài viết
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Hãy thử tìm kiếm với từ khóa khác hoặc chọn chủ đề khác
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                            Xem tất cả bài viết
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BlogPage;
