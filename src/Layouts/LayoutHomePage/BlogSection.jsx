import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogs';

const BlogSection = () => {
    const latestPosts = blogPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 3);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Bài viết sức khỏe
                    </h2>
                    <p className="text-xl text-gray-600">
                        Cập nhật những kiến thức y tế mới nhất từ các chuyên gia
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {latestPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                            <div className="relative">
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                                    <span>{post.author.name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDate(post.publishedAt)}</span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {post.title}
                                </h3>
                                
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="mr-4">
                                            📖 {post.readTime} phút đọc
                                        </span>
                                        <span className="mr-4">
                                            👀 {post.views} lượt xem
                                        </span>
                                        <span>
                                            ❤️ {post.likes} lượt thích
                                        </span>
                                    </div>
                                </div>
                                
                                <Link 
                                    to={`/blog/${post.slug}`}
                                    className="inline-block mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                                >
                                    Đọc thêm →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link 
                        to="/blog"
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Xem tất cả bài viết
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
