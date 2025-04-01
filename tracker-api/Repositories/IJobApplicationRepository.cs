using JobApplicationsAPI.Models;
using JobApplicationsAPI.Dto;

namespace JobApplicationsAPI.Repositories
{
    public interface IJobApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(int id);
        Task<JobApplication> AddAsync(JobApplication application);
        Task<PaginatedResult<JobApplication>> GetAllAsync(PaginationDto pagination);
        Task<bool> UpdateAsync(JobApplication application);
     }
}