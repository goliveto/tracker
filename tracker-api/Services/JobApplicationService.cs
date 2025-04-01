using JobApplicationsAPI.Models;
using JobApplicationsAPI.Dto;
using JobApplicationsAPI.Enum;
using JobApplicationsAPI.Repositories;
using AutoMapper;

namespace JobApplicationsAPI.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        
        private readonly IJobApplicationRepository _repository;
        private readonly IMapper _mapper;

        public JobApplicationService(IJobApplicationRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<JobApplicationDto?> GetById(int id)
        {
            var jobApplication = await _repository.GetByIdAsync(id);
            return _mapper.Map<JobApplicationDto>(jobApplication);
        }

        public async Task<JobApplicationDto> CreateJobApplication(JobApplicationDto applicationDto)
        {
            var application = _mapper.Map<JobApplication>(applicationDto);
            var jobApplication = await _repository.AddAsync(application);
            return _mapper.Map<JobApplicationDto>(jobApplication);
        }

        public async Task<PaginatedResult<JobApplicationDto>> GetAll(PaginationDto pagination)
        {
            var jobApplications = await _repository.GetAllAsync(pagination);
            return _mapper.Map<PaginatedResult<JobApplicationDto>>(jobApplications);
        }

        public async Task<bool> UpdateStatus(int id, JobApplicationStatus newStatus)
        {
            var jobApplicaton = await _repository.GetByIdAsync(id);
            if(jobApplicaton!=null) {
                jobApplicaton.Status=newStatus;
                return await _repository.UpdateAsync( jobApplicaton);
            }
            return false;
            
        }

        public async Task<bool> UpdateJobApplication(int id, JobApplicationDto dto)
        {
            var jobApplication = await _repository.GetByIdAsync(id);
            if(jobApplication!=null){
                jobApplication.CompanyName = dto.CompanyName;
                jobApplication.DateApplied = dto.DateApplied;
                jobApplication.Position = dto.Position;
                jobApplication.Status= dto.Status;
                return await _repository.UpdateAsync(jobApplication);
            }
            return false;            
        }
    }
}