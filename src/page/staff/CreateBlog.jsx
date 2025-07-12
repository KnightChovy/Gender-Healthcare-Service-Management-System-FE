import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../services/axiosClient';

export const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    excerpt: '',
    thumbnail: '',
    category_id: '',
    tags: '',
    published: false
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axiosClient.get('/v1/blog-categories', {
        headers: {
          'x-access-token': accessToken
        }
      });
      
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories nếu API không hoạt động
      setCategories([
        { blogcate_id: 1, name: 'Sức khỏe phụ nữ' },
        { blogcate_id: 2, name: 'Tư vấn y tế' },
        { blogcate_id: 3, name: 'Dinh dưỡng' },
        { blogcate_id: 4, name: 'Sức khỏe sinh sản' },
        { blogcate_id: 5, name: 'Chăm sóc sức khỏe' },
        { blogcate_id: 6, name: 'Khác' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Auto-generate slug from title
      if (name === 'title') {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setFormData(prev => ({
          ...prev,
          slug: slug
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }
      
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File không được vượt quá 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      toast.error('Vui lòng chọn hình ảnh');
      return;
    }

    setUploadingImage(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedImage);

      const response = await axiosClient.post('/v1/upload/image', uploadFormData, {
        headers: {
          'x-access-token': accessToken,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        
        // Set thumbnail nếu chưa có
        if (!formData.thumbnail) {
          setFormData(prev => ({
            ...prev,
            thumbnail: imageUrl
          }));
        }
        
        // Thêm URL hình ảnh vào content
        const imageMarkdown = `\n\n![${selectedImage.name}](${imageUrl})\n\n`;
        setFormData(prev => ({
          ...prev,
          content: prev.content + imageMarkdown
        }));
        
        toast.success('Upload hình ảnh thành công!');
        setSelectedImage(null);
        setImagePreview(null);
        
        // Reset file input
        document.getElementById('imageInput').value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Có lỗi xảy ra khi upload hình ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    document.getElementById('imageInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      // Chuẩn bị dữ liệu theo database schema
      const blogData = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
        thumbnail: formData.thumbnail || '',
        category_id: parseInt(formData.category_id),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published: formData.published
      };

      const response = await axiosClient.post('/v1/blogs', blogData, {
        headers: {
          'x-access-token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Tạo blog thành công!');
        // Reset form
        setFormData({
          title: '',
          content: '',
          slug: '',
          excerpt: '',
          thumbnail: '',
          category_id: '',
          tags: '',
          published: false
        });
        setSelectedImage(null);
        setImagePreview(null);
        document.getElementById('imageInput').value = '';
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Có lỗi xảy ra khi tạo blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setFormData(prev => ({ ...prev, published: false }));
    handleSubmit(new Event('submit'));
  };

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, published: true }));
    handleSubmit(new Event('submit'));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tạo Blog Mới</h1>
          <p className="text-gray-600 mt-1">Chia sẻ kiến thức và thông tin hữu ích</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề blog..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL thân thiện) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="duong-dan-url-thien-thien"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tự động tạo từ tiêu đề hoặc có thể chỉnh sửa
            </p>
          </div>

          {/* Tóm tắt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tóm tắt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Nhập tóm tắt ngắn gọn về blog..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tóm tắt hiển thị trong danh sách blog. Tối đa 200 ký tự.
            </p>
          </div>

          {/* Danh mục và Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.blogcate_id} value={category.blogcate_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Nhập tags, cách nhau bởi dấu phẩy"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ví dụ: sức khỏe, tư vấn, dinh dưỡng
              </p>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL hình ảnh đại diện cho blog
            </p>
          </div>

          {/* Upload hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload hình ảnh
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="imageInput" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Tải lên hình ảnh từ máy tính
                    </span>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 5MB
                  </p>
                </div>
              </div>
              
              {imagePreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {uploadingImage ? 'Đang tải...' : 'Thêm vào blog'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nội dung */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Nội dung *
              </label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {preview ? 'Chỉnh sửa' : 'Xem trước'}
              </button>
            </div>
            
            {preview ? (
              <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50">
                <div className="prose max-w-none">
                  <h3>{formData.title || 'Tiêu đề blog'}</h3>
                  <div className="whitespace-pre-wrap">{formData.content || 'Nội dung blog sẽ hiển thị ở đây...'}</div>
                </div>
              </div>
            ) : (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Nhập nội dung blog..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                required
              />
            )}
          </div>

          {/* Trạng thái xuất bản */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái xuất bản
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Xuất bản ngay lập tức
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Bỏ chọn để lưu dưới dạng bản nháp
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  content: '',
                  slug: '',
                  excerpt: '',
                  thumbnail: '',
                  category_id: '',
                  tags: '',
                  published: false
                });
                setSelectedImage(null);
                setImagePreview(null);
                document.getElementById('imageInput').value = '';
                toast.info('Đã xóa nội dung');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xóa
            </button>
            
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu nháp'}
            </button>
            
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang xuất bản...' : 'Xuất bản'}
            </button>
          </div>
        </form>
      </div>

      {/* Hướng dẫn */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Hướng dẫn viết blog</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tiêu đề hấp dẫn và chứa từ khóa quan trọng</li>
          <li>• Slug URL thân thiện (tự động tạo từ tiêu đề)</li>
          <li>• Tóm tắt ngắn gọn để hiển thị trong danh sách</li>
          <li>• Chọn danh mục phù hợp</li>
          <li>• Thêm thumbnail để blog hấp dẫn hơn</li>
          <li>• Nội dung chia thành đoạn ngắn, dễ đọc</li>
          <li>• Thêm tags để tối ưu SEO</li>
        </ul>
      </div>
    </div>
  );
};