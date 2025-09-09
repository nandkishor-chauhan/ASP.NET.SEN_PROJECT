using System.ComponentModel.DataAnnotations;

namespace ASP.NET.ASSIGNMENT.SEE.Models
{
    public class StudentInformation
    {

        [Key]
        public int QatarID { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(200)]
        public string FullName { get; set; }

        [StringLength(100)]
        public string Nationalty { get; set; }

        [StringLength(50)]
        public string Grade { get; set; }

        [StringLength(50)]
        public string Division { get; set; }

        [StringLength(20)]
        public string FatherPhone { get; set; }

        [StringLength(20)]
        public string MatherPhone { get; set; }

        [StringLength(20)]
        public string UncalPhone { get; set; }

        [StringLength(20)]
        public string OtherPhone { get; set; }

        [StringLength(20)]
        public string HomeNumber { get; set; }

        [StringLength(20)]
        public string StreetNumber { get; set; }

        [StringLength(20)]
        public string ZoneNumber { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(50)]
        public string HealthNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public DateTime? DateOfRegistration { get; set; }

        [StringLength(200)]
        public string TypeOfDisability { get; set; }

        [StringLength(100)]
        public string Severity { get; set; }

        [StringLength(50)]
        public string LevelSuport { get; set; }

        [StringLength(50)]
        public string Stat { get; set; }

        [StringLength(200)]
        public string Diagnosis { get; set; }

        public string CaseDescription { get; set; }

        public int? IQ { get; set; }

        public DateTime? DateOfClose { get; set; }

        [StringLength(200)]
        public string ReasonRorClosing { get; set; }

        [StringLength(100)]
        public string EntryStatus { get; set; }

        [StringLength(200)]
        public string formerSchool { get; set; }

        [StringLength(50)]
        public string formerLevel { get; set; }

        [StringLength(200)]
        public string ReportSource { get; set; }

        public DateTime? ReportDate { get; set; }

        [StringLength(200)]
        public string Instr_W_St { get; set; }
    }
}
