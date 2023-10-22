using Actuarial.Domain.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Repo.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : BaseDomain
    {
        Task AddAsync(TEntity entity);

        Task AddRangeAsync(IEnumerable<TEntity> entities);

        Task UpdateAsync(TEntity entity);

        void UpdateRange(IEnumerable<TEntity> entities);

        void Update(TEntity entity);

        Task DeleteAsync(TEntity entity);

        Task<TEntity> GetByIdAsync(object id);

        Task<long> CountAsync(Expression<Func<TEntity, bool>> filter = null);

        Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> filter = null, params string[] includes);

        Task<IEnumerable<TEntity>> GetAllAsync();


        Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> filter = null, string orderBy = null,
            params string[] includes);

        Task<IEnumerable<TEntity>> GetAllAsync(int skip, int size, Expression<Func<TEntity, bool>> filter = null,
            string orderBy = null, params string[] includes);
        Task<IEnumerable<TEntity>> GetAllDescAsync(Expression<Func<TEntity, bool>> filter = null, Expression<Func<TEntity, bool>> filter2 = null, string orderBy = null, bool Desc = false,
     params string[] includes);
        Task<IEnumerable<TEntity>> GetAllDescPaginationAsync<TOrderBy>(int skip, int size,
     Expression<Func<TEntity, bool>> filter = null, Expression<Func<TEntity, TOrderBy>> filter2 = null, bool Desc = false, string order = null, params string[] includes);
        Task<IEnumerable<TEntity>> GetAllDescAsync(int skip, int size, Expression<Func<TEntity, bool>> filter = null, Expression<Func<TEntity, bool>> filter2 = null,
            string orderBy = null, bool Desc = false, params string[] includes);


        
    }
}
