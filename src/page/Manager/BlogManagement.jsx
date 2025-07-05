import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faSearch, faFilter, faCalendar, faBars, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { blogPosts, blogCategories, blogStats } from '../../data/blogs';
import BlogFormModal from './BlogFormModal';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [stats, setStats] = useState(blogStats);

    useEffect(() => {
        // Lấy danh sách blog từ localStorage hoặc dữ liệu mặc định
        const savedBlogs = JSON.parse(localStorage.getItem('blogPosts')) || blogPosts;
        setBlogs(savedBlogs);
        setFilteredBlogs(savedBlogs);
        calculateStats(savedBlogs);
    }, []);

    useEffect(() => {
        let filtered = blogs;

        // Lọc theo category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(blog => 
                blog.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Lọc theo status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(blog => blog.status === selectedStatus);
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Sắp xếp theo ngày tạo mới nhất
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        setFilteredBlogs(filtered);
    }, [blogs, selectedCategory, selectedStatus, searchTerm]);

    const calculateStats = (blogList) => {
        const totalViews = blogList.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = blogList.reduce((sum, blog) => sum + blog.likes, 0);
        const publishedCount = blogList.filter(blog => blog.status === 'published').length;
        
        setStats({
            totalPosts: blogList.length,
            publishedPosts: publishedCount,
            totalViews: totalViews,
            totalLikes: totalLikes
        });
    };

    const handleAddBlog = () => {
        setEditingBlog(null);
        setShowFormModal(true);
    };

    const handleEditBlog = (blog) => {
        setEditingBlog(blog);
        setShowFormModal(true);
    };

    const handleDeleteBlog = (blogId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
            setBlogs(updatedBlogs);
            localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
            calculateStats(updatedBlogs);
        }
    };

    const handleSaveBlog = (blogData) => {
        let updatedBlogs;
        
        if (editingBlog) {
            // Cập nhật blog
            updatedBlogs = blogs.map(blog => 
                blog.id === editingBlog.id ? { ...blog, ...blogData } : blog
            );
        } else {
            // Thêm blog mới
            const newBlog = {
                ...blogData,
                id: `BLOG_${Date.now()}`,
                publishedAt: new Date().toISOString(),
                views: 0,
                likes: 0,
                author: {
                    name: 'Quản lý hệ thống',
                    avatar: '/api/placeholder/100/100'
                }
            };
            updatedBlogs = [newBlog, ...blogs];
        }
        
        setBlogs(updatedBlogs);
        localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
        calculateStats(updatedBlogs);
        setShowFormModal(false);
        setEditingBlog(null);
    };

    const handleToggleStatus = (blogId) => {
        const updatedBlogs = blogs.map(blog => {
            if (blog.id === blogId) {
                return {
                    ...blog,
                    status: blog.status === 'published' ? 'draft' : 'published'
                };
            }
            return blog;
        });
        
        setBlogs(updatedBlogs);
        localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
        calculateStats(updatedBlogs);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'published':
                return 'Đã xuất bản';
            case 'draft':
                return 'Nháp';
            default:
                return 'Chưa xác định';
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Blog</h1>
                    <p className="text-gray-600">Tạo và quản lý các bài viết sức khỏe</p>
                </div>
                <button
                    onClick={handleAddBlog}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Tạo bài viết mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faBars} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faEye} className="text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faChartLine} className="text-purple-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Lượt thích</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faCalendar} className="text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả chủ đề</option>
                            {blogCategories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="published">Đã xuất bản</option>
                            <option value="draft">Nháp</option>
                        </select>
                    </div>

                    {/* Results count */}
                    <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faFilter} className="mr-2" />
                        Hiển thị {filteredBlogs.length} bài viết
                    </div>
                </div>
            </div>

            {/* Blog List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bài viết
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chủ đề
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thống kê
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBlogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img 
                                                src={blog.imageUrl} 
                                                alt={blog.title}
                                                className="w-16 h-16 rounded-lg object-cover mr-4"
                                            />
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                                    {blog.excerpt}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(blog.id)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)} hover:opacity-80 transition-opacity`}
                                        >
                                            {getStatusText(blog.status)}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            <div>👀 {blog.views} lượt xem</div>
                                            <div>❤️ {blog.likes} lượt thích</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(blog.publishedAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleEditBlog(blog)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                                title="Chỉnh sửa"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBlog(blog.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors duration-300"
                                                title="Xóa"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBlogs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Không tìm thấy bài viết
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Hãy thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới
                        </p>
                        <button
                            onClick={handleAddBlog}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                        >
                            Tạo bài viết đầu tiên
                        </button>
                    </div>
                )}
            </div>

            {/* Blog Form Modal */}
            {showFormModal && (
                <BlogFormModal
                    blog={editingBlog}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingBlog(null);
                    }}
                    onSave={handleSaveBlog}
                />
            )}
        </div>
    );
};

export default BlogManagement;
