using ASP.NET.ASSIGNMENT.SEE.Models;

namespace ASP.NET.ASSIGNMENT.SEE.IServices
{
    public interface IStudentInfoService
    {
        Task<object> GetCreateData();
        Task<object> Get();
        Task<StudentInformation> GetById(int qatarID);
        Task<StudentInformation> Create(StudentInformation entity);
        Task<StudentInformation> Edit(StudentInformation entity);
    }
}
