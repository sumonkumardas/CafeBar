using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities;

namespace CafeBar.Entities.DBEntities
{
    public class Role : IEntityBase
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
}
