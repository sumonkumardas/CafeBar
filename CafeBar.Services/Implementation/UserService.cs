using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Data.Contact;
using CafeBar.Data.Implementation;
using CafeBar.Entities.DBEntities;
using CafeBar.Entities.Viewmodels;
using CafeBar.Services.Contact;

namespace CafeBar.Services.Implementation
{
    public class UserService : IUserservice
    {
        private IUserRepository _repository;

        public UserService()
        {
            _repository = new UserRepository();
        }
        public User CheckLogin(LogInModel model)
        {
            return _repository.CheckLogin(model);
        }

        public bool SetSuperAdmin()
        {
            return _repository.SetSuperAdmin();
        }
    }
}
