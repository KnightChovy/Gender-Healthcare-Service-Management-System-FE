import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage, faSave, faEye } from '@fortawesome/free-solid-svg-icons';
import { blogCategories } from '../../data/blogs';

const BlogFormModal = ({ blog, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        imageUrl: 'https://file.hstatic.net/200000903103/article/d83861ca-584b-4eb2-9b85-190a6d145883_226a6f08c6ce4df0b8972c58577056c7.webp',
        category: 'Sức khỏe sinh sản',
        tags: [],
        status: 'draft',
        readTime: 5
    });
    const [tagInput, setTagInput] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || '',
                slug: blog.slug || '',
                excerpt: blog.excerpt || '',
                content: blog.content || '',
                imageUrl: blog.imageUrl || 'https://file.hstatic.net/200000903103/article/d83861ca-584b-4eb2-9b85-190a6d145883_226a6f08c6ce4df0b8972c58577056c7.webp',
                category: blog.category || 'Sức khỏe sinh sản',
                tags: blog.tags || [],
                status: blog.status || 'draft',
                readTime: blog.readTime || 5
            });
        }
    }, [blog]);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from title
        if (name === 'title') {
            setFormData(prev => ({
                ...prev,
                slug: generateSlug(value)
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề là bắt buộc';
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = 'Mô tả ngắn là bắt buộc';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung bài viết là bắt buộc';
        }

        if (formData.tags.length === 0) {
            newErrors.tags = 'Ít nhất một thẻ là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        onSave(formData);
    };

    const estimateReadTime = (content) => {
        const wordsPerMinute = 200;
        const textLength = content.replace(/<[^>]*>/g, '').length;
        const words = textLength / 5; // Estimate words from character count
        return Math.max(1, Math.round(words / wordsPerMinute));
    };

    useEffect(() => {
        if (formData.content) {
            const readTime = estimateReadTime(formData.content);
            setFormData(prev => ({
                ...prev,
                readTime: readTime
            }));
        }
    }, [formData.content]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {blog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Chia sẻ kiến thức sức khỏe với cộng đồng
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                        >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                            {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="h-[calc(90vh-80px)] overflow-y-auto">
                    {!previewMode ? (
                        // Edit Mode
                        <div className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề bài viết *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập tiêu đề bài viết..."
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đường dẫn (URL slug)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="duong-dan-bai-viet"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    URL: /blog/{formData.slug}
                                </p>
                            </div>

                            {/* Category & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chủ đề
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {blogCategories.map(category => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Nháp</option>
                                        <option value="published">Xuất bản</option>
                                    </select>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL hình ảnh
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                                </div>
                                {formData.imageUrl && (
                                    <img 
                                        src={formData.imageUrl} 
                                        alt="Preview"
                                        className="mt-2 w-32 h-20 object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả ngắn *
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.excerpt ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập mô tả ngắn gọn về bài viết..."
                                />
                                {errors.excerpt && (
                                    <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung bài viết *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={12}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.content ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập nội dung bài viết (hỗ trợ HTML)..."
                                />
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Thời gian đọc ước tính: {formData.readTime} phút
                                </p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thẻ (Tags) *
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập thẻ và nhấn Enter..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Thêm
                                    </button>
                                </div>
                                {errors.tags && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Preview Mode
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-4">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {formData.category}
                                    </span>
                                </div>
                                
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {formData.title || 'Tiêu đề bài viết'}
                                </h1>
                                
                                <div className="flex items-center text-sm text-gray-500 mb-6">
                                    <span className="mr-4">📖 {formData.readTime} phút đọc</span>
                                    <span className="mr-4">🏷️ {formData.tags.length} thẻ</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        formData.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {formData.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                                    </span>
                                </div>

                                <img 
                                    src={formData.imageUrl} 
                                    alt={formData.title}
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                                
                                <div className="prose max-w-none mb-6">
                                    <p className="text-lg text-gray-600 mb-4">
                                        {formData.excerpt || 'Mô tả ngắn sẽ hiển thị ở đây...'}
                                    </p>
                                    
                                    <div dangerouslySetInnerHTML={{ 
                                        __html: formData.content || '<p>Nội dung bài viết sẽ hiển thị ở đây...</p>' 
                                    }} />
                                </div>
                                
                                <div className="border-t pt-6">
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <span 
                                                key={tag}
                                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={previewMode}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            {blog ? 'Cập nhật' : 'Tạo bài viết'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogFormModal;
