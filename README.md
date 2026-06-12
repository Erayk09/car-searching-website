ArabaAra - Car Sales Platform
📱 Frontend + Backend Application
🎯 Features
✅ User Management

Register
Login / Logout
JWT Token-based authentication
✅ Vehicle Listings

View all listings
Add new listings (only for logged-in users)
View listing details
Update and delete listings
✅ UI/UX

Responsive design
Modal forms
Category-based filtering
Search feature
Notification system
🚀 Frontend Setup
The frontend is simple HTML/CSS/JavaScript. No installation is required.

File Structure
frontend2.html      - Main page
frontend2.css       - Styles
frontend2.js        - JavaScript logic & API integration
görseller/         - Images folder


Running
Open it using a simple HTTP server (Python, Live Server, etc.)
Open the frontend.html file
Make sure the backend is running
🛠 Backend Setup (.NET 10)
Step 1: Go to the Backend Folder

cd backend
Step 2: Create the Database

dotnet ef database update
This command will create a database named CarListingDB in LocalDB.

Step 3: Run the API

dotnet run
By default, the API will open at http://localhost:5000.

Step 4: Open Swagger UI (Optional)
To test the API:


http://localhost:5000/swagger
📋 Database
SQL Server LocalDB
Server: (localdb)\mssqllocaldb
Database: CarListingDB
Connection: Defined in the appsettings.json file
Tables
Users - Users
CarListings - Car listings
🔐 Authentication (JWT)
Token Structure
Secret: 32+ characters (in appsettings.json)
Expiry: 24 hours
Issuer: CarListingAPI
Audience: CarListingAPIUsers
Token Usage in Frontend
Automatically stored in LocalStorage:


localStorage.getItem('token')      // JWT Token
localStorage.getItem('user')       // User JSON
🌐 API Endpoints
Authentication
POST /api/auth/register - Register
POST /api/auth/login - Login
Vehicles (Cars)
GET /api/cars - All listings
GET /api/cars/{id} - Single listing
POST /api/cars - New listing (Auth required)
PUT /api/cars/{id} - Update listing (Auth required)
DELETE /api/cars/{id} - Delete listing (Auth required)
GET /api/cars/user/{userId} - User's listings
🧪 Testing
1. Create an Account
Click the "Register" button in the frontend
Fill out the form and submit
2. Login
Click the "Login" button
Enter email and password
3. Add a Listing
Click the "+ Add Listing" button in the top-right corner
Do not submit the form after filling it out
The listing will be added to the gallery
4. View Listing Details
Click any vehicle card
The details modal will open
📚 Learning Resources
Frontend
HTML/CSS/JavaScript vanilla
HTTP calls with Fetch API
Local Storage management
Modal and form management
Backend
ASP.NET Core 10.0.203
Entity Framework Core
JWT Authentication
SQL Server
RESTful API Design
⚙️ Configuration
appsettings.json (Backend)

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CarListingDB;Trusted_Connection=true;"
  },
  "Jwt": {
    "Secret": "..."
  ,
    "Issuer": "CarListingAPI",
    "Audience": "CarListingAPIUsers",
    "ExpiryMinutes": 1440
  }
}
frontend.js (Frontend)

const API_URL = 'http://localhost:5000/api';
🔧 Troubleshooting
 API connection failed
 Make sure the backend is running: http://localhost:5000
 Check firewall settings
 Verify CORS settings
 Database error

 dotnet ef database drop
 dotnet ef database update
 Token error
 Open the browser console (F12)
 Check whether a token exists in localStorage
 Make sure the token has not expired
📦 Project Structure

proje11-2-1/
├── frontend.html
├── frontend.css
├── frontend.js
├── görseller/
├── backend/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   ├── DTOs/
│   ├── Controllers/
│   ├── Startup.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── CarListingAPI.csproj
└── README.md
🎓 Development Stages
✅ Completed
 Frontend UI design
 Modern responsive layout
 Login/Register system
 JWT authentication
 Car listings CRUD
 Database integration
  🔄 Future Improvements
 Profile management
 Car photo uploads
 Comment system
 Favorites
 Statistics
 Admin panel
 Email verification
 Password reset
📞 Support
 If you have any questions:

 Check the browser console (F12 → Console)
 Monitor API calls in the Network tab
 Check backend logs
 Last Updated: March 22, 2026
 Version: 1.0