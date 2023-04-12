using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PVGym.Models
{
    public class Plan
    {
        [Required]
        public Guid PlanId { get; set; }
        [Required]
        [Display(Name = "Plan Name")]
        public string Name { get; set; }
        [JsonIgnore]
        public List<Member>? Member { get; set; }
        public List<Workout>? Workouts { get; set; }

        public override string? ToString()
        {
            return PlanId + " -> " + Name;
        }
    }
}
