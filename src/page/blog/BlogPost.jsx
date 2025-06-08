import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc fetch dữ liệu từ API
    const fetchBlogPost = async () => {
      try {
        // Thay thế bằng API call thực tế
        // const response = await axios.get(`/api/blog-posts/${id}`);

        // Dữ liệu mẫu cho bài viết chi tiết
        const samplePost = {
          id: parseInt(id),
          title: "Hiểu biết đúng đắn về sức khỏe sinh sản ở tuổi vị thành niên",
          content: `
            <p>Giáo dục sức khỏe sinh sản cho giới trẻ là một trong những yếu tố quan trọng để đảm bảo thế hệ tương lai có cuộc sống lành mạnh và trách nhiệm.</p>
            
            <h2>Tầm quan trọng của giáo dục sức khỏe sinh sản sớm</h2>
            <p>Hiểu biết về cơ thể và sức khỏe sinh sản từ sớm giúp giới trẻ:</p>
            <ul>
              <li>Tự tin hơn về những thay đổi trong giai đoạn dậy thì</li>
              <li>Chuẩn bị tâm lý trước những biến đổi tự nhiên của cơ thể</li>
              <li>Có kiến thức để bảo vệ bản thân khỏi những nguy cơ liên quan đến sức khỏe sinh sản</li>
              <li>Phát triển thái độ tôn trọng đối với cơ thể mình và người khác</li>
            </ul>
            
            <h2>Những thách thức trong giáo dục sức khỏe sinh sản</h2>
            <p>Mặc dù tầm quan trọng của giáo dục sức khỏe sinh sản là không thể phủ nhận, việc triển khai vẫn gặp nhiều thách thức:</p>
            <ul>
              <li>Rào cản văn hóa và định kiến xã hội</li>
              <li>Thiếu tài liệu giáo dục phù hợp với độ tuổi và văn hóa</li>
              <li>Sự e ngại của cha mẹ và giáo viên khi thảo luận về chủ đề này</li>
              <li>Thông tin sai lệch từ các nguồn không đáng tin cậy như bạn bè hoặc internet</li>
            </ul>
            
            <h2>Cách tiếp cận hiệu quả</h2>
            <p>Để giáo dục sức khỏe sinh sản hiệu quả cho giới trẻ, cần có sự kết hợp giữa:</p>
            <ul>
              <li>Chương trình giáo dục chính thức tại trường học với nội dung phù hợp với độ tuổi</li>
              <li>Sự tham gia tích cực của gia đình trong việc truyền đạt giá trị và kiến thức</li>
              <li>Tiếp cận với các dịch vụ y tế thân thiện và bảo mật</li>
              <li>Xây dựng môi trường xã hội cởi mở và không phán xét</li>
            </ul>
            
            <p>Khi được trang bị đầy đủ kiến thức về sức khỏe sinh sản, giới trẻ có thể đưa ra những quyết định có trách nhiệm, xây dựng mối quan hệ lành mạnh và bảo vệ sức khỏe của mình.</p>
          `,
          category: "Giáo dục giới tính",
          author: "BS. Nguyễn Văn A",
          authorAvatar: "https://placehold.co/100x100/png",
          authorBio:
            "Bác sĩ chuyên khoa sản phụ khoa với hơn 15 năm kinh nghiệm trong lĩnh vực sức khỏe sinh sản vị thành niên",
          date: "2025-05-15",
          image: "https://placehold.co/1200x600/png",
          readTime: "8 phút đọc",
        };

        // Dữ liệu mẫu cho bài viết liên quan
        const sampleRelatedPosts = [
          {
            id: 2,
            title: "Các biện pháp tránh thai hiện đại và hiệu quả",
            excerpt:
              "So sánh ưu nhược điểm của các phương pháp tránh thai phổ biến...",
            category: "Sức khỏe sinh sản",
            date: "2025-05-10",
            image: "https://placehold.co/600x400/png",
          },
          {
            id: 5,
            title: "Mối quan hệ lành mạnh và sự đồng thuận",
            excerpt:
              "Xây dựng mối quan hệ dựa trên sự tôn trọng và đồng thuận...",
            category: "Giáo dục giới tính",
            date: "2025-04-20",
            image: "https://placehold.co/600x400/png",
          },
          {
            id: 4,
            title: "Chu kỳ kinh nguyệt và quá trình rụng trứng",
            excerpt:
              "Hiểu rõ về chu kỳ sinh sản nữ giới để chủ động trong kế hoạch hóa gia đình...",
            category: "Sức khỏe sinh sản",
            date: "2025-04-28",
            image: "https://placehold.co/600x400/png",
          },
        ];

        setPost(samplePost);
        setRelatedPosts(sampleRelatedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <span className="text-xl">Đang tải bài viết...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800">
          Quay lại trang Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Link
          to="/blog"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại Blog
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">
            {new Date(post.date).toLocaleDateString("vi-VN")}
          </span>
          <span className="mr-4">•</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Author Bio */}
      <div className="bg-gray-100 rounded-lg p-6 mb-12">
        <div className="flex items-start">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="font-bold text-lg mb-1">{post.author}</h3>
            <p className="text-gray-700">{post.authorBio}</p>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mb-12">
        <h3 className="font-bold text-lg mb-4">Chia sẻ bài viết</h3>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
            Facebook
          </button>
          <button className="bg-blue-400 text-white px-4 py-2 rounded-full">
            Twitter
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full">
            WhatsApp
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-full">
            LinkedIn
          </button>
        </div>
      </div>

      {/* Related Posts */}
      <div className="mb-12">
        <h3 className="font-bold text-2xl mb-6">Bài viết liên quan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                  {post.category}
                </span>
                <h3 className="font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Đọc thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Section (optional) */}
      <div className="mb-12">
        <h3 className="font-bold text-2xl mb-6">Bình luận (3)</h3>
        {/* Comment form and list would go here */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="text-center">
            Tính năng bình luận đang được phát triển
          </p>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
