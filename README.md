🏡 HouseBrokerAPP

A modern real estate management application built with ASP.NET Core MVC, Entity Framework Core, and ASP.NET Identity. This app enables brokers to list properties, manage images, and allow clients to search/filter based on location, price, and type.

🚀 Features
✅ Authentication & Authorization with ASP.NET Identity
✅ CRUD operations for property listings
✅ Upload & manage property images
✅ Advanced search filters (location, price range, property type)
✅ Broker profile (Name, Email, Phone, City, Street)
✅ Responsive Bootstrap 5 UI with DataTables
✅ REST API endpoints returning JSON for integration

🛠️ Tech Stack
Backend: ASP.NET Core 8.0 MVC
Database: SQL Server + EF Core
Auth: ASP.NET Core Identity
Frontend: Razor Views, Bootstrap 5, DataTables, jQuery

⚙️ Setup Instructions
1️⃣ Clone the repository
https://github.com/nandkishor-chauhan/ASP.NET.ASSIGNMENT.git

2️⃣ Configure Database
Open Database Folder from the main Project and then Restore the Database.
Database Setup (ASP_HOUSE_BROKER.md)


Update your appsettings.json:

"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=HouseBrokerDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}

3️⃣ Run Migrations & Seed Data - at the time of migration select Default Project ASP.NET.HouseBrokerAPP
     database-update

For More  Detail Mail me: nandkishor.autosoft@gmail.com

This seeds a default Broler and user Login:

Broker1 :- UserName:- chauhan@gmail.com, Pass:-Nepal@123
Broker2 :- UserName:- chandan@gmail.com, Pass:-Nepal@123
Broker3 :- UserName:- sanju@gmail.com, Pass:-Nepal@123
User :- UserName:- himani@gmail.com, Pass:-Nepal@123
