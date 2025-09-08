using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ASP.NET.HouseBrokerAPP.DAL.Repository
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly ApplicationDBContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public Repository(ApplicationDBContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public virtual IQueryable<TEntity> Get(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = _dbSet;

            if (filter != null)
                query = query.Where(filter);

            foreach (var includeProperty in includeProperties.Split(',', StringSplitOptions.RemoveEmptyEntries))
                query = query.Include(includeProperty);

            return orderBy != null ? orderBy(query) : query;
        }

        public virtual async Task<bool> AnyAsync(Expression<Func<TEntity, bool>>? filter = null)
        {
            return filter != null ? await _dbSet.AnyAsync(filter) : await _dbSet.AnyAsync();
        }

        public virtual async Task<TEntity?> FirstOrDefaultAsync(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = _dbSet;

            if (filter != null)
                query = query.Where(filter);

            foreach (var includeProperty in includeProperties.Split(',', StringSplitOptions.RemoveEmptyEntries))
                query = query.Include(includeProperty);

            if (orderBy != null)
                query = orderBy(query);

            return await query.FirstOrDefaultAsync();
        }

        public virtual async Task<TEntity?> GetByIdAsync(object id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual void Insert(TEntity entity)
        {
            _dbSet.Add(entity);
        }
        public virtual async Task DeleteByIdAsync(object id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
                Delete(entity);
        }

        public virtual void Delete(TEntity entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
                _dbSet.Attach(entity);

            _dbSet.Remove(entity);
        }

        public virtual void DeleteRange(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                if (_context.Entry(entity).State == EntityState.Detached)
                    _dbSet.Attach(entity);
            }

            _dbSet.RemoveRange(entities);
        }

        public virtual void Update(TEntity entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
                _dbSet.Attach(entity);

            _context.Entry(entity).State = EntityState.Modified;
        }

        public virtual void Update(TEntity entity, string property)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).Property(property).IsModified = true;
        }

        public virtual void Update(TEntity entity, IEnumerable<string> properties)
        {
            _dbSet.Attach(entity);
            foreach (var property in properties)
                _context.Entry(entity).Property(property).IsModified = true;
        }

        public virtual void UpdateProperty(TEntity entity, string propertyName, object propertyValue)
        {
            var entry = _context.Entry(entity).Property(propertyName);
            entry.CurrentValue = propertyValue;
            entry.IsModified = true;
        }

        public virtual void Update(TEntity entity, TEntity model)
        {
            var updatedEntity = MergeEntities(entity, model);

            _dbSet.Attach(entity);
            _context.Entry(entity).CurrentValues.SetValues(updatedEntity);
        }

        private static TEntity MergeEntities(TEntity original, TEntity updated)
        {
            foreach (var prop in typeof(TEntity).GetProperties())
            {
                var newValue = prop.GetValue(updated);
                if (newValue == null)
                {
                    var oldValue = prop.GetValue(original);
                    prop.SetValue(updated, oldValue);
                }
            }

            return updated;
        }

        public virtual async Task<IEnumerable<TEntity>> GetWithRawSqlAsync(string sql, params object[] parameters)
        {
            return await _dbSet.FromSqlRaw(sql, parameters).ToListAsync();
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
