﻿using ASP.NET.HouseBrokerAPP.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET.ASSIGNMENT.Areas.HouseBroker.Controllers
{
    [Area("HouseBroker")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IPropertyService _propertyService;
        public HomeController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }
        public IActionResult Index()
        {
            return View();
        }

        #region API CALLS
        public async Task<JsonResult> GetCreateData()
        {
            try
            {
                var propertyList = await _propertyService.GetAvailablePropertyList();

                return Json(new { success = true, data = propertyList });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        #endregion
    }
}
