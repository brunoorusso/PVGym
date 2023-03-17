using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PVGym.Models
{
    public class Workout    
    {
        [Required]
        public Guid WorkoutId { get; set; }
        [Required]
        [Display(Name = "Workout Name")]
        public string Name { get; set; }
        public List<Plan>? Plans { get; set; }
        public List<Exercise>? Exercises { get; set; }
    }
}
