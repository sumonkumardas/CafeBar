using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Security;
using CafeBar.Entities.DBEntities;
using Newtonsoft.Json;

namespace CafeBar.Web.Extension
{
    public static class Authentication
    {
        //set user cookie to  response using context
        internal static void SetCookie(this HttpContextBase httpContextBase, User appUser, bool rememberMe)
        {
            try
            {
                
                    User userData = new User();
                    userData.ID = appUser.ID;
                    userData.Email = appUser.Email;
                    userData.Username = appUser.Username;

                    string jsonData = JsonConvert.SerializeObject(userData);

                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, appUser.Username, DateTime.Now, DateTime.Now.AddMinutes(5), rememberMe, jsonData);

                    httpContextBase.Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket)));
                    //string[] roles = JsonConvert.DeserializeObject<User>(ticket.UserData).UserRoles.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    //httpContextBase.User = new GenericPrincipal(new FormsIdentity(ticket), roles);
                
            }
            catch (System.Exception exception)
            {
                
            }

        }
    }
}