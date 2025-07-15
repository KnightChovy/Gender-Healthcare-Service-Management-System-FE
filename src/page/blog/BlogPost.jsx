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
        const samplePosts = [
          {
            id: 1,
            title:
              "Hiểu biết đúng đắn về sức khỏe sinh sản ở tuổi vị thành niên",
            content: `
              <p>Giáo dục sức khỏe sinh sản cho giới trẻ là một trong những yếu tố quan trọng để đảm bảo thế hệ tương lai có cuộc sống lành mạnh và trách nhiệm.</p>
              <h2>Tầm quan trọng của giáo dục sức khỏe sinh sản sớm</h2>
              <p>Hiểu biết về cơ thể và sức khỏe sinh sản từ sớm giúp giới trẻ tự tin hơn, chuẩn bị tâm lý và có kiến thức bảo vệ bản thân.</p>
            `,
            category: "Giáo dục giới tính",
            author: "BS. Nguyễn Văn A",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio:
              "Bác sĩ chuyên khoa sản phụ khoa với hơn 15 năm kinh nghiệm.",
            date: "2025-05-15",
            image:
              "https://watermark.lovepik.com/photo/20211126/large/lovepik-youth-education-teachers-counseling-homework-picture_501115811.jpg",
            readTime: "8 phút đọc",
          },
          {
            id: 2,
            title: "Dinh dưỡng hợp lý cho sức khỏe sinh sản",
            content: `
              <p>Một chế độ dinh dưỡng cân bằng đóng vai trò quan trọng trong việc bảo vệ và tăng cường sức khỏe sinh sản.</p>
              <h2>Nhóm thực phẩm quan trọng</h2>
              <ul>
                <li>Thực phẩm giàu kẽm giúp tăng cường chất lượng tinh trùng.</li>
                <li>Axit folic hỗ trợ sức khỏe buồng trứng và quá trình thụ thai.</li>
                <li>Vitamin E giúp cân bằng hormone sinh sản.</li>
                <li>Omega-3 cải thiện lưu thông máu đến cơ quan sinh sản.</li>
              </ul>
              <p>Đảm bảo chế độ ăn uống đầy đủ dưỡng chất là một bước quan trọng trong hành trình sinh sản khỏe mạnh.</p>
            `,
            category: "Dinh dưỡng",
            author: "BS. Trần Thị B",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Chuyên gia dinh dưỡng, tốt nghiệp ĐH Y Hà Nội.",
            date: "2025-04-20",
            image:
              "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/cac_bien_phap_tranh_thai_an_toan_va_hieu_qua_ma_cac_cap_doi_can_biet_5_87e67eff32.jpg",
            readTime: "5 phút đọc",
          },
          {
            id: 3,
            title: "Tâm lý giới trẻ và tình yêu lành mạnh",
            content: `
              <p>Xây dựng mối quan hệ tình cảm lành mạnh là yếu tố thiết yếu để duy trì sức khỏe tinh thần và thể chất.</p>
              <h2>Kỹ năng cần có trong mối quan hệ</h2>
              <ul>
                <li>Khả năng giao tiếp cởi mở và trung thực.</li>
                <li>Biết đặt ra ranh giới cá nhân lành mạnh.</li>
                <li>Tôn trọng sự khác biệt và quyền tự quyết của đối phương.</li>
                <li>Chia sẻ cảm xúc một cách tích cực, không phán xét.</li>
              </ul>
              <p>Một mối quan hệ yêu thương lành mạnh sẽ góp phần tích cực vào chất lượng cuộc sống và sức khỏe tổng thể.</p>
            `,
            category: "Tâm lý học",
            author: "TS. Lê Văn C",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio:
              "Tiến sĩ tâm lý học, 10 năm nghiên cứu hành vi giới trẻ.",
            date: "2025-03-30",
            image: "https://medlatec.vn/media/29903/file/benh-lau.jpg",
            readTime: "7 phút đọc",
          },
          {
            id: 4,
            title: "Sức khỏe tinh thần và khả năng sinh sản",
            content: `
              <p>Sức khỏe tinh thần có ảnh hưởng trực tiếp đến hormone và chức năng sinh sản.</p>
              <h2>Hệ quả của stress kéo dài</h2>
              <ul>
                <li>Rối loạn chu kỳ kinh nguyệt.</li>
                <li>Giảm chất lượng tinh trùng.</li>
                <li>Ảnh hưởng tiêu cực đến sự rụng trứng.</li>
                <li>Gia tăng nguy cơ sảy thai.</li>
              </ul>
              <p>Chăm sóc sức khỏe tinh thần là bước quan trọng để hỗ trợ sức khỏe sinh sản lâu dài.</p>
            `,
            category: "Sức khỏe tinh thần",
            author: "BS. Đỗ Thị D",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Bác sĩ tâm thần học, công tác tại BV Tâm thần TW.",
            date: "2025-05-05",
            image:
              "https://sihospital.com.vn/wp-content/uploads/2023/08/tinh-ngay-rung-trung-01.png",
            readTime: "6 phút đọc",
          },
          {
            id: 5,
            title: "Vai trò của thể thao trong tăng cường sức khỏe sinh sản",
            content: `
              <p>Hoạt động thể chất giúp tăng cường tuần hoàn máu và cải thiện chức năng sinh sản.</p>
              <h2>Bài tập phù hợp</h2>
              <ul>
                <li>Đi bộ nhanh giúp giảm stress và tăng lưu lượng máu.</li>
                <li>Yoga giúp cân bằng hormone và cải thiện tâm trạng.</li>
                <li>Đạp xe ở cường độ vừa phải giúp tăng cường sức khỏe tim mạch.</li>
                <li>Bơi lội giúp tăng cường sức bền và sức khỏe tổng thể.</li>
              </ul>
              <p>Thể dục đều đặn là yếu tố không thể thiếu trong việc chăm sóc sức khỏe sinh sản.</p>
            `,
            category: "Thể dục thể thao",
            author: "HLV. Nguyễn Văn E",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Huấn luyện viên thể hình có chứng chỉ quốc tế.",
            date: "2025-04-10",
            image:
              "https://s7ap1.scene7.com/is/image/aia/cach-xay-dung-thoi-quen-tot-1?qlt=85&wid=1024&ts=1682650262128&dpr=off",
            readTime: "4 phút đọc",
          },
          {
            id: 6,
            title: "Các bệnh lây truyền qua đường tình dục cần lưu ý",
            content: `
              <p>Các bệnh lây truyền qua đường tình dục (STDs) có thể gây hậu quả nghiêm trọng nếu không được phòng ngừa và điều trị kịp thời.</p>
              <h2>Những bệnh thường gặp</h2>
              <ul>
                <li>Chlamydia.</li>
                <li>Lậu.</li>
                <li>Giang mai.</li>
                <li>Viêm gan B.</li>
                <li>HIV/AIDS.</li>
              </ul>
              <h2>Biện pháp phòng ngừa</h2>
              <ul>
                <li>Sử dụng bao cao su khi quan hệ.</li>
                <li>Kiểm tra sức khỏe định kỳ.</li>
                <li>Tránh quan hệ với nhiều bạn tình.</li>
                <li>Tiêm chủng phòng ngừa khi có chỉ định.</li>
              </ul>
              <p>Chủ động phòng ngừa và kiểm tra sức khỏe định kỳ là cách tốt nhất để bảo vệ bản thân.</p>
            `,
            category: "Bệnh lý",
            author: "BS. Trần Minh F",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Bác sĩ bệnh viện da liễu trung ương.",
            date: "2025-02-28",
            image:
              "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/8/8/edit-tuoi-day-thi-17231027212801213683997.pnghttps://placehold.co/1200x600/png?text=Post+6",
            readTime: "9 phút đọc",
          },
          {
            id: 7,
            title: "Tầm quan trọng của tiêm chủng với sức khỏe sinh sản",
            content: `
              <p>Tiêm chủng giúp phòng tránh nhiều bệnh có thể ảnh hưởng tiêu cực đến khả năng sinh sản và thai kỳ.</p>
              <h2>Những loại vắc xin cần thiết</h2>
              <ul>
                <li>Vắc xin HPV giúp phòng ngừa ung thư cổ tử cung.</li>
                <li>Vắc xin Rubella giúp tránh dị tật thai nhi.</li>
                <li>Vắc xin viêm gan B bảo vệ gan khỏe mạnh.</li>
                <li>Vắc xin cúm giúp giảm nguy cơ biến chứng khi mang thai.</li>
              </ul>
              <p>Tiêm chủng đầy đủ trước và trong giai đoạn mang thai giúp bảo vệ sức khỏe cho mẹ và bé.</p>
            `,
            category: "Tiêm chủng",
            author: "BS. Nguyễn Thị G",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Chuyên gia y tế dự phòng.",
            date: "2025-05-01",
            image:
              "https://aih.com.vn/storage/posts/70270ee93f6e785fbf10aea41cab6a3a.jpg",
            readTime: "5 phút đọc",
          },
          {
            id: 8,
            title: "Vai trò của nam giới trong chăm sóc sức khỏe sinh sản",
            content: `
              <p>Nam giới đóng vai trò quan trọng trong việc chăm sóc sức khỏe sinh sản, không chỉ cho bản thân mà còn cho bạn đời.</p>
              <h2>Những việc nam giới nên làm</h2>
              <ul>
                <li>Kiểm tra sức khỏe sinh sản định kỳ.</li>
                <li>Tránh hút thuốc và lạm dụng rượu bia.</li>
                <li>Giữ chế độ dinh dưỡng hợp lý.</li>
                <li>Quản lý stress và duy trì lối sống lành mạnh.</li>
              </ul>
              <p>Sự chủ động của nam giới giúp xây dựng nền tảng sức khỏe sinh sản bền vững cho cả hai.</p>
            `,
            category: "Vai trò giới",
            author: "BS. Lê Minh H",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Chuyên gia tư vấn nam khoa.",
            date: "2025-03-15",
            image:
              "https://production-cdn.pharmacity.io/digital/original/plain/blog/efd86b0a2a8a00599ccb2078c54662931741536822.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUYXZVMJM5QUYWSVO%2F20250502%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250502T025309Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Signature=3535ac24ba6479736a0857bdccc83b1f75353cd706bb646bcc34d2b3a9ff51e3",
            readTime: "6 phút đọc",
          },
          {
            id: 9,
            title: "Ảnh hưởng của môi trường sống tới sức khỏe sinh sản",
            content: `
              <p>Môi trường sống ảnh hưởng trực tiếp đến sức khỏe sinh sản của con người.</p>
              <h2>Các yếu tố môi trường cần lưu ý</h2>
              <ul>
                <li>Ô nhiễm không khí làm giảm chất lượng tinh trùng và ảnh hưởng đến phôi thai.</li>
                <li>Hóa chất công nghiệp có thể gây rối loạn nội tiết tố.</li>
                <li>Tiếp xúc với kim loại nặng ảnh hưởng tiêu cực đến khả năng sinh sản.</li>
                <li>Thói quen sinh hoạt không an toàn trong môi trường lao động độc hại.</li>
              </ul>
              <p>Chủ động tạo dựng môi trường sống an toàn sẽ giúp bảo vệ sức khỏe sinh sản lâu dài.</p>
            `,
            category: "Môi trường",
            author: "TS. Đặng Thị I",
            authorAvatar: "https://placehold.co/100x100/png",
            authorBio: "Tiến sĩ môi trường và sức khỏe cộng đồng.",
            date: "2025-04-25",
            image:
              "https://trungtamthuoc.com/images/news/vaccine-hpv-phong-ngua-ung-thu-co-tu-cung-0111.jpg",
            readTime: "7 phút đọc",
          },
        ];

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
