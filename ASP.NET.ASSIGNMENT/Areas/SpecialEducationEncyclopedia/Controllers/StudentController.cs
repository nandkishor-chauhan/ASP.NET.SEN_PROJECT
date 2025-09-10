using ASP.NET.ASSIGNMENT.SEE.DAL;
using ASP.NET.ASSIGNMENT.SEE.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET.ASSIGNMENT.Areas.SpecialEducationEncyclopedia.Controllers
{
    [Area("SpecialEducationEncyclopedia")]
    [Authorize]
    public class StudentController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStudentInfoService _studentInfoService;
        public StudentController(IUnitOfWork unitOfWork, IStudentInfoService studentInfoService)
        {
            _studentInfoService = studentInfoService;
            _unitOfWork = unitOfWork;
        }
        public IActionResult Index()
        {
            return View();
        }

        #region API CALLS
        public async Task<JsonResult> Get()
        {
            try
            {
                var studentList = await _studentInfoService.Get();

                return Json(new { success = true, data = studentList });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        // [HttpGet("GetById/{qatarID}")]
        [HttpGet]
        public async Task<ActionResult> GetById(int qatarID)
        {
            try
            {
                var existingStudent = await _unitOfWork.StudentInfoRepository.GetByIdAsync(qatarID);

                if (existingStudent == null)
                {
                    return Json(new { success = false, error = "Student not found" });
                }

                var student = new
                {
                    existingStudent.QatarID,
                    existingStudent.FirstName,
                    existingStudent.LastName,
                    existingStudent.FullName,
                    existingStudent.Nationalty,
                    existingStudent.Grade,
                    existingStudent.Division,
                    existingStudent.FatherPhone,
                    existingStudent.MatherPhone,
                    existingStudent.UncalPhone,
                    existingStudent.OtherPhone,
                    existingStudent.HomeNumber,
                    existingStudent.StreetNumber,
                    existingStudent.ZoneNumber,
                    existingStudent.City,
                    existingStudent.HealthNumber,
                    existingStudent.DateOfBirth,
                    existingStudent.DateOfRegistration,
                    existingStudent.TypeOfDisability,
                    existingStudent.Severity,
                    existingStudent.LevelSuport,
                    existingStudent.Stat,
                    existingStudent.Diagnosis,
                    existingStudent.CaseDescription,
                    existingStudent.IQ,
                    existingStudent.DateOfClose,
                    existingStudent.ReasonRorClosing,
                    existingStudent.EntryStatus,
                    existingStudent.formerSchool,
                    existingStudent.formerLevel,
                    existingStudent.ReportSource,
                    existingStudent.ReportDate,
                    existingStudent.Instr_W_St
                };

                return Json(new { success = true, data = student });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }


        #endregion
    }
}
