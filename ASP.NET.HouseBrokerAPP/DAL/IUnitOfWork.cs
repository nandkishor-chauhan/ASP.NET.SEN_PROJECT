using ASP.NET.ASSIGNMENT.SEE.DAL.Repository;
using ASP.NET.ASSIGNMENT.SEE.Models;

namespace ASP.NET.ASSIGNMENT.SEE.DAL
{
    public interface IUnitOfWork : IDisposable
    {
        void Save();
        Task SaveAsync();

        IRepository<Property> PropertyRepository { get; }
        IRepository<StudentInformation> StudentInfoRepository { get; }

        
        
        // Add these methods to get current user
        string? GetCurrentUserName();
        string? GetCurrentUserId();
    }
}
