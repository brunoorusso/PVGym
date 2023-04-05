using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PVGym.Models
{
    public class AvailableClass
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public int Limit { get; set; }
        [Required]
        [DisplayName("Duration (min)")]
        public int Duration { get; set; }
        public string Image { get; set; }

    }
}
