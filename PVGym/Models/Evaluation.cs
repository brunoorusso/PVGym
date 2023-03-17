namespace PVGym.Models
{
    public class Evaluation
    {
        public Guid Id { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public decimal BMI { get; set; }
        public decimal BodyFat { get; set; }

    }
}
