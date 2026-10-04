# URL Shortener

A full-stack URL shortener that converts long URLs into short, shareable links.

This project supports automatically generated short codes, custom aliases, alias validation, duplicate-alias protection, link deletion, URL validation, and redirection through a React frontend and Express API backed by MongoDB.

## Table of Contents

1. [What this project does](#what-this-project-does)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [How to run locally](#how-to-run-locally)
5. [The demo flow](#the-demo-flow)
6. [Architecture](#architecture)
7. [How URL shortening works](#how-url-shortening-works)
8. [Custom aliases](#custom-aliases)
9. [Delete a short link](#delete-a-short-link)
10. [Project structure](#project-structure)
11. [API reference](#api-reference)
12. [Environment variables](#environment-variables)
13. [Testing the API](#testing-the-api)
14. [Troubleshooting](#troubleshooting)
15. [Future improvements](#future-improvements)
16. [License](#license)

---

## What this project does

The application takes a destination URL such as:

```text
https://www.example.com/articles/how-to-build-a-url-shortener
```

and creates a shorter link.

A short link can use an automatically generated code or a custom alias:

```text
http://localhost:3000/my-project
```

When the short link is opened, the API looks up the destination in MongoDB and redirects the user to the original URL.

---

## Features

- Create short URLs
- Automatically generate unique short codes
- Custom aliases
- Alias validation
- Duplicate alias protection
- URL validation
- Redirect short links to their destination
- Delete existing short links
- MongoDB persistence
- React/Vite frontend
- Express/TypeScript backend
- REST API
- Separate frontend and backend applications

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Zod

### Database

- MongoDB
- Mongoose

### Development

- Git
- GitHub
- npm

---

## How to run locally

### Prerequisites

Install:

- Node.js
- npm
- MongoDB
- Git

Check Node.js:

```powershell
node --version
```

Check npm:

```powershell
npm --version
```

Make sure MongoDB is running before starting the API.

### 1. Clone the repository

```powershell
git clone https://github.com/SDhakrey/url-shortener.git
cd url-shortener
```

### 2. Start the backend

Open a terminal:

```powershell
cd apps/api
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

### 3. Start the frontend

Open a second terminal:

```powershell
cd apps/web
npm run dev
```

Vite starts the frontend at:

```text
http://localhost:5173
```

Open that address in your browser.

---

## The demo flow

### Step 1 — Enter a destination URL

Open:

```text
http://localhost:5173
```

Enter a URL such as:

```text
https://www.google.com
```

### Step 2 — Optionally choose a custom alias

You can leave the alias empty and let the backend generate a short code.

Or enter:

```text
my-project
```

### Step 3 — Create the short link

The frontend sends the destination URL and optional alias to the backend.

The API validates the request and stores the link in MongoDB.

### Step 4 — Open the short link

The API:

1. Reads the short code.
2. Finds the matching record in MongoDB.
3. Gets the original destination URL.
4. Redirects the browser.

### Step 5 — Delete a short link

A link can be removed using:

```http
DELETE /api/links/:code
```

Successful deletion returns:

```text
204 No Content
```

A missing link returns:

```text
404 Not Found
```

---

## Architecture

```text
                    +----------------------+
                    |     React + Vite     |
                    |   localhost:5173     |
                    +----------+-----------+
                               |
                               | HTTP / JSON
                               v
                    +----------------------+
                    | Express + TypeScript |
                    |   localhost:3000     |
                    +----------+-----------+
                               |
                               | Mongoose
                               v
                    +----------------------+
                    |       MongoDB         |
                    +----------------------+
```

### Create-link flow

```text
Long URL
   |
   v
React frontend
   |
   | POST
   v
Express API
   |
   +-- Validate URL
   |
   +-- Validate optional alias
   |
   +-- Check alias uniqueness
   |
   v
MongoDB
   |
   v
Return short link
```

### Redirect flow

```text
Short URL
   |
   v
Express API
   |
   v
Find code in MongoDB
   |
   +-- Not found -> 404
   |
   v
Original destination
   |
   v
HTTP redirect
```

---

## How URL shortening works

When a user creates a link, the API receives the destination URL and an optional alias.

If an alias is supplied, the API validates it and checks that it is not already in use.

If no alias is supplied, the backend generates a short code automatically.

The short code and destination URL are stored in MongoDB.

When the short code is requested later, the API searches MongoDB and redirects the browser to the stored destination.

---

## Custom aliases

Custom aliases make links easier to recognize and share.

Example:

```text
https://example.com/very/long/path
```

can become:

```text
http://localhost:3000/my-project
```

### Alias rules

The current API validates aliases as:

- Optional
- Minimum length: 4 characters
- Maximum length: 24 characters
- Letters allowed
- Numbers allowed
- Hyphens allowed
- Other characters rejected

Example:

```text
my-project-2026
```

If the alias already exists, the API returns:

```text
409 Conflict
```

---

## Delete a short link

Endpoint:

```http
DELETE /api/links/:code
```

Example:

```http
DELETE /api/links/my-project
```

Successful response:

```text
204 No Content
```

If the link does not exist:

```text
404 Not Found
```

---

## Project structure

```text
url-shortener/
|
+-- apps/
|   |
|   +-- api/
|   |   +-- src/
|   |       +-- index.ts
|   |       |
|   |       +-- models/
|   |       |   +-- link.model.ts
|   |       |
|   |       +-- routes/
|   |           +-- links.ts
|   |
|   +-- web/
|       +-- src/
|           +-- App.tsx
|           +-- App.css
|           +-- index.css
|           +-- main.tsx
|           +-- assets/
|
+-- .gitignore
+-- README.md
```

### Backend files

`apps/api/src/index.ts`

Starts and configures the Express API.

`apps/api/src/models/link.model.ts`

Defines the MongoDB/Mongoose link model.

`apps/api/src/routes/links.ts`

Contains the link creation, redirect, alias handling, and deletion routes.

### Frontend files

`apps/web/src/App.tsx`

Main URL-shortener interface and API interaction.

`apps/web/src/App.css`

Application-specific styling.

`apps/web/src/index.css`

Global styling.

---

## API reference

### Create a short link

```http
POST /api/links
```

Request:

```json
{
  "destination": "https://www.example.com/article"
}
```

With a custom alias:

```json
{
  "destination": "https://www.example.com/article",
  "alias": "my-project"
}
```

### Redirect

```http
GET /api/links/:code
```

The API looks up the code and redirects to the stored destination.

### Delete

```http
DELETE /api/links/:code
```

Successful response:

```text
204 No Content
```

### Common errors

| Status | Meaning |
|---|---|
| 400 | Invalid request / validation failure |
| 404 | Short link not found |
| 409 | Custom alias already in use |

---

## Environment variables

Real `.env` files should remain local and should not be committed.

The frontend uses:

```env
VITE_BACKEND_URI=http://localhost:3000/api
```

Configure the API's MongoDB connection using its local environment configuration.

Use `.env.example` files for values that are safe to share.

Never commit passwords, tokens, or other secrets.

---

## Testing the API

Create a link from PowerShell:

```powershell
$body = @{
    destination = "https://www.google.com"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/links" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Create a custom alias:

```powershell
$body = @{
    destination = "https://www.github.com"
    alias = "github"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/links" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Delete a link:

```powershell
Invoke-WebRequest `
    -Uri "http://localhost:3000/api/links/github" `
    -Method DELETE
```

A successful deletion returns:

```text
204
```

---

## Troubleshooting

### Frontend cannot connect to backend

Make sure both applications are running:

```powershell
cd apps/api
npm run dev
```

and in another terminal:

```powershell
cd apps/web
npm run dev
```

Check:

```env
VITE_BACKEND_URI=http://localhost:3000/api
```

Restart Vite after changing an environment variable.

### MongoDB connection error

Make sure MongoDB is running and the API is using the correct MongoDB connection configuration.

### Port already in use

Stop the process already using port `3000` or `5173`, or configure another port.

### `npm run dev` cannot find `package.json`

Run the command inside the appropriate application:

```text
apps/api
```

for the backend, and:

```text
apps/web
```

for the frontend.

---

## Future improvements

Possible next improvements include:

- Link expiration
- Click analytics
- Authentication and user accounts
- Per-user link management
- Rate limiting
- Redis caching
- QR code generation
- Automated tests
- OpenAPI/Swagger documentation
- Docker support
- CI/CD
- Production deployment
- Link-management dashboard

These are future improvements and are not presented as current features.

---

## License

This project is intended as a learning and portfolio project.

If a formal open-source license is added later, update this section with the selected license and its terms.
