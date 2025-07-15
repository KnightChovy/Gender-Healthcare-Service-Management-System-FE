import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/ui/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./Blog.css";
import { Footer } from "../../components/Layouts/LayoutHomePage/Footer";
import { samplePosts } from "./blogData";
function Blog() {
  // State để lưu trữ bài viết blog
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const totalSlides = Math.ceil(featuredPosts.length / 2);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (featuredPosts.length > 0) {
      const totalSlideCount = Math.ceil(featuredPosts.length / 2);
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === totalSlideCount - 1 ? 0 : prev + 1
        );
      }, 6000); // 6 seconds per slide pair

      return () => clearInterval(interval);
    }
  }, [featuredPosts]);

  // Giả lập fetching data từ API
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    const fetchBlogData = async () => {
      try {
        // Thay thế bằng API call thực tế
        // const response = await axios.get('/api/blog-posts');

        // Sử dụng dữ liệu từ file blogData.js
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

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  // Reset tìm kiếm
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // Hàm xử lý chọn category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Reset tìm kiếm khi chọn category mới
    if (searchTerm) {
      clearSearch();
    }
  };

  // Lọc bài viết theo category và tìm kiếm
  const filteredPosts =
    searchResults.length > 0
      ? searchResults
      : selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);
  const groupedFeaturedPosts = [];
  for (let i = 0; i < featuredPosts.length; i += 2) {
    groupedFeaturedPosts.push(featuredPosts.slice(i, i + 2));
  }

  return (
    <>
      <div className="container mx-auto px-4 pb-8">
        {/* Banner & Intro */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="flex justify-between">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 w-[60%]">
              Blog chia sẻ kinh nghiệm
            </h1>
            <div className="relative w-64">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full pl-4 pr-10 py-2 bg-blue bg-opacity-20 border border-white rounded-full 
    text-white placeholder-white placeholder-opacity-80 focus:outline-none focus:ring-2 
    focus:ring-white focus:ring-opacity-50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/3 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>
            </div>
          </div>

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
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                  Bài Viết Nổi Bật
                </h2>
                <div className="featured-posts-container relative">
                  {/* Left navigation button */}
                  <button
                    onClick={() => {
                      const totalSlideCount = Math.ceil(
                        featuredPosts.length / 2
                      );
                      setCurrentSlide((prev) =>
                        prev === 0 ? totalSlides - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    type="button"
                    aria-label="Previous posts"
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="text-blue-600"
                    />
                  </button>
                  <div
                    className="featured-posts-slider"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {groupedFeaturedPosts.map((group, index) => (
                      <div
                        key={index}
                        className="min-w-full flex gap-6 px-2 box-border"
                      >
                        {group.map((post) => (
                          <div
                            key={post.id}
                            className="w-1/2 bg-white rounded-lg shadow-md overflow-hidden"
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
                              <h3 className="text-xl font-bold mb-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {post.excerpt}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  {post.author} ·{" "}
                                  {new Date(post.date).toLocaleDateString(
                                    "vi-VN"
                                  )}
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
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const totalSlideCount = Math.ceil(
                        featuredPosts.length / 2
                      );
                      setCurrentSlide((prev) =>
                        prev === totalSlideCount - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    type="button"
                    aria-label="Next post"
                  >
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-blue-600"
                    />
                  </button>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center mt-4 gap-2">
                  {featuredPosts.map((_, index) => (
                    <button
                      key={index}
                      className={`h-3 w-3 rounded-full ${
                        currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-6">
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Kết quả tìm kiếm cho: "{searchTerm}"
                    </h3>
                    <p className="text-blue-600">
                      Tìm thấy {searchResults.length} bài viết
                    </p>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                {searchTerm ? "Lọc kết quả" : "Danh mục"}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
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
                    onClick={() => handleCategoryChange(category)}
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm
                    ? "Không tìm thấy bài viết nào"
                    : "Chưa có bài viết nào"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? `Không tìm thấy bài viết nào cho từ khóa "${searchTerm}". Hãy thử từ khóa khác.`
                    : "Hiện tại chưa có bài viết nào trong danh mục này."}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            ) : (
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
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Blog;
