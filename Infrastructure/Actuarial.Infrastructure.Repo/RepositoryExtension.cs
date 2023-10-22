using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Repo
{
    public static class RepositoryExtension
    {
        public static IOrderedQueryable<TSource> OrderBy<TSource>(
            this IQueryable<TSource> query, string PropertyName)
        {
            var entityType = typeof(TSource);

            //Create x=>x.SlotDojo.APIName
            var PropertyInfo = entityType.GetProperty(PropertyName);
            if (PropertyInfo == null)
                return null;
            var arg = Expression.Parameter(entityType, "x");
            var Property = Expression.Property(arg, PropertyName);
            var selector = Expression.Lambda(Property, arg);

            //Get System.Linq.Queryable.OrderBy() method.
            var enumarableType = typeof(Queryable);
            var method = enumarableType.GetMethods()
                .Where(m => m.Name == "OrderBy" && m.IsGenericMethodDefinition)
                .Where(m =>
                {
                    var parameters = m.GetParameters().ToList();
                    //Put more restriction here to ensure selecting the right overload                
                    return parameters.Count == 2; //overload that has 2 parameters
                }).Single();
            //The linq's OrderBy<TSource, TKey> has two generic types, which provided here
            var genericMethod = method
                .MakeGenericMethod(entityType, PropertyInfo.PropertyType);

            /*Call query.OrderBy(selector), with query and selector: x=> x.SlotDojo.APIName
              Note that we pass the selector as Expression to the method and we don't compile it.
              By doing so EF can extract "order by" columns and generate SQL for it.*/
            var newQuery = (IOrderedQueryable<TSource>)genericMethod
                .Invoke(genericMethod, new object[] { query, selector });
            return newQuery;
        }
    }
}
