using System;

namespace CarListingAPI.Models
{
    public class CarListing
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Type { get; set; } // sedan, suv, sport, hatchback, van
        public decimal Price { get; set; }
        public int Kilometers { get; set; }
        public string FuelType { get; set; } // Benzin, Dizel, Hibrit, Elektrik
        public string Transmission { get; set; } // Otomatik, Manuel
        public int Power { get; set; } // Motor gücü BG
        public string Location { get; set; } // Şehir
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation property
        public User User { get; set; }
    }
}
