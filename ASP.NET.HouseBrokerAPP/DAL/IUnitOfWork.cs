using ASP.NET.HouseBrokerAPP.DAL.Repository;
using ASP.NET.HouseBrokerAPP.Models;

namespace ASP.NET.HouseBrokerAPP.DAL
{
    public interface IUnitOfWork : IDisposable
    {
        void Save();
        Task SaveAsync();

        IRepository<Property> PropertyRepository { get; }

        
        
        // Add these methods to get current user
        string? GetCurrentUserName();
        string? GetCurrentUserId();
    }
}
