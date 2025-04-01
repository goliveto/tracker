using JobApplicationsAPI.Models;
using JobApplicationsAPI.Dto;
using JobApplicationsAPI.Enum;

namespace JobApplicationsAPI.Services
{
    public interface IJobApplicationService
    {
        Task<JobApplicationDto?> GetById(int id);
        Task<JobApplicationDto> CreateJobApplication(JobApplicationDto applicationDto);
        Task<PaginatedResult<JobApplicationDto>> GetAll(PaginationDto pagination);
        Task<bool> UpdateStatus(int id, JobApplicationStatus newStatus);
        Task<bool> UpdateJobApplication(int id, JobApplicationDto dto);
     }
}