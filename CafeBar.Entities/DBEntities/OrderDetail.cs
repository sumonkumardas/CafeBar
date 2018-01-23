using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities;

namespace CafeBar.Entities.DBEntities
{
    public class OrderDetail : IEntityBase
    {
        public int ID { get; set; }
        public Decimal TotalPrice { get; set; }
        public Decimal DiscountedPrice { get; set; }
        public int OrderId { get; set; }
        public bool IsAvailable { get; set; }
        public virtual Product Product { get; set; }
        public virtual Order Order { get; set; }
    }
}
