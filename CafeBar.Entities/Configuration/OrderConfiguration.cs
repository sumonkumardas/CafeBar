﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities.DBEntities;

namespace CafeBar.Entities.Configuration
{
    public class OrderConfiguration : EntityBaseConfiguration<Order>
    {
        public OrderConfiguration()
        {
            HasMany(s => s.OrderDetails).WithRequired(r => r.Order).HasForeignKey(r => r.OrderId);
        }
    }
}