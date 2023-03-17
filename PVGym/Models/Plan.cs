using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PVGym.Models
{
    public class Plan
    {
        [Required]
        public Guid PlanId { get; set; }
        [Required]
        [Display(Name = "Plan Name")]
        public string Name { get; set; }
        public List<Member>? Member { get; set; }
        public List<Workout>? Workouts { get; set; }
    }
}
