using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace PVGym.Models
{
    public enum Plantype
    {
        [Display(Name = "Normal Plan")]
        Normal = 0,

        [Display(Name = "Premium Plan")]
        Premium = 1
    }
}
