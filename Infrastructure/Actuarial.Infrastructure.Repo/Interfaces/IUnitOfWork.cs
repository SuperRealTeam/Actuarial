
using Actuarial.Domain.Base;


namespace Actuarial.Infrastructure.Repo.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<T> GetRepository<T>() where T : BaseDomain;

      
        Task CommitAsync(string Userid = null);
    }
}
