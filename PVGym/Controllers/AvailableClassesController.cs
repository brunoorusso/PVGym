using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;

namespace PVGym.Controllers
{
    public class AvailableClassesController : Controller
    {
        private readonly PVGymContext _context;

        public AvailableClassesController(PVGymContext context)
        {
            _context = context;
        }

        // GET: AvailableClasses
        public async Task<IActionResult> Index()
        {
              return _context.AvailableClass != null ? 
                          View(await _context.AvailableClass.ToListAsync()) :
                          Problem("Entity set 'PVGymContext.AvailableClass'  is null.");
        }

        // GET: AvailableClasses/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null || _context.AvailableClass == null)
            {
                return NotFound();
            }

            var availableClass = await _context.AvailableClass
                .FirstOrDefaultAsync(m => m.Id == id);
            if (availableClass == null)
            {
                return NotFound();
            }

            return View(availableClass);
        }

        // GET: AvailableClasses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: AvailableClasses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Description,Limit,Duration")] AvailableClass availableClass)
        {
            if (ModelState.IsValid)
            {
                availableClass.Id = Guid.NewGuid();
                _context.Add(availableClass);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(availableClass);
        }

        // GET: AvailableClasses/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null || _context.AvailableClass == null)
            {
                return NotFound();
            }

            var availableClass = await _context.AvailableClass.FindAsync(id);
            if (availableClass == null)
            {
                return NotFound();
            }
            return View(availableClass);
        }

        // POST: AvailableClasses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,Name,Description,Limit,Duration")] AvailableClass availableClass)
        {
            if (id != availableClass.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(availableClass);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AvailableClassExists(availableClass.Id))
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
            return View(availableClass);
        }

        // GET: AvailableClasses/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null || _context.AvailableClass == null)
            {
                return NotFound();
            }

            var availableClass = await _context.AvailableClass
                .FirstOrDefaultAsync(m => m.Id == id);
            if (availableClass == null)
            {
                return NotFound();
            }

            return View(availableClass);
        }

        // POST: AvailableClasses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            if (_context.AvailableClass == null)
            {
                return Problem("Entity set 'PVGymContext.AvailableClass'  is null.");
            }
            var availableClass = await _context.AvailableClass.FindAsync(id);
            if (availableClass != null)
            {
                _context.AvailableClass.Remove(availableClass);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AvailableClassExists(Guid id)
        {
          return (_context.AvailableClass?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
