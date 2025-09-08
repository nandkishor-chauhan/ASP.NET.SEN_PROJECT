using ASP.NET.HouseBrokerAPP.DAL;
using ASP.NET.HouseBrokerAPP.IServices;
using ASP.NET.HouseBrokerAPP.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP.NET.HouseBrokerAPP.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<IdentityUser> _userManager;
        public PropertyService(UserManager<IdentityUser> userManager,IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }
        public Task<object> GetCreateData()
        {
            throw new NotImplementedException();
        }
        public async Task<object> Get()
        {
            var currentUserId = _unitOfWork.GetCurrentUserName() ?? throw new InvalidOperationException("No logged-in user.");
            return (await _unitOfWork.PropertyRepository
                .Get()
                .Where(x => x.UserId == currentUserId)
                .Select(x => new
                {
                    x.Id,
                    x.PropertyType,
                    x.ImageUrl,
                    x.Location,
                    x.Price,
                    x.Features,
                    x.Description
                })
                .ToListAsync())
                .Select(x => new
                {
                    x.Id,
                    x.PropertyType,
                    x.ImageUrl,
                    x.Location,
                    x.Price,
                    x.Features,
                    x.Description
                })
                .ToList();
        }

        public async Task<IEnumerable<object>> GetAvailablePropertyList()
        {
            var result = await (from p in _unitOfWork.PropertyRepository.Get()
                                join u in _userManager.Users
                                on p.UserId equals u.UserName
                                select new
                                {
                                    p.Id,
                                    p.PropertyType,
                                    p.Location,
                                    p.Price,
                                    p.Features,
                                    p.Description,
                                    p.ImageUrl,
                                    BrokerName = u.UserName,
                                    BrokerEmail = u.Email,
                                    BrokerPhone = u.PhoneNumber,
                                  //BrokerCity = u.City,
                                   // BrokerStreet = u.Street
                                }).ToListAsync();
            return result;
        }

        public async Task<Property> GetById(Guid id)
        {
            var property = await _unitOfWork.PropertyRepository.GetByIdAsync(id);

            return property is null ? throw new KeyNotFoundException("Category with ID not found.") : property;
        }

        

        public async Task<Property> Create(Property entity)
        {
            //var currentUser = await _userManager.GetUserAsync(User);
            entity.UserId = _unitOfWork.GetCurrentUserName() ?? throw new InvalidOperationException("No logged-in user."); ;
            _unitOfWork.PropertyRepository.Insert(entity);
            await _unitOfWork.SaveAsync();

            return entity;
        }

        public async Task<Property> Edit(Property entity)
        {
            await _unitOfWork.SaveAsync();
            return entity;
        }

    }
}
