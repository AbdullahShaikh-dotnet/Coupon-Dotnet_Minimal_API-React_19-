using AutoMapper;
using Coupon_API.Models;
using Coupon_API.Models.DTO;

namespace Coupon_API
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            // Mapping configurations for Coupon
            CreateMap<Coupon, CouponCreateDTO>().ReverseMap();
            CreateMap<Coupon, CouponDTO>().ReverseMap();
            CreateMap<Coupon, CouponUpdateDTO>().ReverseMap();


            // Mapping configurations for User entities
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<UserRegisterDTO, UserDTO>().ReverseMap();
            CreateMap<UserRegisterDTO, User>().ReverseMap();
        }
    }
}
