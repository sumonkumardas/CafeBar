using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities.DBEntities;

namespace CafeBar.Entities.Configuration
{
    public class CategoryConfiguration : EntityBaseConfiguration<Category>
    {
        public CategoryConfiguration()
        {
            Property(g => g.Name).IsRequired().HasMaxLength(50);
        }
    }
}
