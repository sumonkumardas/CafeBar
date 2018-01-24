using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using CafeBar.Entities;
using CafeBar.Entities.DBEntities;

namespace TesterConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                ExecuteExample();
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);
            }
            Console.Read();
        }

        public static void ExecuteExample()
        {
            string connectionString = "Server=localhost;Port=3306;Database=cafebar;user id=root;password=1234;";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                //Create database if not exists
                using (CafeBarContext contextDB = new CafeBarContext(connection, false))
                {
                    contextDB.Database.CreateIfNotExists();
                }
                //connection.ConnectionString += ";password=1234;";
                connection.Open();
                MySqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    //DbConnection that is already opened
                    using (CafeBarContext context = new CafeBarContext(connection, false))
                    {

                        //Interception / SQL logging
                        context.Database.Log = (string message) => { Console.WriteLine(message); };

                        //Passing an existing transaction to the context
                        context.Database.UseTransaction(transaction);

                        //DbSet.AddRange
                        // List<Category> cars = new List<Category>();

                        //cars.Add(new Category { Name = "Nissan2" });
                       
                       // Console.WriteLine(context.Database.ExecuteSqlCommand(TransactionalBehavior.EnsureTransaction, "select * from categories"));

                       // context.SaveChanges();
                    }

                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}
