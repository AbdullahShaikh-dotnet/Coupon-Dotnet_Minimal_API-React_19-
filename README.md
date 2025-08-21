# 🎟️ Coupon Minimal API + React

![.NET Core Version](https://img.shields.io/badge/.NET%20Core-9.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Stars](https://img.shields.io/github/stars/AbdullahShaikh-dotnet/Coupon_Minimal_API-Dotnet-Core?style=social)
![Forks](https://img.shields.io/github/forks/AbdullahShaikh-dotnet/Coupon_Minimal_API-Dotnet-Core?style=social)

A modern **Coupon Management System** built with **.NET 9 Minimal API** (backend) and **React 19 + Shadcn UI** (frontend).  
This repository demonstrates clean architecture, RESTful principles, authentication/authorization, and integration with SQL Server.

---

## 📝 Highlights

- **Backend** → Clean, modular **Minimal API** built on **.NET 9**, using EF Core + SQL Server  
- **Frontend** → **React 19** with **Shadcn UI**  
- **Full-stack template** → Ideal for learning, prototyping, or extending into production apps  

---

## 🚀 Features

- ✅ **.NET 9 Minimal API** architecture  
- ✅ **SQL Server** with Entity Framework Core  
- ✅ **Repository Pattern** for clean data access  
- ✅ **AutoMapper** for DTO mapping  
- ✅ **FluentValidation** for request validation  
- ✅ **Swagger / OpenAPI** documentation  
- ✅ **Dependency Injection** (built-in)  
- ✅ **Standardized API response structure**  
- ✅ **Serilog** for structured logging  
- ✅ **Environment-based configuration**  
- ✅ **JWT Authentication & Role-based Authorization**  
- ✅ **.NET Aspire support**  
- ✅ **Frontend with React 19 + Shadcn UI**  

---

## 📦 Tech Stack

| Layer          | Tech                         |
|----------------|------------------------------|
| **Backend API** | ASP.NET Core 9 Minimal API   |
| **ORM**         | Entity Framework Core        |
| **Database**    | SQL Server                   |
| **Validation**  | FluentValidation             |
| **Mapping**     | AutoMapper                   |
| **Logging**     | Serilog                      |
| **Docs**        | Swagger / OpenAPI            |
| **Auth**        | JWT + Role-based             |
| **Orchestration** | .NET Aspire                 |
| **UI**          | React 19 + Shadcn UI         |

---

## 🛠️ Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)  
- [SQL Server](https://www.microsoft.com/en-in/sql-server/sql-server-downloads)  
- Any IDE (Visual Studio, Rider, or VS Code)  

---

### ⚡ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdullahShaikh-dotnet/Coupon_Minimal_API-Dotnet-Core.git
   cd Coupon_Minimal_API-Dotnet-Core```

2. **Apply migrations and create database**
   ```bash
   update-database```
   
3. **Install npm dependency**
   ```bash
   npm install```

4. **Add Auth Key and Automapper License Key in appsettings.json**

6. **Run with Aspire**
```
npm run dev:aspire
```

7. **Run without Aspire**
```
npm run dev:all
```

###🧾 License
**This project is licensed under the MIT License – see the LICENSE file for details.**


   
