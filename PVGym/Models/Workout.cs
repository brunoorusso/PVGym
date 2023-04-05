using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PVGym.Models
{
    public class Workout    
    {
        [Required]
        public Guid WorkoutId { get; set; }
        [Required]
        [Display(Name = "Workout Name")]
        public string Name { get; set; }
        [JsonIgnore]
        public List<Plan>? Plans { get; set; }
        public List<Exercise>? Exercises { get; set; }
    }
}
