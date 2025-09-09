using ASP.NET.ASSIGNMENT.SEE.DAL;
using ASP.NET.ASSIGNMENT.SEE.IServices;
using ASP.NET.ASSIGNMENT.SEE.Models;
using ASP.NET.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ASP.NET.ASSIGNMENT.Areas.HouseBroker.Controllers
{
    [Area("HouseBroker")]
    [Authorize(Roles = StaticDetail.Role_Broker)]
    public class PropertyController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IPropertyService _propertyService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public PropertyController(UserManager<IdentityUser> userManager,
            IUnitOfWork unitOfWork,
            IPropertyService propertyService,
            IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _propertyService = propertyService;
            _webHostEnvironment = webHostEnvironment;

        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Edit()
        {
            return View();
        }

        public IActionResult Create(Guid? id)
        {
            var propertyTypes = new List<string> { "Apartment", "Villa", "House", "Office" };
            ViewBag.PropertyTypes = propertyTypes;

            if (id == null || id == Guid.Empty)
            {
                return View();
            }

            var existingProperty = _unitOfWork.PropertyRepository.Get(x => x.Id == id).FirstOrDefault();

            if (existingProperty == null)
            {
                return NotFound();
            }

            return View(existingProperty);

        }



        [HttpPost]
        public async Task<IActionResult> Create(Property viewModel, IFormFile? file)
        {
            string wwwRootPath = _webHostEnvironment.WebRootPath;
            if (file != null)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string productPath = Path.Combine(wwwRootPath, @"images\property");

                if (!string.IsNullOrEmpty(viewModel.ImageUrl))
                {
                    //delete oldImage
                    var oldImagePath =
                        Path.Combine(wwwRootPath, viewModel.ImageUrl.TrimStart('\\'));

                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }
                viewModel.ImageUrl = @"\images\property\" + fileName;
            }

            if (viewModel.Id == Guid.Empty)
            {
                var property = new Property
                {
                    Id = Guid.NewGuid(),
                    PropertyType = viewModel.PropertyType,
                    Description = viewModel.Description,
                    Price = viewModel.Price,
                    Location = viewModel.Location,
                    ImageUrl = viewModel.ImageUrl,
                    Features = viewModel.Features,
                };
                TempData["success"] = "Property created successfully";
                await _propertyService.Create(property);
            }
            else
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
            return RedirectToAction("Index");
        }



        #region API CALLS
        public async Task<JsonResult> Get()
        {
            try
            {
                var propertyList = await _propertyService.Get();
                return Json(new { success = true, data = propertyList });
            }
            catch (Exception ex)
            {
                // Return error message directly without a custom handler
                return Json(new { success = false, error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetById(Guid id)
        {
            try
            {
                var existingProperty = await _unitOfWork.PropertyRepository.GetByIdAsync(id);

                var property = new
                {
                    existingProperty?.Id,
                    existingProperty?.PropertyType,
                    existingProperty?.Description,
                    existingProperty?.Price,
                    existingProperty?.Location,
                    existingProperty?.ImageUrl,
                    existingProperty?.Features
                };
                return Json(new { success = true, data = property });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existingProperty = await _unitOfWork.PropertyRepository.GetByIdAsync(id);
            if (existingProperty == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }

            //delete oldImage
            if (!string.IsNullOrEmpty(existingProperty.ImageUrl))
            {
                var oldImagePath = Path.Combine(
                    _webHostEnvironment.WebRootPath,
                    existingProperty.ImageUrl.TrimStart('\\')
                );

                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }

            _unitOfWork.PropertyRepository.Delete(existingProperty);
            _unitOfWork.Save();

            return Json(new
            {
                success = true,
                message = "Product Delete Successful"
            });

    }

#endregion
    }
}
