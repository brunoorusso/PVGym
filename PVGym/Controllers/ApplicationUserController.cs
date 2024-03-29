﻿/*
 * Author: Bruno Russo
 * Description: This controller is responsible for the user endpoints.
 */
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using PVGym.Areas.Identity.Data;
using PVGym.Data;
using PVGym.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace PVGym.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;
        private readonly PVGymContext _context;
        private readonly IConfiguration _config;



        public ApplicationUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, PVGymContext context, IConfiguration config, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _config = config;
            _passwordHasher = passwordHasher;
        }

        /*
         * This method is responsible for authenticate a user.
         * It also retrieve a token to the user.
         */ 
        [HttpPost]
        [Route("Login")]
        //POST: /api/ApplicationUser/Login
        public async Task<ActionResult> Login(LoginViewModel model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("Login request inválido.");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if(user == null)
            {
                return BadRequest("Conta não existente com este email.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                return BadRequest("Login request inválido.");
            }

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]));

            var tokenOptions = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new { Token = tokenString });

        }

        /*
         * This method is responsible for registering a new user.
         */ 
        [HttpPost]
        [Route("Register")]
        //POST: /api/ApplicationUser/Register
        public async Task<ActionResult> PostApplicationUser(ApplicationUserModel model)
        {
            var applicationUser = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                EmailConfirmed = true
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(applicationUser.UserName);
                    return Ok(new { Id = user.Id });
                }
                return BadRequest(result.Errors);
            }
            catch (Exception ex){
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("GetUserByEmail/{email}")]
        public async Task<ActionResult<ApplicationUser>> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                return user;
            }

            return NotFound();
        }

        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<ApplicationUser>> GetUser(Guid? id)
        {
            if (id == null || _context.Users == null)
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpGet]
        [Route("GetAllUsers")]
        //GET: /api/ApplicationUser/GetAllUsers
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = users.Select(u => new { Id = u.Id, UserName = u.UserName, Email = u.Email });
            return Ok(result);
        }

        /*
         *  This method is responsible for updating user.
         *  Receive the user email, look for the user in the database and update the user.
         */ 
        [HttpPut]
        [Route("UpdateUser/{email}")]
        //PUT: /api/ApplicationUser/UpdateUser
        public async Task<ActionResult> UpdateUser(string email, ApplicationUserModel model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    user.UserName = model.UserName;
                    user.Email = model.Email;
                    var newPassword = _userManager.PasswordHasher.HashPassword(user, model.Password);
                    user.PasswordHash = newPassword;
                    var result = await _userManager.UpdateAsync(user);
                    if (result.Succeeded)
                    {
                        return Ok();
                    }
                    return BadRequest(result.Errors);
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
