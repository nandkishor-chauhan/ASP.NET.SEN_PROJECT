using ASP.NET.ASSIGNMENT.SEE.DAL;
using ASP.NET.ASSIGNMENT.SEE.IServices;
using ASP.NET.ASSIGNMENT.SEE.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP.NET.ASSIGNMENT.SEE.Services
{
    public class StudentInfoService : IStudentInfoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<IdentityUser> _userManager;
        public StudentInfoService(UserManager<IdentityUser> userManager,IUnitOfWork unitOfWork)
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
            return (await _unitOfWork.StudentInfoRepository
                .Get()
                .Select(x => new
                {
                   // x.Id,
                    x.QatarID,
                    x.Nationalty,
                    x.FullName,
                    x.LevelSuport,
                    x.MatherPhone,
                    x.EntryStatus,
                    x.Grade,
                })
                .ToListAsync())
                .Select(x => new
                {
                   // x.Id,
                    x.QatarID,
                    x.Nationalty,
                    x.FullName,
                    x.LevelSuport,
                    x.MatherPhone,
                    x.EntryStatus,
                    x.Grade
                })
                .ToList();
        }

        public async Task<IEnumerable<object>> GetSchoolNameList()
        {
            return await _unitOfWork.StudentInfoRepository
                .Get()
                .Select(x => new { x.formerSchool })
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> GetGradeNameList()
        {
            return await _unitOfWork.StudentInfoRepository
                .Get()
                .Select(x => new { x.Grade })
                .Distinct()
                .ToListAsync();
        }


        public async Task<StudentInformation> GetById(int qatarID)
        {
            var studentInfo = await _unitOfWork.StudentInfoRepository.GetByIdAsync(qatarID);

            return studentInfo is null ? throw new KeyNotFoundException("Category with ID not found.") : studentInfo;
        }

        

        public async Task<StudentInformation> Create(StudentInformation entity)
        {
            //var currentUser = await _userManager.GetUserAsync(User);
            //entity.UserId = _unitOfWork.GetCurrentUserName() ?? throw new InvalidOperationException("No logged-in user."); ;
            _unitOfWork.StudentInfoRepository.Insert(entity);
            await _unitOfWork.SaveAsync();

            return entity;
        }

        public async Task<StudentInformation> Edit(StudentInformation entity)
        {
            await _unitOfWork.SaveAsync();
            return entity;
        }

    }
}
