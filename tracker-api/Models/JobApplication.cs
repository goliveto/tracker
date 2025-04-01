using JobApplicationsAPI.Enum;
namespace JobApplicationsAPI.Models
{
    public class JobApplication
    {
        public int Id { get; set; }
        public string Position { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public JobApplicationStatus Status { get; set; } = JobApplicationStatus.Default;
        public DateTime DateApplied { get; set; } = DateTime.Now;
    }
}