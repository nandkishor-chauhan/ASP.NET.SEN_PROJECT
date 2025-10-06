using System.ComponentModel.DataAnnotations;

namespace ASP.NET.ASSIGNMENT.SEE.Models
{
    public class StudentInformation
    {

        [Key]
        public int Id { get; set; }
        public long QatarID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Nationalty { get; set; }
        public int Grade { get; set; }
        public int? Division { get; set; }

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
        public int LevelSuport { get; set; }
        public int PreviousLevelSuport { get; set; }
        public string? Stat { get; set; }
        public string? Diagnosis { get; set; }
        public string? CaseDescription { get; set; }
        public int? IQ { get; set; }

        public DateTime? DateOfClose { get; set; }
        public string? ReasonRorClosing { get; set; }
        public string EntryStatus { get; set; } = string.Empty;

        public string formerSchool { get; set; } = string.Empty;
        public string formerLevel { get; set; } = string.Empty;

        public string? ReportSource { get; set; }
        public DateTime? ReportDate { get; set; }
        public string? Instr_W_St { get; set; }

        public DateTime? CreatedOn { get; set; }
    }
}
