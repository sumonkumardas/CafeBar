using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities.Configuration;
using MySql.Data.Entity;

namespace CafeBar.Entities.DBEntities
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class CafeBarContext : DbContext
    {
        public CafeBarContext()
            : base()
        {
            Database.SetInitializer<CafeBarContext>(null);
        }

        public CafeBarContext(DbConnection existingConnection, bool contextOwnsConnection)
      : base(existingConnection, contextOwnsConnection)
    {

        }
        #region Entity Sets
        public DbSet<User> UserSet { get; set; }
        public DbSet<Role> RoleSet { get; set; }
        public DbSet<UserRole> UserRoleSet { get; set; }
        public DbSet<Customer> CustomerSet { get; set; }
        public DbSet<Product> ProductSet { get; set; }
        public DbSet<Order> OrderSet { get; set; }
        public DbSet<OrderDetail> OrderDetailSet { get; set; }
        public DbSet<Category> CategorySet { get; set; }
        #endregion

        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new UserConfiguration());
            modelBuilder.Configurations.Add(new UserRoleConfiguration());
            modelBuilder.Configurations.Add(new RoleConfiguration());
            modelBuilder.Configurations.Add(new CustomerConfiguration());
            modelBuilder.Configurations.Add(new OrderConfiguration());
            modelBuilder.Configurations.Add(new OrderDetailConfiguration());
            modelBuilder.Configurations.Add(new ProductConfiguration());
            modelBuilder.Configurations.Add(new CategoryConfiguration());

            modelBuilder.Entity<Role>().MapToStoredProcedures();
            modelBuilder.Entity<User>().MapToStoredProcedures();
            modelBuilder.Entity<UserRole>().MapToStoredProcedures();

            modelBuilder.Entity<Category>().MapToStoredProcedures();
            modelBuilder.Entity<Customer>().MapToStoredProcedures();
            modelBuilder.Entity<Product>().MapToStoredProcedures();

            modelBuilder.Entity<Order>().MapToStoredProcedures();
            modelBuilder.Entity<OrderDetail>().MapToStoredProcedures();
        }
    }
}
