using Actuarial.Domain.Base;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Data;
using Actuarial.Infrastructure.Repo.Interfaces;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Actuarial.Infrastructure.Repo.Classes
{
    /// <summary>
    /// The generic repository.
    /// </summary>
    /// <typeparam name="TEntity">
    /// </typeparam>
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseDomain
    {
        private readonly ApplicationDbContext _dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="GenericRepository{TEntity}"/> class.
        /// </summary>
        /// <param name="dbContext">
        /// The db context.
        /// </param>
        public GenericRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public Task AddAsync(TEntity entity)
        {
            entity.InternalCreationDateTimeUtc = DateTime.UtcNow;
            entity.InternalModificationDateTimeUtc = DateTime.UtcNow;
            entity.InternalValidation = true;
            entity.InternalApplicationName = "ActuarialApp";
            return _dbContext.Set<TEntity>().AddAsync(entity).AsTask();
        }

        public Task AddRangeAsync(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                entity.InternalCreationDateTimeUtc = DateTime.UtcNow;
                entity.InternalModificationDateTimeUtc = DateTime.UtcNow;
                entity.InternalValidation = true;
            }

            return _dbContext.Set<TEntity>().AddRangeAsync(entities);
        }

        public Task UpdateAsync(TEntity entity)
        {
            entity.InternalModificationDateTimeUtc = DateTime.UtcNow;

            if (_dbContext.Entry(entity).State == EntityState.Detached)
                AddAsync(entity);

            _dbContext.Entry(entity).State = EntityState.Modified;

            return Task.FromResult(entity);
        }

        public void UpdateRange(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                entity.InternalModificationDateTimeUtc = DateTime.UtcNow;
            }

            _dbContext.Set<TEntity>().UpdateRange(entities);
        }

        public void Update(TEntity entity)
        {
            _dbContext.Set<TEntity>().Update(entity);
        }

        public Task DeleteAsync(TEntity entity)
        {
            if (_dbContext.Entry(entity).State == EntityState.Detached) AddAsync(entity);

            _dbContext.Entry(entity).State = EntityState.Deleted;
            _dbContext.Set<TEntity>().Remove(entity);

            return Task.FromResult(entity);
        }

        public async Task<TEntity> GetByIdAsync(object id)
        {
            return await _dbContext.Set<TEntity>().FindAsync(id).ConfigureAwait(false);
        }

        public async Task<long> CountAsync(Expression<Func<TEntity, bool>> filter = null)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }
            return await query.LongCountAsync().ConfigureAwait(false);
        }

        public async Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> filter = null,
            params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            foreach (var include in includes)
                query = query.Include(include);

            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }
            return await query.SingleOrDefaultAsync().ConfigureAwait(false);
        }


        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _dbContext.Set<TEntity>().AsNoTracking().Where(p => p.InternalIsDelete != true).ToListAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> filter = null,
            string orderBy = null, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }

            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }
            if (orderBy != null)
                query.OrderBy(orderBy);

            return await query.ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(int skip, int size,
            Expression<Func<TEntity, bool>> filter = null, string orderBy = null, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }


            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }
            if (!string.IsNullOrEmpty(orderBy))
                query.OrderBy(orderBy);

            query = query.Skip(skip).Take(size);

            return await query.ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<TEntity>> GetAllDescPaginationAsync<TOrderBy>(int skip, int size,
         Expression<Func<TEntity, bool>> filter = null, Expression<Func<TEntity, TOrderBy>> filter2 = null, bool Desc = false, string order = null, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }

            query = query.Where(p => p.InternalIsDelete != true);

            if (filter != null)
            {
                query = query.Where(filter);
            }





            query = query.Skip(skip).Take(size);

            return await query.ToArrayAsync().ConfigureAwait(false);
        }


        public async Task<IEnumerable<TResult>> GetAllAsyncBygrouping<TKey, TResult>(Expression<Func<TEntity, TKey>> groupingKey,
            Expression<Func<IGrouping<TKey, TEntity>, TResult>> resultSelector, Expression<Func<TEntity, bool>> filter = null,
            string orderBy = null, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }

            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }
            if (orderBy != null)
                query.OrderBy(orderBy);

            return query.GroupBy(groupingKey).Select(resultSelector);

        }
        public async Task<IEnumerable<TEntity>> GetAllDoubleFilterAsync(Expression<Func<TEntity, bool>> filter = null, Expression<Func<TEntity, bool>> filter2 = null,
            string orderBy = null, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }

            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }
            if (filter2 != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter2);
            }
            if (orderBy != null)
                query.OrderBy(orderBy);

            return await query.ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<TEntity>> GetAllDescAsync(int skip, int size,
            Expression<Func<TEntity, bool>> filter = null, Expression<Func<TEntity, bool>> filter2 = null, string orderBy = null, bool Desc = false, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }


            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }


            if (Desc == true)
            {
                if (filter2 != null)
                    query.OrderByDescending(filter2);

            }
            else
            {
                if (!string.IsNullOrEmpty(orderBy))

                    query.OrderBy(orderBy);
            }

            query = query.Skip(skip).Take(size);

            return await query.ToArrayAsync().ConfigureAwait(false);
        }
        public async Task<IEnumerable<TEntity>> GetAllDescAsync(Expression<Func<TEntity, bool>> filter = null,
        Expression<Func<TEntity, bool>> filter2 = null, string orderBy = null, bool Desc = false, params string[] includes)
        {
            var query = _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                    query = query.Include(include);
            }

            if (filter != null)
            {
                query = query.Where(p => p.InternalIsDelete != true);
                query = query.Where(filter);
            }

            if (Desc == true)
            {
                if (filter2 != null)
                    query.OrderByDescending(filter2);

            }
            else
            {
                if (!string.IsNullOrEmpty(orderBy))

                    query.OrderBy(orderBy);
            }

            return await query.ToArrayAsync().ConfigureAwait(false);
        }

       

      
      

      

    
    }
}
