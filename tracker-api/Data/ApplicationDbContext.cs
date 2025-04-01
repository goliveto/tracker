using System.Diagnostics.CodeAnalysis;
using JobApplicationsAPI.Models;
using JobApplicationsAPI.Enum;
using Microsoft.EntityFrameworkCore;

namespace JobApplicationsAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<JobApplication> JobApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed some initial data
            modelBuilder.Entity<JobApplication>().HasData(
                new JobApplication
                {
                    Id = 1,
                    CompanyName = "Tech Solutions Inc.",
                    Position = "Front end",
                    Status = JobApplicationStatus.Interview
                },
                new JobApplication
                {
                    Id = 2,
                    CompanyName = "Business Solutions LLC",
                    Position = "Full Stack",
                    Status = JobApplicationStatus.Offer
                }
            );
        }
    }
}