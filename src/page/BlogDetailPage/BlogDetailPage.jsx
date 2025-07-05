import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faHeart, faCalendar, faClock, faShare } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import { blogPosts } from '../../data/blogs';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);

    useEffect(() => {
        // Lấy bài viết từ localStorage hoặc dữ liệu mặc định
        const savedBlogs = JSON.parse(localStorage.getItem('blogPosts')) || blogPosts;
        const foundPost = savedBlogs.find(p => p.slug === slug && p.status === 'published');
        
        if (foundPost) {
            setPost(foundPost);
            setLikes(foundPost.likes);
            setViews(foundPost.views);
            
            // Tăng số lượt xem
            const updatedPost = { ...foundPost, views: foundPost.views + 1 };
            const updatedBlogs = savedBlogs.map(p => p.id === foundPost.id ? updatedPost : p);
            localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
            setViews(foundPost.views + 1);
            
            // Tìm bài viết liên quan
            const related = savedBlogs
                .filter(p => 
                    p.id !== foundPost.id && 
                    p.status === 'published' && 
                    (p.category === foundPost.category || 
                     p.tags.some(tag => foundPost.tags.includes(tag)))
                )
                .slice(0, 3);
            setRelatedPosts(related);
        }
    }, [slug]);

    useEffect(() => {
        // Kiểm tra xem người dùng đã like bài viết này chưa
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        setIsLiked(likedPosts.includes(post?.id));
    }, [post]);

    const handleLike = () => {
        if (!post) return;
        
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        let newLikes = likes;
        
        if (isLiked) {
            // Unlike
            const filteredLikedPosts = likedPosts.filter(id => id !== post.id);
            localStorage.setItem('likedPosts', JSON.stringify(filteredLikedPosts));
            newLikes = likes - 1;
        } else {
            // Like
            likedPosts.push(post.id);
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            newLikes = likes + 1;
        }
        
        setIsLiked(!isLiked);
        setLikes(newLikes);
        
        // Cập nhật số likes trong localStorage
        const savedBlogs = JSON.parse(localStorage.getItem('blogPosts')) || blogPosts;
        const updatedBlogs = savedBlogs.map(p => 
            p.id === post.id ? { ...p, likes: newLikes } : p
        );
        localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link bài viết!');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Bài viết không tồn tại
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
                    </p>
                    <Link 
                        to="/blog"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                        Về trang blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/blog')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Về trang blog
                    </button>
                    
                    <div className="mb-4">
                        <span 
                            className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {post.category}
                        </span>
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img 
                                src={post.author.avatar} 
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">{post.author.name}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                    <span className="mr-4">{formatDate(post.publishedAt)}</span>
                                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                                    <span>{post.readTime} phút đọc</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                                {views} lượt xem
                            </div>
                            <button
                                onClick={handleLike}
                                className={`flex items-center text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors duration-300`}
                            >
                                <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                {likes} lượt thích
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300"
                            >
                                <FontAwesomeIcon icon={faShare} className="mr-1" />
                                Chia sẻ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-64 lg:h-96 object-cover"
                    />
                    
                    <div className="p-8">
                        <div className="prose max-w-none mb-8">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                        
                        <div className="border-t pt-6">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag) => (
                                    <span 
                                        key={tag}
                                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                                            isLiked 
                                                ? 'bg-red-100 text-red-600' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faHeart} className="mr-2" />
                                        {isLiked ? 'Đã thích' : 'Thích bài viết'}
                                    </button>
                                    
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        <FontAwesomeIcon icon={faShare} className="mr-2" />
                                        Chia sẻ
                                    </button>
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                                    {views} lượt xem
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Bài viết liên quan
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {relatedPosts.map((relatedPost) => (
                            <article key={relatedPost.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                                <div className="relative">
                                    <img 
                                        src={relatedPost.imageUrl} 
                                        alt={relatedPost.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {relatedPost.category}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {relatedPost.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {relatedPost.excerpt}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                                            <span>{relatedPost.readTime} phút đọc</span>
                                        </div>
                                        
                                        <Link 
                                            to={`/blog/${relatedPost.slug}`}
                                            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                                        >
                                            Đọc thêm →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BlogDetailPage;
