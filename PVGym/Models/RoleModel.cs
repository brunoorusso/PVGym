using System.ComponentModel.DataAnnotations;

namespace PVGym.Models
{
    public class RoleModel
    {
        public int Id { get; set; }
        [Required]
        public string RoleName { get; set; }
    }
}
