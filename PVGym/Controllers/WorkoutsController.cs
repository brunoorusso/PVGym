using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
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
            var workouts = _context.Workout.Include(w => w.Exercises);
            return View(await workouts.ToListAsync());
        }

        // GET: Workouts/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null || _context.Workout == null)
            {
                return NotFound();
            }

            var workout = await _context.Workout
                .Include(w => w.Exercises)
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
            ViewData["Exercises"] = new SelectList(_context.Exercise, "ExerciseId", "Name");
            return View();
        }

        // POST: Workouts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("WorkoutId,Name")] Workout workout, List<Guid> Exercises)
        {
            if (ModelState.IsValid)
            {
                workout.WorkoutId = Guid.NewGuid();

                if (Exercises != null && Exercises.Count > 0)
                {
                    workout.Exercises = new List<Exercise>();

                    foreach (var exerciseId in Exercises)
                    {
                        var exercise = await _context.Exercise.FindAsync(exerciseId);
                        if (exercise != null)
                        {
                            workout.Exercises.Add(exercise);
                        }
                    }
                }

                _context.Add(workout);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(workout);
        }

        // GET: Workouts/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var workout = await _context.Workout.Include(w => w.Exercises).FirstOrDefaultAsync(w => w.WorkoutId == id);
            if (workout == null)
            {
                return NotFound();
            }

            IEnumerable<Guid> selected = workout.Exercises.Select(pw => pw.ExerciseId);

            ViewData["Exercises"] = new SelectList(_context.Exercise, "ExerciseId", "Name", selected);
            return View(workout);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("WorkoutId,Name")] Workout workout, IEnumerable<Guid> Exercises)
        {

            if (id != workout.WorkoutId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingWorkout = await _context.Workout.Include(w => w.Exercises)
                        .FirstOrDefaultAsync(w => w.WorkoutId == id);

                    if (existingWorkout == null)
                    {
                        return NotFound();
                    }

                    existingWorkout.Name = workout.Name;

                    if (Exercises != null)
                    {
                        var updatedExercises = new List<Exercise>();
                        foreach (var exercisesId in Exercises)
                        {
                            var exercise = await _context.Exercise.FindAsync(exercisesId);
                            if (exercise != null)
                            {
                                updatedExercises.Add(exercise);
                            }
                        }
                        existingWorkout.Exercises = updatedExercises;

                        Console.WriteLine($"Number of selected exercises: {Exercises.Count()}");
                        Console.WriteLine($"Number of updated exercises: {updatedExercises.Count()}");
                        foreach (var e in updatedExercises)
                        {
                            Console.WriteLine($"Updated exercise: {e.Name}");
                        }

                    }

                    _context.Update(existingWorkout);
                    await _context.SaveChangesAsync();



                    Console.WriteLine("Changes saved to database:");
                    Console.WriteLine(existingWorkout);

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

            ViewData["Exercises"] = new MultiSelectList(await _context.Exercise.ToListAsync(), "ExerciseId", "Name", Exercises);
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
                .Include(w => w.Exercises)
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
