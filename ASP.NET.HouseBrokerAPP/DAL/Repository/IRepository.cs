using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ASP.NET.HouseBrokerAPP.DAL.Repository
{
    public interface IRepository<TEntity> where TEntity : class
    {
        // Query
        IQueryable<TEntity> Get(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "");

        Task<bool> AnyAsync(Expression<Func<TEntity, bool>>? filter = null);

        Task<TEntity?> FirstOrDefaultAsync(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "");

        Task<TEntity?> GetByIdAsync(object id);

        // Insert
        void Insert(TEntity entity);

        // Update
        void Update(TEntity entity);
        void Update(TEntity entity, string property);
        void Update(TEntity entity, IEnumerable<string> properties);
        void UpdateProperty(TEntity entity, string propertyName, object propertyValue);
        void Update(TEntity entity, TEntity model);

        // Delete
        Task DeleteByIdAsync(object id);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);

        // Raw SQL
        Task<IEnumerable<TEntity>> GetWithRawSqlAsync(string sql, params object[] parameters);
    }
}
