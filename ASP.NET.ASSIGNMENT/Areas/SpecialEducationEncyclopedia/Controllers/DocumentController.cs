using ASP.NET.ASSIGNMENT.SEE.DAL;
using ASP.NET.ASSIGNMENT.SEE.IServices;
using ASP.NET.ASSIGNMENT.SEE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET.ASSIGNMENT.Areas.SpecialEducationEncyclopedia.Controllers
{
    [Area("SpecialEducationEncyclopedia")]
    [Authorize]
    public class DocumentController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStudentInfoService _studentInfoService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DocumentController(IUnitOfWork unitOfWork, IStudentInfoService studentInfoService, IWebHostEnvironment webHostEnvironment)
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


        [HttpGet]
        public IActionResult GetFilesByQatarID(long qatarID)
        {
            if (qatarID <= 0)
                return BadRequest(new { success = false, message = "Invalid Qatar ID" });

            string studentFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", qatarID.ToString());

            if (!Directory.Exists(studentFolder))
                return Ok(new { success = true, files = new List<object>() }); // No folder = no files

            var files = Directory.GetFiles(studentFolder)
                .Select(path => new
                {
                    FileName = Path.GetFileName(path),
                    Url = $"/uploads/{qatarID}/{Path.GetFileName(path)}",
                    DateCreated = System.IO.File.GetCreationTime(path).ToString("yyyy-MM-dd"),
                    qatarID,
                    
                })
                .ToList();

            return Ok(new { success = true, files, count = files.Count });
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

 


        #endregion
    }
}
