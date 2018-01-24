using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using CafeBar.Entities.Viewmodels;
using CafeBar.Services.Contact;
using CafeBar.Services.Implementation;
using CafeBar.Web.Models;
using System.Web.Security;
using System.Security.Principal;
using CafeBar.Web.Extension;

namespace CafeBar.Web.Controllers
{
    public class AccountController :Controller
    {
        private IUserservice _userService;
        public AccountController()
        {
            _userService = new UserService();
            _userService.SetSuperAdmin();
        }

        [System.Web.Mvc.HttpGet]
        [System.Web.Mvc.AllowAnonymous]
        public ActionResult LogIn()
        {
            
            return View();
        }

        [System.Web.Mvc.HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        public ActionResult LogIn(LogInModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _userService.CheckLogin(model);
                if (user!=null)
                {
                    Authentication.SetCookie(Request.RequestContext.HttpContext,user, false);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ViewBag.message = "Incorrect Credentials!";
                    return View(model);
                }
            }
            {
                ViewBag.message = "Invalid Login";
                return View(model);
            }

        }


    }
}
