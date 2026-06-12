🚗 ArabaAra Project - Quick Start Guide
📦 Project Structure

proje11-2-1/
├── frontend.html              ← Main page (open in browser)
├── frontend.css               ← Styles
├── frontend.js                ← JavaScript & API integration
├── test-api.html              ← API test page
├── README.md                  ← Detailed documentation
├── SETUP.md                   ← This file
├── görseller/                 ← Images
├── backend/                   ← ASP.NET Core API
│   ├── run.bat                ← Windows: Start backend
│   └── ...
└── USB-KURULUMu.md            ← Running from USB
⚡ Get Started in 1 Minute
Step 1: Start the Backend (CMD or PowerShell)

cd backend
dotnet run
Expected output: Now listening on: http://localhost:5000

Step 2: Open the Frontend
Double-click frontend.html
or drag it into the browser
or open it with Live Server
Step 3: Test
Click the "Register" button
Fill out the form and complete registration
Log in
Add a listing
🧪 Troubleshooting
Backend doesn’t start: "dotnet: The term 'dotnet' is not recognized"
→ Is the .NET 10 SDK installed? Check: echo %PATH%

To see errors in the frontend:
Press F12 in your browser
Open the Console tab
Try the forms and view the errors
Cannot connect to the API:
Check that the backend is running (http://localhost:5000)
Check firewall settings
Open the test-api.html file and test
📊 Database
LocalDB Setup (First Time)

cd backend
dotnet ef database update
Reset the Database

cd backend
dotnet ef database drop
dotnet ef database update
🔐 Test Accounts
If you cannot register a user, run the following SQL to seed the database with test data:


-- Run this in SQL Server Management Studio
INSERT INTO Users (Email, Username, PasswordHash, FullName, CreatedAt, IsActive)
VALUES ('test@example.com', 
        'testuser', 
        '$2a$11$...', 
        'Test User',
        GETUTCDATE(), 
        1);
🚀 Deployment (Optional)
Frontend (Static)
Copy it to any web server
or use Firebase Hosting, Netlify, Vercel
Backend (ASP.NET Core)

dotnet publish -c Release -o ./publish
📞 Quick Reference
Problem	Solution
"I can’t log in"	Open F12 Console and check the errors
"Database error"	dotnet ef database drop + update
"Port 5000 is in use"	Use another port: dotnet run --urls "http://localhost:5001"
"Frontend can’t find the API"	Check whether the backend is running
📁 Opening in Firefox/Edge/Chrome
Option 1: Drag & Drop
frontend.html → Browser window

Option 2: Live Server (Visual Studio Code)
Open frontend.html in VS Code
Right-click → "Open with Live Server"
Option 3: Python Server

# Go to the folder where frontend.html is located
python -m http.server 8000
# Then: http://localhost:8000
Ready to go? Start now! 🚀