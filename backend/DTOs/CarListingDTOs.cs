namespace CarListingAPI.DTOs
{
    public class CreateCarListingRequest
    {
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Type { get; set; }
        public decimal Price { get; set; }
        public int Kilometers { get; set; }
        public string FuelType { get; set; }
        public string Transmission { get; set; }
        public int Power { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }

    public class UpdateCarListingRequest
    {
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Type { get; set; }
        public decimal Price { get; set; }
        public int Kilometers { get; set; }
        public string FuelType { get; set; }
        public string Transmission { get; set; }
        public int Power { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }

    public class CarListingResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Type { get; set; }
        public decimal Price { get; set; }
        public int Kilometers { get; set; }
        public string FuelType { get; set; }
        public string Transmission { get; set; }
        public int Power { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public System.DateTime CreatedAt { get; set; }
    }
}
