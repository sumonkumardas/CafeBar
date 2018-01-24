using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Data.Contact;
using CafeBar.Entities.DBEntities;
using CafeBar.Entities.Viewmodels;
using MySql.Data.MySqlClient;

namespace CafeBar.Data.Implementation
{
    public class UserRepository: IUserRepository
    {
        private string _connectionString { get; set; }
    
        public UserRepository()
        {
            _connectionString = "Server=localhost;Port=3307;Database=cafebar;user id=root;password=1234;";
        }
        public User CheckLogin(LogInModel model)
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                using (CafeBarContext contextDB = new CafeBarContext(connection, false))
                {
                    contextDB.Database.CreateIfNotExists();
                }
                connection.Open();
                MySqlTransaction transaction = connection.BeginTransaction();
                User user = null;
                try
                {
                    //DbConnection that is already opened
                    using (CafeBarContext context = new CafeBarContext(connection, false))
                    {

                        //Interception / SQL logging
                        context.Database.Log = (string message) => { Console.WriteLine(message); };

                        //Passing an existing transaction to the context
                        context.Database.UseTransaction(transaction);



                        user = context.UserSet.FirstOrDefault(x => x.Email == model.Email && x.HashedPassword == model.Password);

                        // context.SaveChanges();
                    }

                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    
                }

                return user;
            }
        }

        public bool SetSuperAdmin()
        {

            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                MySqlTransaction transaction = connection.BeginTransaction();
                User user = null;
                try
                {
                    using (CafeBarContext contextDB = new CafeBarContext(connection, false))
                    {
                        contextDB.Database.CreateIfNotExists();
                    }
                    //DbConnection that is already opened
                    using (CafeBarContext context = new CafeBarContext(connection, false))
                    {

                        //Interception / SQL logging
                        context.Database.Log = (string message) => { Console.WriteLine(message); };
                        
                        //Passing an existing transaction to the context
                        context.Database.UseTransaction(transaction);
                        if (!context.UserSet.Any(x => x.Username == "admin"))
                        {
                            context.UserSet.Add(new User()
                            {
                                DateCreated = DateTime.Now,
                                IsLocked = false,
                                HashedPassword = "123456",
                                Email = "admin@put.com",
                                Salt = "lobon",
                                Username = "admin"

                            });
                        }

                        context.SaveChanges();
                    }

                    transaction.Commit();
                }
                catch(DbEntityValidationException ex)
                {
                    transaction.Rollback();
                    return false;

                }
                return true;
            }
        }
    }
}
