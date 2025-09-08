using ASP.NET.HouseBrokerAPP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP.NET.HouseBrokerAPP.IServices
{
    public interface IPropertyService
    {
        Task<object> GetCreateData();
        Task<object> Get();
        Task<IEnumerable<object>> GetAvailablePropertyList();
        Task<Property> GetById(Guid id);
        Task<Property> Create(Property entity);
        Task<Property> Edit(Property entity);
    }
}
