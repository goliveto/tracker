
// Repositories/JobApplicationRepository.cs
using JobApplicationsAPI.Data;
using JobApplicationsAPI.Models;
using Microsoft.EntityFrameworkCore;
using JobApplicationsAPI.Dto;

namespace JobApplicationsAPI.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResult<JobApplication>> GetAllAsync(PaginationDto pagination)
            {
                // Validate pagination parameters
                var pageNumber = pagination.PageNumber < 0 ? 0 : pagination.PageNumber;
                var pageSize = pagination.PageSize < 1 ? 10 : pagination.PageSize;
                pageSize = pagination.PageSize > 100 ? 100 : pagination.PageSize;

                // Calculate total count
                var totalCount = await _context.JobApplications.CountAsync();

                // Calculate total pages
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Retrieve paginated items
                var items = await _context.JobApplications
                    .OrderBy(x => x.DateApplied) 
                    .Skip(pageNumber * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

            Console.WriteLine(" Gerardo test " + pageNumber + " " + pageSize +  " items "+ items!=null? items.Count: "dasda s" );

                return new PaginatedResult<JobApplication>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages
                };
            }

        public async Task<JobApplication?> GetByIdAsync(int id)
        {
            return await _context.JobApplications.FindAsync(id);
        }

        public async Task<JobApplication> AddAsync(JobApplication application)
        {
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<bool> UpdateAsync(JobApplication application)
        {
            _context.Entry(application).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await JobApplicationExists(application.Id))
                {
                    return false;
                }
                throw;
            }
        }

        private async Task<bool> JobApplicationExists(int id)
        {
            return await _context.JobApplications.AnyAsync(e => e.Id == id);
        }
    }
}