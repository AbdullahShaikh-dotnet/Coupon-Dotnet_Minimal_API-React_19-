using AutoMapper;
using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Coupon_API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Coupon_API.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly string secretKey;

        public AuthRepository(ApplicationDbContext db, IMapper mapper, IConfiguration configuration)
        {
            _db = db;
            _mapper = mapper;
            _configuration = configuration;
            secretKey = _configuration.GetValue<string>("Auth:secret");
        }

        public bool IsUniqueUser(string userName)
        {
            var user = _db.Users.FirstOrDefault(u => u.UserName.ToLower() == userName.ToLower());
            return user == null;
        }

        public async Task<UserLoginResponseDTO> Login(UserLoginDTO LoginObject)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => 
            u.UserName.ToLower() == LoginObject.UserName.ToLower()
            && u.Password == LoginObject.Password);


            if (user == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role),
                }),

                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            UserLoginResponseDTO loginResponseObject = new UserLoginResponseDTO
            {
                User = _mapper.Map<UserDTO>(user),
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };

            return loginResponseObject;
        }

        public async Task<UserDTO> Register(UserRegisterDTO RegisterObject)
        {
            var User = _mapper.Map<User>(RegisterObject);
            User.Role = "admin"; // Default role for new users

            await _db.Users.AddAsync(User);
            _db.SaveChanges();

            User.Password = string.Empty; // Clear password before returning

            return _mapper.Map<UserDTO>(User);
        }
    }
}
