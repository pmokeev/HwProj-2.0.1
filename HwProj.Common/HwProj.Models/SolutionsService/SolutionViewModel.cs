using System.ComponentModel.DataAnnotations;
using System;

namespace HwProj.Models.SolutionsService
{
    public class SolutionViewModel
    {
        [Required]
        [RegularExpression(@"^\S+.*", ErrorMessage = "Name shouldn't start with white spaces.")]
        public string GithubUrl { get; set; }
        
        public string Comment { get; set; }
        
        public string StudentId { get; set; }

        public DateTime PublicationDate { get; set; }

        public string LecturerComment { get; set; }
    }
}
