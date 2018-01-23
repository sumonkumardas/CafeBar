using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities;

namespace CafeBar.Entities.DBEntities
{
    public class Product : IEntityBase
    {
        public Product()
        {
            //Stocks = new List<Stock>();
        }
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public virtual Category Category { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal DiscountPrice { get; set; }
        public double Rating { get; set; }
    }
}
