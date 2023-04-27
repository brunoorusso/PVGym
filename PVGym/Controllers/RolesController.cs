using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PVGym.Models;

namespace PVGym.Controllers
{
    /*
     * Autor: Bruno Russo
     */
    public class RolesController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        public RolesController(RoleManager<IdentityRole> roleManager) 
        {
            this._roleManager = roleManager;
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(RoleModel model)
        {
            if (ModelState.IsValid)
            {
                IdentityRole identityRole = new IdentityRole
                {
                    Name = model.RoleName
                };
             
                IdentityResult result = await _roleManager.CreateAsync(identityRole);
            
                if (result.Succeeded)
                {
                    return RedirectToAction("Index", "Home");
                }

                foreach(IdentityError error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }
            
            return View();

        }
    }
}
