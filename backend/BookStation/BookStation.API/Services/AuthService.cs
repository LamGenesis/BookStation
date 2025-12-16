using BookStation.API.DTOs.Auth;
using BookStation.API.Models;
using BookStation.API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookStation.API.Services
{
    // Implement IAuthService với đầy đủ logic: hash password, tạo JWT, verify credentials
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Check email đã tồn tại chưa
            if (await _userRepository.ExistsByEmailAsync(request.Email))
            {
                throw new Exception("Email already exists");
            }

            // Hash password với BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Tạo user mới 
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                FullName = request.FullName,
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // Tạo tokens
            return await GenerateAuthResponse(createdUser);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Tìm user theo email
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }

            // Verify password với BCrypt
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password");
            }

            // Tạo tokens
            return await GenerateAuthResponse(user);
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            // Tìm refresh token trong DB
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);

            // Validate token
            if (refreshToken == null || refreshToken.IsRevoked)
            {
                throw new Exception("Invalid refresh token");
            }

            if (refreshToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new Exception("Refresh token expired");
            }

            // Revoke token cũ
            await _refreshTokenRepository.RevokeAsync(request.RefreshToken);

            // Tạo tokens mới
            return await GenerateAuthResponse(refreshToken.User);
        }

        public async Task LogoutAsync(string refreshToken)
        {
            await _refreshTokenRepository.RevokeAsync(refreshToken);
        }

        // Private helper methods
        // Tạo complete respose cho client Register/Login/Refresh thành công.
        private async Task<AuthResponseDto> GenerateAuthResponse(User user)
        {
            var accessToken = GenerateAccessToken(user);
            var refreshToken = await GenerateAndSaveRefreshToken(user.Id);

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserInfoDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role
                }
            };
        }

        private string GenerateAccessToken(User user)
        {
            // Step 1: Lấy cấu hình JWT từ appsettings.json
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            // Step 2: Tạo signing key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Step 3: Tạo claims cho token (payload)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Step 4: Tạo JWT token
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!)),
                signingCredentials: credentials
            );

            // Step 5: Trả về token dạng string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Tạo và lưu refresh token vào DB
        private async Task<string> GenerateAndSaveRefreshToken(int userId)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(jwtSettings["RefreshTokenExpirationDays"]!)),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            await _refreshTokenRepository.CreateAsync(refreshToken);
            return refreshToken.Token;
        }

    }
}
