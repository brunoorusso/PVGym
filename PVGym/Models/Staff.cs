using System.ComponentModel.DataAnnotations;

namespace PVGym.Models
{
    public class Staff
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Specialization { get; set; }
        [Required]
        public bool IsAdmin { get; set; }
    }
}
