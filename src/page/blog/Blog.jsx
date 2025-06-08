import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Blog() {
  // State để lưu trữ bài viết blog
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập fetching data từ API
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    const fetchBlogData = async () => {
      try {
        // Thay thế bằng API call thực tế
        // const response = await axios.get('/api/blog-posts');

        // Dữ liệu mẫu
        const samplePosts = [
          {
            id: 1,
            title:
              "Hiểu biết đúng đắn về sức khỏe sinh sản ở tuổi vị thành niên",
            excerpt:
              "Những kiến thức cần thiết giúp các bạn trẻ tự tin và an toàn...",
            category: "Giáo dục giới tính",
            author: "BS. Nguyễn Văn A",
            date: "2025-05-15",
            image: "https://placehold.co/600x400/png",
            featured: true,
          },
          {
            id: 2,
            title: "Các biện pháp tránh thai hiện đại và hiệu quả",
            excerpt:
              "So sánh ưu nhược điểm của các phương pháp tránh thai phổ biến...",
            category: "Sức khỏe sinh sản",
            author: "BS. Trần Thị B",
            date: "2025-05-10",
            image: "https://placehold.co/600x400/png",
            featured: true,
          },
          {
            id: 3,
            title:
              "Những điều cần biết về các bệnh lây truyền qua đường tình dục",
            excerpt:
              "Thông tin về triệu chứng, cách phòng ngừa và điều trị các STIs phổ biến...",
            category: "STIs",
            author: "BS. Lê Văn C",
            date: "2025-05-05",
            image: "https://placehold.co/600x400/png",
            featured: false,
          },
          {
            id: 4,
            title: "Chu kỳ kinh nguyệt và quá trình rụng trứng",
            excerpt:
              "Hiểu rõ về chu kỳ sinh sản nữ giới để chủ động trong kế hoạch hóa gia đình...",
            category: "Sức khỏe sinh sản",
            author: "BS. Phạm Thị D",
            date: "2025-04-28",
            image: "https://placehold.co/600x400/png",
            featured: false,
          },
          {
            id: 5,
            title: "Mối quan hệ lành mạnh và sự đồng thuận",
            excerpt:
              "Xây dựng mối quan hệ dựa trên sự tôn trọng và đồng thuận...",
            category: "Giáo dục giới tính",
            author: "ThS. Hoàng Văn E",
            date: "2025-04-20",
            image: "https://placehold.co/600x400/png",
            featured: false,
          },
        ];

        // Lấy danh sách categories từ các bài viết
        const uniqueCategories = [
          ...new Set(samplePosts.map((post) => post.category)),
        ];

        setBlogPosts(samplePosts);
        setFeaturedPosts(samplePosts.filter((post) => post.featured));
        setCategories(uniqueCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Lọc bài viết theo category
  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner & Intro */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Blog Sức Khỏe Giới Tính
        </h1>
        <p className="text-lg md:text-xl">
          Nơi chia sẻ kiến thức và kinh nghiệm về giáo dục giới tính, sức khỏe
          sinh sản và chăm sóc sức khỏe toàn diện.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-xl">Đang tải bài viết...</span>
        </div>
      ) : (
        <>
          {/* Featured Posts - Carousel */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                Bài Viết Nổi Bật
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {post.author} ·{" "}
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </span>
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Đọc thêm →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Danh mục</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
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
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {post.author} ·{" "}
                      {new Date(post.date).toLocaleDateString("vi-VN")}
                    </span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Đọc thêm →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component (to be implemented) */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded border text-sm">
                Trước
              </button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
                1
              </button>
              <button className="px-3 py-1 rounded border text-sm">2</button>
              <button className="px-3 py-1 rounded border text-sm">3</button>
              <button className="px-3 py-1 rounded border text-sm">Sau</button>
            </nav>
          </div>
        </>
      )}

      {/* Newsletter Subscription */}
      <div className="mt-16 bg-gray-100 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Đăng ký nhận bài viết mới</h3>
        <p className="text-gray-600 mb-4">
          Nhận thông báo về các bài viết mới nhất về sức khỏe sinh sản và giáo
          dục giới tính.
        </p>
        <form className="flex flex-col md:flex-row gap-2">
          <input
            type="email"
            placeholder="Email của bạn"
            className="flex-grow px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Blog;
