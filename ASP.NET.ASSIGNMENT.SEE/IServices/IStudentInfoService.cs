using ASP.NET.ASSIGNMENT.SEE.Models;

namespace ASP.NET.ASSIGNMENT.SEE.IServices
{
    public interface IStudentInfoService
    {
        Task<object> GetCreateData();
        Task<object> Get();
        Task<IEnumerable<object>> GetSchoolNameList();
        Task<IEnumerable<object>> GetGradeNameList();
        Task<StudentInformation> GetById(int id);
        Task<StudentInformation> Create(StudentInformation entity);
        Task<StudentInformation> Edit(StudentInformation entity);
    }
}
