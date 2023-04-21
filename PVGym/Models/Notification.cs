using System.ComponentModel.DataAnnotations;

namespace PVGym.Models
{
    public class Notification
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        public DateTime NotificationDate { get; set; }
        public string? Subject { get; set; }
        public string? Content { get; set; }
        public bool? IsRead { get; set; }

    }
}
