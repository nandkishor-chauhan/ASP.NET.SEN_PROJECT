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
        public IActionResult Search()
        {
            return View();
        }




        //[HttpGet]
        //public async Task<IActionResult> Edit(int qatarID)
        //{
        //    var existingStudent = await _unitOfWork.StudentInfoRepository.GetByIdAsync(qatarID);
        //    if (existingStudent == null)
        //    {
        //        return NotFound();
        //    }
        //    return View(existingStudent);
        //}


        [HttpPost]
        public async Task<IActionResult> Create(StudentInformation viewModel, IFormFile? file)
        {
            //string wwwRootPath = _webHostEnvironment.WebRootPath;
            //if (file != null)
            //{
            //    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            //    string productPath = Path.Combine(wwwRootPath, @"images\property");

            //    if (!string.IsNullOrEmpty(viewModel.ImageUrl))
            //    {
            //        //delete oldImage
            //        var oldImagePath =
            //            Path.Combine(wwwRootPath, viewModel.ImageUrl.TrimStart('\\'));

            //        if (System.IO.File.Exists(oldImagePath))
            //        {
            //            System.IO.File.Delete(oldImagePath);
            //        }
            //    }

            //    using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
            //    {
            //        file.CopyTo(fileStream);
            //    }
            //    viewModel.ImageUrl = @"\images\property\" + fileName;
            //}

          
                var student = new StudentInformation
                {
                   // QatarID = viewModel.QatarID,
                    FirstName = viewModel.FirstName,
                    LastName = viewModel.LastName,
                    FullName = viewModel.FirstName + viewModel.LastName,
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
                    ReasonRorClosing = "hfjsh",
                    EntryStatus = viewModel.EntryStatus,
                    formerSchool = viewModel.formerSchool,
                    formerLevel = viewModel.formerLevel,
                    ReportSource = viewModel.ReportSource,
                    ReportDate = viewModel.ReportDate,
                    Instr_W_St = "hhh"
                };

                TempData["success"] = "Property created successfully";
                await _studentInfoService.Create(student);
           
            return RedirectToAction("Index");
            /*   else
               {
                   var existingProperty = _unitOfWork.PropertyRepository.Get(x => x.Id == viewModel.Id).FirstOrDefault();
                   if (existingProperty != null)
                   {
                       existingProperty.PropertyType = viewModel.PropertyType;
                       existingProperty.Description = viewModel.Description;
                       existingProperty.Price = viewModel.Price;
                       existingProperty.Location = viewModel.Location;
                       existingProperty.Features = viewModel.Features;

                       if (viewModel.ImageUrl != null)
                       {
                           existingProperty.ImageUrl = viewModel.ImageUrl;
                       }

                       await _propertyService.Edit(existingProperty);
                   }
               }
               return RedirectToAction("Index");*/
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
