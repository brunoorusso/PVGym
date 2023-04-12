using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PVGym.Models
{
    public class Class
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public Guid AvailableClassId { get; set; }
        [Required]
        public string Coach { get; set; }
        [Required]
        public DateTime StartDate {get; set; }
        [Required]
        public List<Member> Members { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int Duration { get; set; }
        [Required]
        public string Image { get; set; }

    }
}
