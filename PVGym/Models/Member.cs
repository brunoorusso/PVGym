using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace PVGym.Models
{
    public class Member
    {
        [Required]
        public Guid MemberId { get; set; }
        [Required]
        [RegularExpression(@"^[1-9]\d{8}$", ErrorMessage = "Please enter a valid VAT number.")]
        public int VAT { get; set; }
        [Required]
        [EnumDataType(typeof(Plantype))]
        public Plantype PlanType { get; set; }
        public List<Plan>? Plans { get; set; }
        public List<Evaluation>? Evaluations { get; set; }
    }
}



