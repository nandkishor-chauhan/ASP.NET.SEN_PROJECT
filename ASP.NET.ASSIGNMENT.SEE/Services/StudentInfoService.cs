using ASP.NET.ASSIGNMENT.SEE.DAL;
using ASP.NET.ASSIGNMENT.SEE.IServices;
using ASP.NET.ASSIGNMENT.SEE.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET.ASSIGNMENT.SEE.Services
{
    public class StudentInfoService : IStudentInfoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<IdentityUser> _userManager;
        public StudentInfoService(UserManager<IdentityUser> userManager, IUnitOfWork unitOfWork)
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
                    x.QatarID,
                    x.FirstName,
                    x.LastName,
                    x.FullName,
                    Nationalty = x.Nationalty ??"",
                    x.Grade,
                    x.Division,
                    FatherPhone = x.FatherPhone ?? "",
                    MatherPhone = x.MatherPhone ?? "",
                    UncalPhone = x.UncalPhone ?? "",
                    OtherPhone = x.OtherPhone ?? "",
                    HomeNumber = x.HomeNumber ?? "",
                    StreetNumber = x.StreetNumber ?? "",
                    ZoneNumber = x.ZoneNumber ?? "",
                    City = x.City ?? "",
                    HealthNumber = x.HealthNumber ?? "",
                    
                    TypeOfDisability = x.TypeOfDisability ?? "",
                    Severity = x.Severity ?? "",
                    x.LevelSuport,
                    Stat = x.Stat ?? "",
                    Diagnosis = x.Diagnosis ?? "",
                    CaseDescription = x.CaseDescription ?? "",
                    x.IQ,
                    ReasonRorClosing = x.ReasonRorClosing ?? "",
                    EntryStatus = x.EntryStatus ?? "",
                    formerSchool = x.formerSchool ?? "",
                    formerLevel = x.formerLevel ?? "",
                    ReportSource = x.ReportSource ?? "",
                    Instr_W_S = x.Instr_W_St ?? "",

                    x.DateOfBirth,
                    x.DateOfRegistration,
                    x.DateOfClose,
                    x.ReportDate,


                })
                .ToListAsync())
                .Select(x => new
                {
                    x.QatarID,
                    x.FirstName,
                    x.LastName,
                    x.FullName,
                    x.Nationalty,
                    x.Grade,
                    x.Division,
                    x.FatherPhone,
                    x.MatherPhone,
                    x.UncalPhone,
                    x.OtherPhone,
                    x.HomeNumber,
                    x.StreetNumber,
                    x.ZoneNumber,
                    x.City,
                    x.HealthNumber,
                    x.TypeOfDisability,
                    x.Severity,
                    x.LevelSuport,
                    x.Stat,
                    x.Diagnosis,
                    x.CaseDescription,
                    x.IQ,
                    x.ReasonRorClosing,
                    x.EntryStatus,
                    x.formerSchool,
                    x.formerLevel,
                    x.ReportSource,
                    DateOfBirth = x.DateOfBirth?.ToString("yyyy-MM-dd") ?? "",
                    DateOfRegistration = x.DateOfRegistration?.ToString("yyyy-MM-dd") ?? "",
                    DateOfClose = x.DateOfClose?.ToString("yyyy-MM-dd") ?? "",
                    ReportDate = x.ReportDate?.ToString("yyyy-MM-dd") ?? "",

                    //x.Instr_W_St
                })
                .ToList();
        }

        public async Task<IEnumerable<object>> GetSchoolNameList()
        {
            return await _unitOfWork.StudentInfoRepository
                .Get()
                .Select(x => new { formerSchool = x.formerSchool ?? "" })
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
            return await _unitOfWork.StudentInfoRepository.GetByIdAsync(qatarID);
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
