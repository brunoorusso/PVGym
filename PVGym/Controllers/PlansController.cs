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
    public class PlansController : Controller
    {
        private readonly PVGymContext _context;

        public PlansController(PVGymContext context)
        {
            _context = context;
        }

        // GET: Plans
        public async Task<IActionResult> Index()
        {
            return _context.Plan != null ?
                View(await _context.Plan.Include(p => p.Workouts).ToListAsync()) :
                Problem("Entity set 'PVGymContext.Plan'  is null.");
        }

        // GET: Plans/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null || _context.Plan == null)
            {
                return NotFound();
            }

            var plan = await _context.Plan.Include(p => p.Workouts)
                .FirstOrDefaultAsync(m => m.PlanId == id);
            if (plan == null)
            {
                return NotFound();
            }

            return View(plan);
        }

        // GET: Plans/Create
        public async Task<IActionResult> Create()
        {
            ViewData["Workouts"] = new SelectList(await _context.Workout.ToListAsync(), "WorkoutId", "Name");
            return View();
        }

        // POST: Plans/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PlanId,Name,Workouts")] Plan plan, IEnumerable<Guid> Workouts)
        {
            if (ModelState.IsValid)
            {
                plan.PlanId = Guid.NewGuid();

                if (Workouts != null)
                {
                    plan.Workouts = new List<Workout>();
                    foreach (var workoutId in Workouts)
                    {
                        var workout = await _context.Workout.FindAsync(workoutId);
                        if (workout != null)
                        {
                            plan.Workouts.Add(workout);
                        }
                    }
                }

                _context.Add(plan);
                await _context.SaveChangesAsync();

                return RedirectToAction(nameof(Index));
            }
            ViewData["Workouts"] = new SelectList(_context.Workout, "WorkoutId", "Name", Workouts);
            return View(plan);
        }



        // GET: Plans/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null || _context.Plan == null)
            {
                return NotFound();
            }

            var plan = await _context.Plan.Include(p => p.Workouts).FirstOrDefaultAsync(p => p.PlanId == id);
            if (plan == null)
            {
                return NotFound();
            }

            List<Workout> works = await _context.Workout.ToListAsync();
            IEnumerable<Guid> selected = plan.Workouts.Select(pw => pw.WorkoutId);

            ViewData["Workouts"] = new SelectList(works, "WorkoutId", "Name", selected);
            
            return View(plan);
        }

        // POST: Plans/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("PlanId,Name,Workouts")] Plan plan, IEnumerable<Guid> Workouts)
        {
            if (id != plan.PlanId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingPlan = await _context.Plan.Include(p => p.Workouts).FirstOrDefaultAsync(p => p.PlanId == id);

                    existingPlan.Name = plan.Name;

                    if (Workouts != null)
                    {
                        var updatedWorkouts = new List<Workout>();
                        foreach (var workoutId in Workouts)
                        {
                            var workout = await _context.Workout.FindAsync(workoutId);
                            if (workout != null)
                            {
                                updatedWorkouts.Add(workout);
                            }
                        }
                        existingPlan.Workouts = updatedWorkouts;
                    }
                    else
                    {
                        existingPlan.Workouts.Clear();
                    }

                    _context.Update(existingPlan);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlanExists(plan.PlanId))
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
            ViewData["Workouts"] = new SelectList(_context.Workout, "WorkoutId", "Name", Workouts);
            return View(plan);
        }



        // GET: Plans/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null || _context.Plan == null)
            {
                return NotFound();
            }

            var plan = await _context.Plan.Include(p => p.Workouts)
                .FirstOrDefaultAsync(m => m.PlanId == id);
            if (plan == null)
            {
                return NotFound();
            }

            return View(plan);
        }

        // POST: Plans/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            if (_context.Plan == null)
            {
                return Problem("Entity set 'PVGymContext.Plan'  is null.");
            }
            var plan = await _context.Plan.FindAsync(id);
            if (plan != null)
            {
                _context.Plan.Remove(plan);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlanExists(Guid id)
        {
          return (_context.Plan?.Any(e => e.PlanId == id)).GetValueOrDefault();
        }
    }
}
