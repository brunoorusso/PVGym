namespace PVGym.Models
{
    public class Member
    {
        public int Id { get; set; }
        public int VAT { get; set; }
        public string PlanType { get; set; }    
        public List<Plan> Plans { get; set; }
        public List<Evaluation> Evaluations { get; set; }
    }
}
