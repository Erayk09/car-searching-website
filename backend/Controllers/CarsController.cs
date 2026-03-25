using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using CarListingAPI.Data;
using CarListingAPI.DTOs;
using CarListingAPI.Models;

namespace CarListingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CarsController> _logger;

        public CarsController(ApplicationDbContext context, ILogger<CarsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/cars - Get all active car listings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarListingResponse>>> GetAllCars()
        {
            try
            {
                var cars = await _context.CarListings
                    .Where(c => c.IsActive)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new CarListingResponse
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        Make = c.Make,
                        Model = c.Model,
                        Year = c.Year,
                        Type = c.Type,
                        Price = c.Price,
                        Kilometers = c.Kilometers,
                        FuelType = c.FuelType,
                        Transmission = c.Transmission,
                        Power = c.Power,
                        Location = c.Location,
                        Description = c.Description,
                        ImageUrl = c.ImageUrl,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();

                return Ok(cars);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching cars");
                return StatusCode(500, new { message = "Araçlar yüklenirken hata oluştu." });
            }
        }

        // GET: api/cars/:id - Get single car listing
        [HttpGet("{id}")]
        public async Task<ActionResult<CarListingResponse>> GetCarById(int id)
        {
            try
            {
                var car = await _context.CarListings
                    .Where(c => c.Id == id && c.IsActive)
                    .Select(c => new CarListingResponse
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        Make = c.Make,
                        Model = c.Model,
                        Year = c.Year,
                        Type = c.Type,
                        Price = c.Price,
                        Kilometers = c.Kilometers,
                        FuelType = c.FuelType,
                        Transmission = c.Transmission,
                        Power = c.Power,
                        Location = c.Location,
                        Description = c.Description,
                        ImageUrl = c.ImageUrl,
                        CreatedAt = c.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (car == null)
                    return NotFound(new { message = "Araç bulunamadı." });

                return Ok(car);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching car");
                return StatusCode(500, new { message = "Araç yüklenirken hata oluştu." });
            }
        }

        // POST: api/cars - Create new car listing (NO authentication required)
        [HttpPost]
        public async Task<ActionResult<CarListingResponse>> CreateCar(CreateCarListingRequest request)
        {
            try
            {
                // ✓ Authorization optional - herkes ilan ekleyebilir
                var userId = 0;
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedUserId))
                {
                    userId = parsedUserId;
                }

                var carListing = new CarListing
                {
                    UserId = userId, // 0 giriş yapmayan kullanıcılar için
                    Make = request.Make,
                    Model = request.Model,
                    Year = request.Year,
                    Type = request.Type,
                    Price = request.Price,
                    Kilometers = request.Kilometers,
                    FuelType = request.FuelType,
                    Transmission = request.Transmission,
                    Power = request.Power,
                    Location = request.Location,
                    Description = request.Description,
                    ImageUrl = request.ImageUrl,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.CarListings.Add(carListing);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCarById), new { id = carListing.Id }, new CarListingResponse
                {
                    Id = carListing.Id,
                    UserId = carListing.UserId,
                    Make = carListing.Make,
                    Model = carListing.Model,
                    Year = carListing.Year,
                    Type = carListing.Type,
                    Price = carListing.Price,
                    Kilometers = carListing.Kilometers,
                    FuelType = carListing.FuelType,
                    Transmission = carListing.Transmission,
                    Power = carListing.Power,
                    Location = carListing.Location,
                    Description = carListing.Description,
                    ImageUrl = carListing.ImageUrl,
                    CreatedAt = carListing.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating car");
                return StatusCode(500, new { message = "İlan oluşturulurken hata oluştu." });
            }
        }

        // PUT: api/cars/:id - Update car listing (requires authentication & ownership)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, UpdateCarListingRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var car = await _context.CarListings.FindAsync(id);

                if (car == null)
                    return NotFound(new { message = "Araç bulunamadı." });

                if (car.UserId != userId)
                    return Forbid();

                car.Make = request.Make ?? car.Make;
                car.Model = request.Model ?? car.Model;
                car.Year = request.Year;
                car.Type = request.Type ?? car.Type;
                car.Price = request.Price;
                car.Kilometers = request.Kilometers;
                car.FuelType = request.FuelType ?? car.FuelType;
                car.Transmission = request.Transmission ?? car.Transmission;
                car.Power = request.Power;
                car.Location = request.Location ?? car.Location;
                car.Description = request.Description ?? car.Description;
                car.ImageUrl = request.ImageUrl ?? car.ImageUrl;
                car.UpdatedAt = DateTime.UtcNow;

                _context.CarListings.Update(car);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating car");
                return StatusCode(500, new { message = "İlan güncellenirken hata oluştu." });
            }
        }

        // DELETE: api/cars/:id - Delete car listing (requires authentication & ownership)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var car = await _context.CarListings.FindAsync(id);

                if (car == null)
                    return NotFound(new { message = "Araç bulunamadı." });

                if (car.UserId != userId)
                    return Forbid();

                car.IsActive = false;
                car.UpdatedAt = DateTime.UtcNow;

                _context.CarListings.Update(car);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting car");
                return StatusCode(500, new { message = "İlan silinirken hata oluştu." });
            }
        }

        // GET: api/cars/user/:userId - Get user's car listings
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<CarListingResponse>>> GetUserCars(int userId)
        {
            try
            {
                var cars = await _context.CarListings
                    .Where(c => c.UserId == userId && c.IsActive)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new CarListingResponse
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        Make = c.Make,
                        Model = c.Model,
                        Year = c.Year,
                        Type = c.Type,
                        Price = c.Price,
                        Kilometers = c.Kilometers,
                        FuelType = c.FuelType,
                        Transmission = c.Transmission,
                        Power = c.Power,
                        Location = c.Location,
                        Description = c.Description,
                        ImageUrl = c.ImageUrl,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();

                return Ok(cars);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user cars");
                return StatusCode(500, new { message = "Araçlar yüklenirken hata oluştu." });
            }
        }
    }
}
