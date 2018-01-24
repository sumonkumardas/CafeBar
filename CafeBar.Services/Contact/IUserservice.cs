using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CafeBar.Entities.DBEntities;
using CafeBar.Entities.Viewmodels;

namespace CafeBar.Services.Contact
{
    public interface IUserservice
    {
        User CheckLogin(LogInModel model);

        bool SetSuperAdmin();
    }
}
