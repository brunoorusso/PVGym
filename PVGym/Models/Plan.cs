namespace PVGym.Models
{
    public class Plan
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public List<Workout> Workouts { get; set; }
    }
}
