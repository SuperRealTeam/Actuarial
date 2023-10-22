namespace Actuarial.Domain.DataContracts;

/// <summary>
/// 
/// </summary>
/// <typeparam name="TId"></typeparam>
public interface IEntity<TId> : IEntity
{
    public TId Id { get; set; }
}
/// <summary>
/// 
/// </summary>
public interface IEntity
{
}