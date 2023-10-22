namespace Actuarial.Domain.DataContracts;

/// <summary>
/// 
/// </summary>
/// <typeparam name="TExtendedAttribute"></typeparam>
public interface IEntityWithExtendedAttributes<TExtendedAttribute>
{
    /// <summary>
    /// 
    /// </summary>
    public ICollection<TExtendedAttribute> ExtendedAttributes { get; set; }
}