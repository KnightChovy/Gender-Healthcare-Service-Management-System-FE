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
function Blog() {
  // State để lưu trữ bài viết blog
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const totalSlides = Math.ceil(featuredPosts.length / 2);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

        // Dữ liệu mẫu
        const samplePosts = [
          // Keep your existing posts...
          {
            id: 1,
            title:
              "Hiểu biết đúng đắn về sức khỏe sinh sản ở tuổi vị thành niên",
            excerpt:
              "Những kiến thức cần thiết giúp các bạn trẻ tự tin và an toàn...",
            category: "Giáo dục giới tính",
            author: "BS. Nguyễn Văn A",
            date: "2025-05-15",
            image:
              "https://watermark.lovepik.com/photo/20211126/large/lovepik-youth-education-teachers-counseling-homework-picture_501115811.jpg",
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
            image:
              "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/cac_bien_phap_tranh_thai_an_toan_va_hieu_qua_ma_cac_cap_doi_can_biet_5_87e67eff32.jpg",
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
            image: "https://medlatec.vn/media/29903/file/benh-lau.jpg",
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
            image:
              "https://sihospital.com.vn/wp-content/uploads/2023/08/tinh-ngay-rung-trung-01.png",
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
            image:
              "https://s7ap1.scene7.com/is/image/aia/cach-xay-dung-thoi-quen-tot-1?qlt=85&wid=1024&ts=1682650262128&dpr=off",
            featured: false,
          },

          {
            id: 6,
            title:
              "Sức khỏe tinh thần và nhận thức giới tính trong tuổi dậy thì",
            excerpt:
              "Các giai đoạn phát triển tâm lý và cách hỗ trợ thanh thiếu niên xây dựng nhận thức giới tính lành mạnh...",
            category: "Sức khỏe tinh thần",
            author: "TS. Phan Thị F",
            date: "2025-05-12",
            image:
              "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/8/8/edit-tuoi-day-thi-17231027212801213683997.png",
            featured: true,
          },
          {
            id: 7,
            title: "Những thay đổi hormone và ảnh hưởng đến sức khỏe phụ nữ",
            excerpt:
              "Tìm hiểu về các giai đoạn biến đổi hormone và cách cân bằng cho sức khỏe tổng thể...",
            category: "Nội tiết học",
            author: "PGS.TS. Trịnh Văn G",
            date: "2025-05-08",
            image:
              "https://aih.com.vn/storage/posts/70270ee93f6e785fbf10aea41cab6a3a.jpg",
            featured: true,
          },
          {
            id: 8,
            title: "Dinh dưỡng cho sức khỏe sinh sản nam giới",
            excerpt:
              "Các thực phẩm và chế độ dinh dưỡng giúp cải thiện chất lượng tinh trùng và sức khỏe sinh sản nam...",
            category: "Dinh dưỡng",
            author: "BS. Ngô Thị H",
            date: "2025-05-05",
            image:
              "https://production-cdn.pharmacity.io/digital/original/plain/blog/efd86b0a2a8a00599ccb2078c54662931741536822.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUYXZVMJM5QUYWSVO%2F20250502%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250502T025309Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Signature=3535ac24ba6479736a0857bdccc83b1f75353cd706bb646bcc34d2b3a9ff51e3",
            featured: true,
          },
          {
            id: 9,
            title: "Thực hành an toàn và trách nhiệm trong quan hệ tình dục",
            excerpt:
              "Hướng dẫn về các biện pháp bảo vệ bản thân và đối tác trong quan hệ tình dục...",
            category: "Giáo dục giới tính",
            author: "BS. Đinh Văn I",
            date: "2025-05-02",
            image:
              "https://icpc1hn.work/NHATHUOC/WEB/DownloadImageDes?ImageName=d49317c7-a3c2-414e-b51a-bd28a9989611.png",
            featured: true,
          },
          {
            id: 10,
            title: "Vắc-xin HPV và phòng ngừa ung thư cổ tử cung",
            excerpt:
              "Tầm quan trọng của tiêm vắc-xin HPV trong việc ngăn ngừa ung thư cổ tử cung ở phụ nữ...",
            category: "Phòng ngừa",
            author: "GS. Đỗ Văn K",
            date: "2025-04-30",
            image:
              "https://trungtamthuoc.com/images/news/vaccine-hpv-phong-ngua-ung-thu-co-tu-cung-0111.jpg",
            featured: true,
          },
          {
            id: 11,
            title:
              "Phát hiện sớm và điều trị bệnh lây nhiễm qua đường tình dục",
            excerpt:
              "Các dấu hiệu cần chú ý và tầm quan trọng của việc xét nghiệm định kỳ...",
            category: "STIs",
            author: "BS. Lương Thị L",
            date: "2025-04-25",
            image:
              "https://benhvienquoctehoanmy.vn/wp-content/uploads/2019/06/image002.png",
            featured: true,
          },
          {
            id: 12,
            title: "Tâm lý học về nhận thức giới tính và bản sắc cá nhân",
            excerpt:
              "Hiểu về quá trình hình thành nhận thức giới tính và tác động của môi trường xã hội...",
            category: "Tâm lý học",
            author: "PGS. Nguyễn Thị M",
            date: "2025-04-22",
            image:
              "https://vinuni.edu.vn/wp-content/uploads/2024/08/tam-ly-hoc-gioi-tinh-va-giao-duc-hoc-gioi-tinh-khai-niem-va-tam-quan-trong-so-2.jpg",
            featured: true,
          },
          {
            id: 13,
            title: "Chăm sóc sức khỏe sau sinh và kế hoạch hóa gia đình",
            excerpt:
              "Các phương pháp phục hồi sức khỏe sau sinh và lên kế hoạch cho gia đình trong tương lai...",
            category: "Sức khỏe sinh sản",
            author: "TS. Vũ Thị N",
            date: "2025-04-18",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsnMRjdTL4CNS2g9Uk160RRvXEEYR22KYXBQ&s",
            featured: true,
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
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-4 pr-10 py-2 bg-blue bg-opacity-20 border border-white rounded-full 
    text-white placeholder-white placeholder-opacity-80 focus:outline-none focus:ring-2 
    focus:ring-white focus:ring-opacity-50 transition-all"
              />
              <button className="absolute right-3 top-1/3 transform -translate-y-1/2 text-white hover:text-black-200">
                <FontAwesomeIcon icon={faSearch} />
              </button>
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
          </>
        )}
      </div>
    </>
  );
}

export default Blog;
