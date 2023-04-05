namespace PVGym.Models
{
    public class Class
    {
        public int Id { get; set; }
        public int AvailableClassId { get; set; }
        public int CoachId { get; set; }
        public DateTime StartDate {get; set; }
        public List<Member>? Members { get; set; }

    }
}
