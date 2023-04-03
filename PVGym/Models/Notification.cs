using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PVGym.Models
{
    public class Notification
    {
        [Required]
        public Guid Id { get; set; }
        [ForeignKey("Member")]
        [Required]
        public Guid MemberId { get; set; }
        public DateTime NotificationDate { get; set; }
        public string? Content { get; set; }

    }
}
