
using Actuarial.Domain.Base;
using Actuarial.Infrastructure.Repo.Data;
using Actuarial.Infrastructure.Repo.Interfaces;

using System.Collections.Concurrent;


namespace Actuarial.Infrastructure.Repo.Classes
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private readonly ConcurrentDictionary<Type, object> _repositoriesDic = new();

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<T> GetRepository<T>() where T : BaseDomain
        {
            _repositoriesDic.TryGetValue(typeof(T), out var repo);
            if (repo == null)
            {
                repo = new GenericRepository<T>(_context);
                _repositoriesDic.TryAdd(typeof(T), repo);
            }

            return (IGenericRepository<T>)repo;
        }
      
        public Task CommitAsync(string Userid = null)
        {
            return _context.CommitAsync(Userid);
        }
    }
}
