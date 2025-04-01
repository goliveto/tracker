using JobApplicationsAPI.Models;
using Microsoft.AspNetCore.Mvc;
using JobApplicationsAPI.Dto;
using Microsoft.AspNetCore.Cors;
using JobApplicationsAPI.Services;
using JobApplicationsAPI.Enum;
using System.Numerics;

namespace JobApplicationsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IJobApplicationService _jobApplicationService;
        private readonly ILogger<ApplicationsController> _logger;

        public ApplicationsController(IJobApplicationService jobApplicationService, ILogger<ApplicationsController> logger)
        {
            _jobApplicationService = jobApplicationService;
            _logger = logger;
        }

        // GET: api/Applications
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedResult<JobApplicationDto>>> GetApplications(
            [FromQuery] PaginationDto pagination)
        {
            try
            {
                // Basic pagination
                var result = await _jobApplicationService.GetAll(pagination);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving paginated job applications");
                return StatusCode(500, "ERROR-CODE 1: getting Applications");
            }
        }

        // GET: api/Applications/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<JobApplication>> GetApplication(int id)
        {
            try
            {
                var application = await _jobApplicationService.GetById(id);
                if (application == null)
                {
                    return NotFound();
                }

                return Ok(application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving job application with ID {id}");
                return StatusCode(500, "ERROR-CODE 2: getting application");
            }
        }

        // POST: api/Applications
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<JobApplication>> PostApplication([FromBody] JobApplicationDto application)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _jobApplicationService.CreateJobApplication(application);

                return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating job application");
                return StatusCode(500, "ERROR-CODE 3: updating application");
            }
        }

        // PUT: api/Applications/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutApplication(int id, [FromBody]JobApplicationDto application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            try
            {
                var success = await _jobApplicationService.UpdateJobApplication(id,application);

                if (!success)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating job application with ID {id}");
                return StatusCode(500, "ERROR-CODE 4: creating Application");
            }
        }


        // PATCH: api/Applications/5
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PatchApplication(int id, [FromBody] UpdateStatusDto updateStatusDto)
        {
            try
            {
                var success = await _jobApplicationService.UpdateStatus(id, (JobApplicationStatus)updateStatusDto.Status);
                if (!success)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating status with ID {id}");
                return StatusCode(500, "ERROR-CODE 5: creating Application");
            }
        }
    }
}