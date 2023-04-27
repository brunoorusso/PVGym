/**
 * Exercise Model
 * Author: Ismael Lourenço
 */
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PVGym.Models
{
    public class Exercise
    {
        [Required]
        public Guid ExerciseId { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public string target { get; set; }
        public string gifUrl { get; set; }
        public string bodyPart { get; set; }
        public string equipment { get; set; }
        [JsonIgnore]
        public List<Workout>? Workouts { get; set; }
    }
}
