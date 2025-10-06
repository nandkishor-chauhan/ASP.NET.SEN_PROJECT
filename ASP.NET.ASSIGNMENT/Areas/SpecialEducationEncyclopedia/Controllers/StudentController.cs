using ASP.NET.ASSIGNMENT.SEE.DAL;
using ASP.NET.ASSIGNMENT.SEE.IServices;
using ASP.NET.ASSIGNMENT.SEE.Models;
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
        private readonly IWebHostEnvironment _webHostEnvironment;
        public StudentController(IUnitOfWork unitOfWork, IStudentInfoService studentInfoService, IWebHostEnvironment webHostEnvironment)
        {
            _studentInfoService = studentInfoService;
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }
        public IActionResult Edit(int id)
        {
            return View();
        }
        public IActionResult Search()
        {
            return View();
        }


        [HttpPost]
        public async Task<JsonResult> Create(StudentInformation viewModel, IFormFile? file)
        {

            if (await _unitOfWork.StudentInfoRepository.AnyAsync(x => x.QatarID == viewModel.QatarID))
            {
                throw new Exception("Student Id already exist");
            }

            var student = new StudentInformation
            {
                QatarID = viewModel.QatarID,
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                FullName = viewModel.FirstName + " " + viewModel.LastName,
                Nationalty = viewModel.Nationalty,
                Grade = viewModel.Grade,
                Division = viewModel.Division,
                FatherPhone = viewModel.FatherPhone,
                MatherPhone = viewModel.MatherPhone,
                UncalPhone = viewModel.UncalPhone,
                OtherPhone = viewModel.OtherPhone,
                HomeNumber = viewModel.HomeNumber,
                StreetNumber = viewModel.StreetNumber,
                ZoneNumber = viewModel.ZoneNumber,
                City = viewModel.City,
                HealthNumber = viewModel.HealthNumber,
                DateOfBirth = viewModel.DateOfBirth,
                DateOfRegistration = viewModel.DateOfRegistration,
                TypeOfDisability = viewModel.TypeOfDisability,
                Severity = viewModel.Severity,
                LevelSuport = viewModel.LevelSuport,
                Stat = viewModel.Stat,
                Diagnosis = viewModel.Diagnosis,
                CaseDescription = viewModel.CaseDescription,
                IQ = viewModel.IQ,
                DateOfClose = viewModel.DateOfClose,
                ReasonRorClosing = viewModel.ReasonRorClosing,
                EntryStatus = viewModel.EntryStatus,
                formerSchool = viewModel.formerSchool,
                formerLevel = viewModel.formerLevel,
                ReportSource = viewModel.ReportSource,
                ReportDate = viewModel.ReportDate,
                Instr_W_St = viewModel.Instr_W_St
            };

            await _studentInfoService.Create(student);

            return Json(new { success = true, message = "Student updated successfully." });
        }


        [HttpPost]
        public async Task<JsonResult> Edit(StudentInformation viewModel)
        {
            if (viewModel.Id == 0)
            {
                return Json(new { success = false, message = "Student Id is missing." });
            }

            var existingStudent = await _studentInfoService.GetById(viewModel.Id)
                ?? throw new Exception("Student Id does not exist");

            if (viewModel.QatarID != existingStudent.QatarID)
            {
                if (await _unitOfWork.StudentInfoRepository.AnyAsync(x => x.QatarID == viewModel.QatarID))
                {
                    throw new Exception("Student Id already exist");
                }

                existingStudent.QatarID = viewModel.QatarID;
            }


            if (existingStudent != null)
            {
                existingStudent.FirstName = viewModel.FirstName;
                existingStudent.LastName = viewModel.LastName;
                existingStudent.FullName = viewModel.FirstName + " "+ viewModel.LastName;
                existingStudent.Nationalty = viewModel.Nationalty;
                existingStudent.Grade = viewModel.Grade;
                existingStudent.Division = viewModel.Division;
                existingStudent.FatherPhone = viewModel.FatherPhone;
                existingStudent.MatherPhone = viewModel.MatherPhone;
                existingStudent.UncalPhone = viewModel.UncalPhone;
                existingStudent.OtherPhone = viewModel.OtherPhone;
                existingStudent.HomeNumber = viewModel.HomeNumber;
                existingStudent.StreetNumber = viewModel.StreetNumber;
                existingStudent.ZoneNumber = viewModel.ZoneNumber;
                existingStudent.City = viewModel.City;
                existingStudent.HealthNumber = viewModel.HealthNumber;
                existingStudent.DateOfBirth = viewModel.DateOfBirth;
                existingStudent.DateOfRegistration = viewModel.DateOfRegistration;
                existingStudent.TypeOfDisability = viewModel.TypeOfDisability;
                existingStudent.Severity = viewModel.Severity;
                existingStudent.LevelSuport = viewModel.LevelSuport;
                existingStudent.Stat = viewModel.Stat;
                existingStudent.Diagnosis = viewModel.Diagnosis;
                existingStudent.CaseDescription = viewModel.CaseDescription;
                existingStudent.IQ = viewModel.IQ;
                existingStudent.DateOfClose = viewModel.DateOfClose;
                existingStudent.ReasonRorClosing = viewModel.ReasonRorClosing;
                existingStudent.EntryStatus = viewModel.EntryStatus;
                existingStudent.formerSchool = viewModel.formerSchool;
                existingStudent.formerLevel = viewModel.formerLevel;
                existingStudent.ReportSource = viewModel.ReportSource;
                existingStudent.ReportDate = viewModel.ReportDate;
                existingStudent.Instr_W_St = viewModel.Instr_W_St;

                await _studentInfoService.Edit(existingStudent);
            }

            return Json(new { success = true, message = "Student updated successfully." });
        }


        [HttpPost]
        public async Task<IActionResult> UploadFiles(int studentId, List<IFormFile> files)
        {
            if (studentId <= 0)
                return BadRequest(new { success = false, message = "Valid Student ID is required" });

            if (files == null || files.Count == 0)
                return BadRequest(new { success = false, message = "No files uploaded" });

            // Folder path: wwwroot/uploads/{studentId}
            string studentFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", studentId.ToString());

            // If folder already exists, new files will just be added to it
            if (!Directory.Exists(studentFolder))
                Directory.CreateDirectory(studentFolder);

            foreach (var file in files)
            {
                string filePath = Path.Combine(studentFolder, file.FileName);

                //Overwrite existing file if same name
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // OR (to prevent overwrite, generate unique file name):
                /*
                string uniqueFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string filePath = Path.Combine(studentFolder, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                */
            }

            return Ok(new { success = true, message = $"Uploaded {files.Count} file(s) into folder {studentId}" });
        }




        #region API CALLS

        public async Task<JsonResult> GetCreatedData()
        {
            try
            {
                var schoolNameList = await _studentInfoService.GetSchoolNameList();
                var gradeNameList = await _studentInfoService.GetGradeNameList();
                return Json(new { success = true, data = schoolNameList, gradeNameList });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

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

        //[HttpGet("GetById/{qatarID}")]
        [HttpGet]
        public async Task<ActionResult> GetById(int id)
        {
            try
            {
                var existingStudent = await _studentInfoService.GetById(id);

                if (existingStudent == null)
                {
                    return Json(new { success = false, error = "Student not found" });
                }

                var student = new
                {
                    existingStudent.Id,
                    existingStudent.QatarID,
                    existingStudent.FirstName,
                    existingStudent.LastName,
                    existingStudent.FullName,
                    Nationalty = existingStudent.Nationalty ?? "",
                    existingStudent.Grade,
                    existingStudent.Division,
                    FatherPhone = existingStudent.FatherPhone ?? "",
                    MatherPhone = existingStudent.MatherPhone ?? "",
                    UncalPhone = existingStudent.UncalPhone ?? "",
                    OtherPhone = existingStudent.OtherPhone ?? "",
                    HomeNumber = existingStudent.HomeNumber ?? "",
                    StreetNumber = existingStudent.StreetNumber ?? "",
                    ZoneNumber = existingStudent.ZoneNumber ?? "",
                    City = existingStudent.City ?? "",
                    HealthNumber = existingStudent.HealthNumber ?? "",
                    TypeOfDisability = existingStudent.TypeOfDisability ?? "",
                    Severity = existingStudent.Severity ?? "",
                    existingStudent.LevelSuport,
                    Stat = existingStudent.Stat ?? "",
                    Diagnosis = existingStudent.Diagnosis ?? "",
                    CaseDescription = existingStudent.CaseDescription ?? "",
                    existingStudent.IQ,
                    ReasonRorClosing = existingStudent.ReasonRorClosing ?? "",
                    existingStudent.EntryStatus,
                    formerSchool = existingStudent.formerSchool ?? "",
                    formerLevel = existingStudent.formerLevel ?? "",
                    ReportSource = existingStudent.ReportSource ?? "",
                    Instr_W_St = existingStudent.Instr_W_St ?? "",

                    DateOfBirth = existingStudent.DateOfBirth?.ToString("yyyy-MM-dd") ?? "",
                    DateOfRegistration = existingStudent.DateOfRegistration?.ToString("yyyy-MM-dd") ?? "",
                    DateOfClose = existingStudent.DateOfClose?.ToString("yyyy-MM-dd") ?? "",
                    ReportDate = existingStudent.ReportDate?.ToString("yyyy-MM-dd") ?? "",



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
