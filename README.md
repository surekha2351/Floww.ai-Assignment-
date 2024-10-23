# Floww.ai Assignment

A RESTful API for managing personal financial records. Users can record their income and expenses, retrieve past transactions, and get summaries by category or time period.

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: SQLite
- **Authentication**: JSON Web Tokens (JWT)

## Features

- Record transactions (income and expenses)
- Retrieve all transactions
- Retrieve a single transaction by ID
- Update or delete transactions
- View a summary of transactions with filtering (by category and date)
- JWT-based user authentication

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/surekha2351/Floww.ai-Assignment.git
cd Floww.ai
```

example path [How it will look]

C:filePathsWhereItIsStored\Floww.ai

### 2. Installing Dependencies

Make sure you have Node.js installed in your System, then run.

```bash
npm install
```

This will install the required dependencies which are needed to run the project.

### 3. Starting the Server

To start your server in development mode using nodemon, run the following command:

```bash
nodemon
```

### 4. Using app.http file [OPTIONAL]

You have two options for testing the API endpoints of the Floww.ai application: using the app.http file or the Postman collection if you want to use postman you can skip **app.http**.

The app.http file contains a collection of HTTP requests that can be used to test the API endpoints of the Floww.ai application. This file provides an easy way to interact with the API without the need for a separate client like Postman.

How to Use the app.http File
Install an HTTP Client Extension: To use the app.http file effectively, ensure you have an HTTP client extension installed in your code editor. For Visual Studio Code, you can use the REST Client extension.

Open the app.http File: Navigate to the app.http file in project directory. This file contains various HTTP requests organized by functionality.

Testing API Endpoints: Each request in the app.http file is preceded by comments that describe its purpose. You can send any request by clicking on the "Send Request" link above each HTTP block. Here’s an overview of the requests included:

### 5. Postman Collection Link and Documentation




### Important Points

**Postman Authorization:** When using Postman, make sure to include the Bearer token in the Authorization header for endpoints that require authentication.

**Error Handling:** The API includes basic error handling. If you encounter issues, check the server logs for error messages that can help diagnose problems.
