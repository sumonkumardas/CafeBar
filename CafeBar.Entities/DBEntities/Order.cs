using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities;

namespace CafeBar.Entities.DBEntities
{
    public class Order : IEntityBase
    {
        public Order()
        {
            OrderDetails = new List<OrderDetail>();
        }
        public int ID { get; set; }
        public int? CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime OrderDelivered { get; set; }
        public int OrderTakenBy { get; set; }
        public bool IsCanceled { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
