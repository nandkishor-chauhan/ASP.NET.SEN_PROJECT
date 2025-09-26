using System.ComponentModel.DataAnnotations;

namespace ASP.NET.ASSIGNMENT.SEE.Models
{
    public class StudentInformation
    {

        [Key]
        public int QatarID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? FullName { get; set; }
        public string? Nationalty { get; set; }
        public string Grade { get; set; }
        public string? Division { get; set; }
        public string? FatherPhone { get; set; }
        public string? MatherPhone { get; set; }
        public string? UncalPhone { get; set; }
        public string? OtherPhone { get; set; }
        public string? HomeNumber { get; set; }
        public string? StreetNumber { get; set; }
        public string? ZoneNumber { get; set; }
        public string? City { get; set; }
        public string? HealthNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? DateOfRegistration { get; set; }
        public string? TypeOfDisability { get; set; }
        public string? Severity { get; set; }
        public string LevelSuport { get; set; }
        public string? Stat { get; set; }
        public string? Diagnosis { get; set; }
        public string? CaseDescription { get; set; }
        public int? IQ { get; set; }
        public DateTime? DateOfClose { get; set; }
        public string? ReasonRorClosing { get; set; }
        public string? EntryStatus { get; set; }
        public string? formerSchool { get; set; }
        public string? formerLevel { get; set; }
        public string? ReportSource { get; set; }
        public DateTime? ReportDate { get; set; }
        public string? Instr_W_St { get; set; }
    }
}
