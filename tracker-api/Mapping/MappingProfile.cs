using AutoMapper;
using JobApplicationsAPI.Models;
using JobApplicationsAPI.Dto;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        AllowNullCollections = true;
        CreateMap<JobApplication, JobApplicationDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
        CreateMap<JobApplicationDto, JobApplication>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
        CreateMap<PaginatedResult<JobApplication>, PaginatedResult<JobApplicationDto>>()
            .ForMember(dest => dest.Items, opt=>opt.MapFrom(src => src.Items));
        CreateMap<PaginatedResult<JobApplicationDto>, PaginatedResult<JobApplication>>()
            .ForMember(dest => dest.Items, opt=>opt.MapFrom(src => src.Items));
    }
}