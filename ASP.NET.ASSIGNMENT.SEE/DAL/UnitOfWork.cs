using ASP.NET.ASSIGNMENT.SEE.DAL.Repository;
using ASP.NET.ASSIGNMENT.SEE.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ASP.NET.ASSIGNMENT.SEE.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDBContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UnitOfWork(ApplicationDBContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetCurrentUserName()
        {
            return _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        public string? GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }


        private IRepository<StudentInformation>? _studentInfoRepository;
        public IRepository<StudentInformation> StudentInfoRepository => _studentInfoRepository ??= new Repository<StudentInformation>(_context);


        public void Save()
        {
            _context.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        private bool _disposed;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }

                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
