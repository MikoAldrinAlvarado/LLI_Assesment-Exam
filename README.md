# Stockwise Inventory System

Stockwise is a simple inventory management system built for the LLI Developer Assessment. It provides secure login, product CRUD operations, inventory dashboard summaries, and it can generate reports in Inventory stocks and also daily and weekly revenue.

## Technology Stack

- Frontend: React, Vite, and Ant Design
- Backend: Node.js and Express.js
- Database: Microsoft SQL Server
- API style: RESTful API

## Features

- Admin login using JWT authentication
- Product Create, Read, Update, and Delete operations
- Product inventory TXT report generation
- Dashboard summary for total products, stock units, low-stock items, and out-of-stock items
- Weekly sales and revenue report with TXT export
- REST APIs for products, dashboard, sales, and reports

## Project Structure

```text
LLI_Assesment-Exam/
├── Backend/                 # Express REST API and MSSQL connection
│   └── src/
│       ├── Controllers/
│       ├── Middlewares/
│       ├── Models/
│       └── Routers/
├── Frontend/                # React and Ant Design application
│   └── src/
│       ├── components/
│       ├── services/
│       └── styles/
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js 20 or later
- npm
- Microsoft SQL Server or SQL Server Express
- SQL Server Management Studio (recommended)

## Database Setup

1. Open SQL Server Management Studio.
2. Create a database named `Stockwisedb`.
3. Create the following tables in the database:
   - `dbo.Users`
   - `dbo.Products`
   - `dbo.Sales`
   - `dbo.SaleItems`

4. Ensure the backend database account has access to `Stockwisedb`.
5. Create the application admin account in `dbo.Users`. The password must be stored as a bcrypt hash, not plain text.

## Backend Setup

1. Open a terminal in the project root.
2. Go to the backend folder:

   ```bash
   cd Backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file inside `Backend` and configure it using your SQL Server values:

   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   DB_SERVER=MIKO
   DB_PORT=1433
   DB_NAME=Stockwisedb
   DB_USER=Newuser
   DB_PASSWORD=your_sql_server_password

   JWT_SECRET=your_long_random_jwt_secret
   ```

   Replace the database values with your own local SQL Server configuration. Do not commit the `.env` file to GitHub.

5. Start the backend API:

   ```bash
   npm run dev
   ```

6. The backend should run at:

   ```text
   http://localhost:5000
   ```

7. You can test the API health endpoint in a browser or Postman:

   ```text
   GET http://localhost:5000/api/health
   ```

## Frontend Setup

1. Open another terminal.
2. Go to the frontend folder:

   ```bash
   cd Frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the React application:

   ```bash
   npm run dev
   ```

5. Open the URL displayed by Vite. The default URL is:

   ```text
   http://localhost:5173
   ```

## Test Account

Use this application account on the Login page:

```text
Username: admin
Password: Admin2026
```

`Newuser` is the SQL Server database connection account configured in the backend `.env`; it is different from the Stockwise application login account.

## How to Test the Application

### 1. Login

1. Start both the backend and frontend.
2. Open `http://localhost:5173`.
3. Enter the test account credentials.
4. Click **Sign in**.
5. A successful login stores a JWT token in browser local storage and opens the Dashboard.

### 2. Product CRUD

1. Click **Products** in the sidebar.
2. Click **Add product**.
3. Enter a product name, SKU, price, and stock quantity.
4. Save the product and verify that it appears in the table.
5. Click the edit icon to update a product and save the changes.
6. Click the delete icon and confirm deletion. The backend uses a soft delete, so the product is hidden from the active product list while preserving historical data.
7. Click **Generate report** to download the product inventory as a TXT file.

### 3. Dashboard

1. Click **Dashboard**.
2. Verify that the dashboard displays data from the database:
   - Total Products
   - Total Units in Stock
   - Low Stock Items
   - Out of Stock Items
   - Products Needing Attention

### 4. Weekly Sales and Revenue Report

1. Click **Reports**.
2. Verify the weekly revenue, orders, units sold, daily chart, and daily sales table.
3. Click **Generate report** to download the weekly sales report as a TXT file.

The sales report will show zero values until sale records are created in the `Sales` and `SaleItems` tables through the sales API.

### 5. Logout

1. Click **Logout** in the sidebar.
2. Click **Yes** in the confirmation message.
3. Verify that the application returns to the Login page.

## Main REST API Endpoints

```text
POST   /api/auth/login

GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/low-stock

GET    /api/dashboard/summary

POST   /api/sales
GET    /api/reports/sales/weekly
```

All endpoints except `/api/auth/login` and `/api/health` require this request header:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Challenges Encountered

### Ant Design

This was my first time using Ant Design. At the beginning, I needed time to understand its components, props, layout system, and current API patterns. I gradually adapted by using Ant Design components for forms, tables, cards, modals, notifications, and page layouts. I also addressed deprecation warnings by updating older props to the Ant Design 6 equivalents.

### MSSQL and Node.js Connection

Connecting Node.js to Microsoft SQL Server was also new to me because I was more familiar with MySQL. The following issues were encountered and resolved:

1. **TCP/IP was initially disabled for SQL Server Express.** I opened SQL Server Configuration Manager, enabled TCP/IP under `SQL Server Network Configuration > Protocols for SQLEXPRESS`, and restarted the SQL Server Express service.

2. **The SQL Server instance was configured to use TCP port 1433.** In `TCP/IP > Properties > IP Addresses > IPAll`, the configuration showed `TCP Dynamic Ports = 0` and `TCP Port = 1433`.

3. **SQL Server Authentication was initially disabled.** The server was set to Windows Authentication mode. I changed it to SQL Server and Windows Authentication mode, restarted SQL Server, and was then able to authenticate the database connection account.

4. **SQL Server Browser was stopped.** This was investigated, but it was not the final issue because the backend uses a direct TCP connection through port 1433.

5. **The backend connection timed out when using the named instance.** The original configuration used `DB_SERVER=MIKO\SQLEXPRESS` with port `1433`, which produced an `ETIMEOUT` error.

6. **The port was tested directly.** `Test-NetConnection MIKO -Port 1433` returned `TcpTestSucceeded: True`, confirming that the machine and port were reachable.

7. **Final solution.** I changed the server value from `MIKO\SQLEXPRESS` to `MIKO` while keeping `DB_PORT=1433`. This allowed the Node.js backend to connect successfully to MSSQL.

## Notes

- The backend database credentials and JWT secret are stored only in `Backend/.env`.
- Do not upload `.env` to GitHub.
- The project is intended for local development and assessment demonstration.
