using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PVGym.Models
{
    public class Evaluation
    {
        [Required]
        public Guid Id { get; set; }
        [ForeignKey("Member")]
        [Required]
        public Guid MemberId { get; set; }
        public DateTime EvaluationDate { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        [DisplayName("Body Mass Index")]
        public decimal BMI { get; set; }
        [DisplayName("Body Fat")]
        public decimal BodyFat { get; set; }

    }
}
