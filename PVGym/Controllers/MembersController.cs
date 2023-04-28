using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PVGym.Areas.Identity.Data;
using PVGym.Data;
using PVGym.Models;

namespace PVGym.Controllers
{
    public class MembersController : Controller
    {
        private readonly PVGymContext _context;

        public MembersController(PVGymContext context)
        {
            _context = context;
        }

        // GET: Members
        
        public async Task<IActionResult> Index()
        {
            var members = _context.Member.Include(m => m.Plan);
            return View(await members.ToListAsync());
        }

        // GET: Members/Details/5
        
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null || _context.Member == null)
            {
                return NotFound();
            }

            var member = await _context.Member.Include(m => m.Plan)
                .FirstOrDefaultAsync(m => m.MemberId == id);
            if (member == null)
            {
                return NotFound();
            }

            return View(member);
        }

        // GET: Members/Create
        
        public IActionResult Create()
        {
            PopulateViewData();
            return View();
        }

        // POST: Members/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        
        public async Task<IActionResult> Create([Bind("MemberId,VAT,PlanType")] Member member)
        {
            if (ModelState.IsValid)
            {
                member.MemberId = Guid.NewGuid();
                _context.Add(member);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            PopulateViewData();
            return View(member);
        }

        // GET: Members/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null || _context.Member == null)
            {
                return NotFound();
            }

            var member = await _context.Member.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }
            PopulateViewData();
            return View(member);
        }

        // POST: Members/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        
        public async Task<IActionResult> Edit(Guid id, [Bind("MemberId,VAT,PlanType")] Member member)
        {
            if (id != member.MemberId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(member);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MemberExists(member.MemberId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            PopulateViewData();
            return View(member);
        }

        // GET: Members/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null || _context.Member == null)
            {
                return NotFound();
            }

            var member = await _context.Member.Include(m => m.Plan)
                .FirstOrDefaultAsync(m => m.MemberId == id);
            if (member == null)
            {
                return NotFound();
            }

            return View(member);
        }

        // POST: Members/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            if (_context.Member == null)
            {
                return Problem("Entity set 'PVGymContext.Member'  is null.");
            }
            var member = await _context.Member.FindAsync(id);
            if (member != null)
            {
                _context.Member.Remove(member);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MemberExists(Guid id)
        {
          return (_context.Member?.Any(e => e.MemberId == id)).GetValueOrDefault();
        }

        private void PopulateViewData()
        {
            ViewData["PlanType"] = new SelectList(Enum.GetValues<Plantype>().Select(c => new { Value = (int)c, Name = c.ToString() }), "Value", "Name");
            ViewData["PlanList"] = new SelectList(_context.Plan, "PlanId", "Name");
        }

       
    }
}
