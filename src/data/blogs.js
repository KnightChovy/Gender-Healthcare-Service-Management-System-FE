// Dữ liệu blog mẫu
export const blogPosts = [
    {
        id: 'BLOG_001',
        title: 'Kiến thức cơ bản về sức khỏe sinh sản nữ',
        slug: 'kien-thuc-co-ban-ve-suc-khoe-sinh-san-nu',
        excerpt: 'Tìm hiểu những kiến thức cơ bản về sức khỏe sinh sản nữ, các vấn đề thường gặp và cách phòng ngừa.',
        content: `
            <p>Sức khỏe sinh sản là một phần quan trọng trong cuộc sống của phụ nữ. Việc hiểu rõ về cơ thể của mình giúp phụ nữ có thể chăm sóc sức khỏe tốt hơn.</p>
            
            <h3>Chu kỳ kinh nguyệt</h3>
            <p>Chu kỳ kinh nguyệt bình thường kéo dài từ 21-35 ngày. Việc theo dõi chu kỳ kinh nguyệt giúp phát hiện sớm các vấn đề sức khỏe.</p>
            
            <h3>Các dấu hiệu cần chú ý</h3>
            <ul>
                <li>Kinh nguyệt không đều</li>
                <li>Đau bụng dữ dội trong kỳ kinh</li>
                <li>Xuất huyết bất thường</li>
                <li>Các triệu chứng khác thường</li>
            </ul>
            
            <h3>Lời khuyên chăm sóc</h3>
            <p>Duy trì lối sống lành mạnh, tập thể dục đều đặn, và thăm khám định kỳ để đảm bảo sức khỏe sinh sản tốt nhất.</p>
        `,
        imageUrl: 'https://file.hstatic.net/200000903103/article/d83861ca-584b-4eb2-9b85-190a6d145883_226a6f08c6ce4df0b8972c58577056c7.webp',
        category: 'Sức khỏe sinh sản',
        author: {
            name: 'BS. Nguyễn Thị Lan',
            avatar: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=NL'
        },
        publishedAt: '2024-01-15T10:00:00Z',
        readTime: 5,
        tags: ['sức khỏe sinh sản', 'kinh nguyệt', 'phụ nữ'],
        views: 1250,
        likes: 87,
        status: 'published'
    },
    {
        id: 'BLOG_002',
        title: 'Tầm quan trọng của xét nghiệm sức khỏe định kỳ',
        slug: 'tam-quan-trong-cua-xet-nghiem-suc-khoe-dinh-ky',
        excerpt: 'Xét nghiệm sức khỏe định kỳ giúp phát hiện sớm các bệnh lý, từ đó có phương pháp điều trị hiệu quả.',
        content: `
            <p>Xét nghiệm sức khỏe định kỳ là một phần quan trọng trong việc duy trì sức khỏe. Việc phát hiện sớm các bệnh lý giúp điều trị hiệu quả hơn.</p>
            
            <h3>Các xét nghiệm cơ bản</h3>
            <ul>
                <li>Xét nghiệm máu tổng quát</li>
                <li>Xét nghiệm nước tiểu</li>
                <li>Xét nghiệm hormone</li>
                <li>Xét nghiệm các chỉ số sinh hóa</li>
            </ul>
            
            <h3>Tần suất xét nghiệm</h3>
            <p>Đối với người trẻ khỏe mạnh, nên xét nghiệm ít nhất 1 năm/lần. Những người có yếu tố nguy cơ nên xét nghiệm thường xuyên hơn.</p>
            
            <h3>Lưu ý khi xét nghiệm</h3>
            <p>Cần chuẩn bị đúng cách trước khi xét nghiệm để có kết quả chính xác nhất. Thực hiện theo hướng dẫn của bác sĩ.</p>
        `,
        imageUrl: 'https://phongkhamlotusclinic.com/img_data/images/%C4%91k.jpg',
        category: 'Xét nghiệm',
        author: {
            name: 'BS. Trần Văn Minh',
            avatar: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=TM'
        },
        publishedAt: '2024-01-10T14:30:00Z',
        readTime: 7,
        tags: ['xét nghiệm', 'sức khỏe', 'phòng ngừa'],
        views: 980,
        likes: 65,
        status: 'published'
    },
    {
        id: 'BLOG_003',
        title: 'Cách chuẩn bị trước khi mang thai',
        slug: 'cach-chuan-bi-truoc-khi-mang-thai',
        excerpt: 'Hướng dẫn chuẩn bị sức khỏe và tinh thần trước khi mang thai để có một thai kỳ khỏe mạnh.',
        content: `
            <p>Việc chuẩn bị trước khi mang thai rất quan trọng để đảm bảo sức khỏe cho cả mẹ và bé. Dưới đây là những điều cần lưu ý.</p>
            
            <h3>Chuẩn bị sức khỏe</h3>
            <ul>
                <li>Khám sức khỏe tổng quát</li>
                <li>Bổ sung acid folic</li>
                <li>Duy trì cân nặng hợp lý</li>
                <li>Tập thể dục đều đặn</li>
            </ul>
            
            <h3>Chế độ dinh dưỡng</h3>
            <p>Ăn uống đầy đủ chất dinh dưỡng, hạn chế caffeine, rượu bia và thuốc lá. Bổ sung các vitamin và khoáng chất cần thiết.</p>
            
            <h3>Chuẩn bị tinh thần</h3>
            <p>Tìm hiểu về thai kỳ và nuôi dạy con. Tạo môi trường sống tích cực và giảm căng thẳng.</p>
        `,
        imageUrl: 'https://www.vinmec.com/static/uploads/medium_20190715_134058_100174_20190516_161638_762_max_1800x1800_jpeg_5c73b48aca.jpg',
        category: 'Thai sản',
        author: {
            name: 'BS. Lê Thị Hồng',
            avatar: 'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=LH'
        },
        publishedAt: '2024-01-05T09:15:00Z',
        readTime: 8,
        tags: ['thai sản', 'mang thai', 'chuẩn bị'],
        views: 1580,
        likes: 112,
        status: 'published'
    },
    {
        id: 'BLOG_004',
        title: 'Phòng ngừa các bệnh truyền qua đường tình dục',
        slug: 'phong-ngua-cac-benh-truyen-qua-duong-tinh-duc',
        excerpt: 'Kiến thức về các bệnh truyền qua đường tình dục và cách phòng ngừa hiệu quả.',
        content: `
            <p>Các bệnh truyền qua đường tình dục (STD) là những bệnh có thể phòng ngừa được nếu có kiến thức và biện pháp bảo vệ phù hợp.</p>
            
            <h3>Các bệnh thường gặp</h3>
            <ul>
                <li>Chlamydia</li>
                <li>Gonorrhea</li>
                <li>Syphilis</li>
                <li>Herpes</li>
                <li>HPV</li>
            </ul>
            
            <h3>Biện pháp phòng ngừa</h3>
            <p>Sử dụng bao cao su, hạn chế số lượng bạn tình, xét nghiệm định kỳ và tiêm vaccine phòng ngừa khi có thể.</p>
            
            <h3>Dấu hiệu cần chú ý</h3>
            <p>Đau rát khi tiểu tiện, tiết dịch bất thường, ngứa ngáy, hoặc nổi mụn nước ở vùng sinh dục.</p>
        `,
        imageUrl: 'https://isofhcare-backup.s3-ap-southeast-1.amazonaws.com/images/nhung-dieu-can-lam-khi-bi-nhiem-hiv-isofhcare_008fc249_ef73_4859_b0fc_62b5a8c47e44.jpg',
        category: 'Phòng ngừa',
        author: {
            name: 'BS. Phạm Văn Đức',
            avatar: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=PD'
        },
        publishedAt: '2024-01-01T16:45:00Z',
        readTime: 6,
        tags: ['STD', 'phòng ngừa', 'sức khỏe'],
        views: 890,
        likes: 54,
        status: 'published'
    }
];

// Categories
export const blogCategories = [
    { id: 'suc-khoe-sinh-san', name: 'Sức khỏe sinh sản', color: '#EC4899' },
    { id: 'xet-nghiem', name: 'Xét nghiệm', color: '#3B82F6' },
    { id: 'thai-san', name: 'Thai sản', color: '#10B981' },
    { id: 'phong-ngua', name: 'Phòng ngừa', color: '#F59E0B' },
    { id: 'dinh-duong', name: 'Dinh dưỡng', color: '#8B5CF6' },
    { id: 'tam-ly', name: 'Tâm lý', color: '#EF4444' }
];

// Blog stats
export const blogStats = {
    totalPosts: 4,
    totalViews: 4700,
    totalLikes: 318,
    categoriesCount: 6
};
