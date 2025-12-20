using BookStation.API.Models;

namespace BookStation.API.Data
{
    public static class DbSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            // Kiểm tra đã có data chưa
            if (context.Users.Any())
            {
                return; // Đã có dữ liệu, không cần seed
            }

            // Seed Admin User
            var admin = new User
            {
                Email = "admin@local.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("P@ssw0rd123"),
                FullName = "Administrator",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
            context.SaveChanges();

            // Seed Categories
            var categories = new List<Category>
            {
                new Category { Name = "Văn học", Slug = "van-hoc" },
                new Category { Name = "Kinh tế", Slug = "kinh-te" },
                new Category { Name = "Công nghệ", Slug = "cong-nghe" }
            };
            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Seed Products (20 sản phẩm)
            var products = new List<Product>
            {
                // Văn học (7 sản phẩm)
                new Product { CategoryId = categories[0].Id, Name = "Nhà Giả Kim", Description = "Câu chuyện về chàng chăn cừu Santiago và hành trình tìm kiếm kho báu.", Price = 79000, Quantity = 50, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[0].Id, Name = "Đắc Nhân Tâm", Description = "Nghệ thuật giao tiếp và ứng xử thành công.", Price = 65000, Quantity = 100, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[0].Id, Name = "Sapiens: Lược Sử Loài Người", Description = "Từ khi xuất hiện đến nay, loài người đã phát triển như thế nào?", Price = 189000, Quantity = 30, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[0].Id, Name = "Cây Cam Ngọt Của Tôi", Description = "Chuyện về cậu bé Zeze và cây cam ngọt.", Price = 108000, Quantity = 45, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[0].Id, Name = "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", Description = "Tuổi thơ dữ dội và nhẹ nhàng.", Price = 95000, Quantity = 60, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[0].Id, Name = "Mắt Biếc", Description = "Chuyện tình buồn của Ngạn và Hà Lan.", Price = 110000, Quantity = 40, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[0].Id, Name = "Tuổi Trẻ Đáng Giá Bao Nhiêu", Description = "Dành cho tuổi trẻ đang hoang mang.", Price = 80000, Quantity = 70, Status = 1, CreatedAt = DateTime.UtcNow },

                // Kinh tế (7 sản phẩm)
                new Product { CategoryId = categories[1].Id, Name = "Nghĩ Giàu Và Làm Giàu", Description = "Bí quyết tạo dựng sự giàu có.", Price = 120000, Quantity = 35, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[1].Id, Name = "Dạy Con Làm Giàu", Description = "Bài học về tài chính cho trẻ em.", Price = 95000, Quantity = 50, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[1].Id, Name = "Không Bao Giờ Là Thất Bại, Tất Cả Đều Là Trải Nghiệm", Description = "Về khởi nghiệp và thất bại.", Price = 75000, Quantity = 55, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[1].Id, Name = "7 Thói Quen Hiệu Quả", Description = "Những nguyên tắc cơ bản để thành công.", Price = 135000, Quantity = 40, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[1].Id, Name = "Khởi Nghiệp Tinh Gọn", Description = "Lean Startup - Phương pháp khởi nghiệp hiệu quả.", Price = 160000, Quantity = 25, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[1].Id, Name = "Từ Tốt Đến Vĩ Đại", Description = "Làm thế nào để công ty trở nên vĩ đại.", Price = 175000, Quantity = 30, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[1].Id, Name = "Tư Duy Nhanh Và Chậm", Description = "Cách bộ não ra quyết định.", Price = 195000, DiscountPrice = 165000, Quantity = 20, Status = 1, CreatedAt = DateTime.UtcNow },

                // Công nghệ (6 sản phẩm)
                new Product { CategoryId = categories[2].Id, Name = "Clean Code", Description = "Nghệ thuật viết code sạch.", Price = 250000, Quantity = 15, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[2].Id, Name = "Design Patterns", Description = "Các mẫu thiết kế trong lập trình.", Price = 280000, Quantity = 12, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[2].Id, Name = "Học Machine Learning Cơ Bản", Description = "Nhập môn học máy từ A-Z.", Price = 199000, DiscountPrice = 149000, Quantity = 25, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[2].Id, Name = "Head First Java", Description = "Học Java một cách thú vị.", Price = 320000, Quantity = 10, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[2].Id, Name = "C# 12 và .NET 8", Description = "Lập trình C# hiện đại.", Price = 450000, DiscountPrice = 380000, Quantity = 8, Status = 1, CreatedAt = DateTime.UtcNow },
                new Product { CategoryId = categories[2].Id, Name = "React - The Complete Guide", Description = "Tài liệu React từ cơ bản đến nâng cao.", Price = 350000, Quantity = 18, Status = 1, CreatedAt = DateTime.UtcNow }
            };
            context.Products.AddRange(products);
            context.SaveChanges();

            // Seed Posts
            var posts = new List<Post>
            {
                new Post { Title = "Chào mừng đến với BookStation", Content = "BookStation là nền tảng bán sách trực tuyến hàng đầu Việt Nam.", AuthorId = admin.Id, PublishedAt = DateTime.UtcNow },
                new Post { Title = "Top 10 cuốn sách hay nhất tháng", Content = "Danh sách 10 cuốn sách bán chạy nhất tháng này.", AuthorId = admin.Id, PublishedAt = DateTime.UtcNow },
                new Post { Title = "Khuyến mãi cuối năm", Content = "Giảm giá đến 50% cho các đầu sách công nghệ.", AuthorId = admin.Id, PublishedAt = DateTime.UtcNow }
            };
            context.Posts.AddRange(posts);
            context.SaveChanges();
        }
    }
}
