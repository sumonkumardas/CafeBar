using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities.DBEntities;

namespace CafeBar.Entities.Configuration
{
    public class ProductConfiguration : EntityBaseConfiguration<Product>
    {
        public ProductConfiguration()
        {
            Property(m => m.Title).IsRequired().HasMaxLength(100);
            
            Property(m => m.Rating).IsRequired();
            Property(m => m.Description).IsRequired().HasMaxLength(2000);
        }
    }
}

