using System.Threading.Tasks;
using AutoMapper;
using JobApplicationsAPI.Models;
using JobApplicationsAPI.Dto;
using JobApplicationsAPI.Enum;
using JobApplicationsAPI.Repositories;
using JobApplicationsAPI.Services;
using Moq;
using Xunit;

namespace JobApplicationsAPI.Test {
    public class JobApplicationServiceTests
    {
        private readonly Mock<IJobApplicationRepository> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly JobApplicationService _service;

        public JobApplicationServiceTests()
        {
            _repositoryMock = new Mock<IJobApplicationRepository>();
            _mapperMock = new Mock<IMapper>();
            _service = new JobApplicationService(_repositoryMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task GetById_ShouldReturnJobApplicationDto_WhenJobApplicationExists()
        {
            var jobApplication = new JobApplication { Id = 1, Position = "Developer", CompanyName="Datacom" };
            var jobApplicationDto = new JobApplicationDto { Id = 1, Position = "Developer",CompanyName="Datacom" };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(jobApplication);
            _mapperMock.Setup(mapper => mapper.Map<JobApplicationDto>(jobApplication)).Returns(jobApplicationDto);

            // Act
            var result = await _service.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(jobApplicationDto.Id, result.Id);
            Assert.Equal(jobApplicationDto.Position, result.Position);
        }

        [Fact]
        public async Task CreateJobApplication_ShouldReturnJobApplicationDto_WhenJobApplicationIsCreated()
        {
            var jobApplication = new JobApplication { Id = 1, Position = "Developer", CompanyName = "Datacom"};
            var jobApplicationDto = new JobApplicationDto { Id = 1, Position = "Developer", CompanyName = "Datacom" };

            _repositoryMock.Setup(repo => repo.AddAsync(jobApplication)).ReturnsAsync(jobApplication);
            _mapperMock.Setup(mapper => mapper.Map<JobApplicationDto>(jobApplication)).Returns(jobApplicationDto);

            // Act
            var result = await _service.CreateJobApplication(jobApplicationDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(jobApplicationDto.Id, result.Id);
            Assert.Equal(jobApplicationDto.Position, result.Position);
            Assert.Equal(jobApplicationDto.CompanyName, result.CompanyName);
        }

        [Fact]
        public async Task UpdateStatus_ShouldReturnTrue_WhenStatusIsUpdated()
        {
            
            var jobApplication = new JobApplication { Id = 1, Status = JobApplicationStatus.Interview };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(jobApplication);
            _repositoryMock.Setup(repo => repo.UpdateAsync(jobApplication)).ReturnsAsync(true);

            // Act
            var result = await _service.UpdateStatus(1, JobApplicationStatus.Interview);

            // Assert
            Assert.True(result);
            Assert.Equal(JobApplicationStatus.Interview, jobApplication.Status);
        }
    }
}