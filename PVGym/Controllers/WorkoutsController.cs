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
    public class WorkoutsController : Controller
    {
        private readonly PVGymContext _context;

        public WorkoutsController(PVGymContext context)
        {
            _context = context;
        }

        // GET: Workouts
        public async Task<IActionResult> Index()
        {
              return _context.Workout != null ? 
                          View(await _context.Workout.ToListAsync()) :
                          Problem("Entity set 'PVGymContext.Workout'  is null.");
        }

        // GET: Workouts/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null || _context.Workout == null)
            {
                return NotFound();
            }

            var workout = await _context.Workout
                .FirstOrDefaultAsync(m => m.WorkoutId == id);
            if (workout == null)
            {
                return NotFound();
            }

            return View(workout);
        }

        // GET: Workouts/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Workouts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("WorkoutId,Name")] Workout workout)
        {
            if (ModelState.IsValid)
            {
                workout.WorkoutId = Guid.NewGuid();
                _context.Add(workout);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(workout);
        }

        // GET: Workouts/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null || _context.Workout == null)
            {
                return NotFound();
            }

            var workout = await _context.Workout.FindAsync(id);
            if (workout == null)
            {
                return NotFound();
            }
            return View(workout);
        }

        // POST: Workouts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("WorkoutId,Name")] Workout workout)
        {
            if (id != workout.WorkoutId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(workout);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!WorkoutExists(workout.WorkoutId))
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
            return View(workout);
        }

        // GET: Workouts/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null || _context.Workout == null)
            {
                return NotFound();
            }

            var workout = await _context.Workout
                .FirstOrDefaultAsync(m => m.WorkoutId == id);
            if (workout == null)
            {
                return NotFound();
            }

            return View(workout);
        }

        // POST: Workouts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            if (_context.Workout == null)
            {
                return Problem("Entity set 'PVGymContext.Workout'  is null.");
            }
            var workout = await _context.Workout.FindAsync(id);
            if (workout != null)
            {
                _context.Workout.Remove(workout);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool WorkoutExists(Guid id)
        {
          return (_context.Workout?.Any(e => e.WorkoutId == id)).GetValueOrDefault();
        }
    }
}
