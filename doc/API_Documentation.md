# QuickHire Backend API Documentation

This document provides comprehensive information about all available API endpoints, their validation requirements, and usage examples.

## Base URL
```
http://localhost:8082/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## 📋 Job Management APIs

### 1. Get All Approved Jobs (Public)
**Endpoint:** `GET /jobs`

**Description:** Retrieve all approved jobs with filtering and pagination

**Query Parameters:**
- `search` (string, optional) - Search in title, description, or company name
- `type` (string, optional) - Job type filter
- `location` (string, optional) - Location filter
- `categoryId` (string, optional) - Category ID filter
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `sortBy` (string, optional) - Sort field (default: createdAt)
- `sortOrder` (string, optional) - Sort order: asc/desc (default: desc)

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": [
    {
      "id": "job_id",
      "title": "Software Engineer",
      "description": "Job description...",
      "salaryRange": "$60k-80k",
      "location": "Remote",
      "type": "FULL_TIME",
      "status": "APPROVED",
      "company": {
        "id": "company_id",
        "name": "Tech Company",
        "logo": "logo_url",
        "location": "San Francisco"
      },
      "category": {
        "id": "category_id",
        "name": "Engineering",
        "icon": "icon_url"
      },
      "_count": {
        "applications": 5
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Job by ID (Public)
**Endpoint:** `GET /jobs/:id`

**Description:** Retrieve a specific job by ID

**Path Parameters:**
- `id` (string, required) - Job ID

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job fetched successfully",
  "data": {
    "id": "job_id",
    "title": "Software Engineer",
    "description": "Job description...",
    "requirements": "Requirements...",
    "responsibilities": "Responsibilities...",
    "salaryRange": "$60k-80k",
    "location": "Remote",
    "type": "FULL_TIME",
    "status": "APPROVED",
    "company": {
      "id": "company_id",
      "name": "Tech Company",
      "logo": "logo_url",
      "location": "San Francisco"
    },
    "category": {
      "id": "category_id",
      "name": "Engineering",
      "icon": "icon_url"
    },
    "_count": {
      "applications": 5
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Create Job (Company Only)
**Endpoint:** `POST /jobs`

**Description:** Create a new job posting

**Authentication:** Required (Company role)

**Request Body:**
```json
{
  "title": "Software Engineer",
  "description": "We are looking for a talented software engineer...",
  "requirements": "3+ years of experience, React, Node.js",
  "responsibilities": "Develop and maintain web applications",
  "salaryRange": "$60k-80k",
  "location": "Remote",
  "type": "FULL_TIME",
  "categoryId": "category_id",
  "companyId": "company_id"
}
```

**Validation Rules:**
- `title` (string, required, min 1 character)
- `description` (string, required, min 1 character)
- `requirements` (string, optional)
- `responsibilities` (string, optional)
- `salaryRange` (string, optional)
- `location` (string, optional)
- `type` (enum, required) - Values: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`
- `categoryId` (string, required, min 1 character)
- `companyId` (string, required, min 1 character)

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Job posted successfully and is pending admin approval",
  "data": {
    "id": "new_job_id",
    "title": "Software Engineer",
    "description": "We are looking for a talented software engineer...",
    "status": "APPROVED",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update Job (Company/Admin)
**Endpoint:** `PATCH /jobs/:id`

**Description:** Update an existing job

**Authentication:** Required (Company or Admin role)

**Path Parameters:**
- `id` (string, required) - Job ID

**Request Body:**
```json
{
  "title": "Updated Software Engineer",
  "description": "Updated description...",
  "requirements": "Updated requirements...",
  "responsibilities": "Updated responsibilities...",
  "salaryRange": "$70k-90k",
  "location": "Hybrid",
  "type": "PART_TIME",
  "categoryId": "new_category_id",
  "tags": ["react", "nodejs", "typescript"]
}
```

**Validation Rules:**
All fields are optional:
- `title` (string)
- `description` (string)
- `requirements` (string)
- `responsibilities` (string)
- `salaryRange` (string)
- `location` (string)
- `type` (enum) - Values: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`
- `categoryId` (string)
- `tags` (array of strings)

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": "job_id",
    "title": "Updated Software Engineer",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Update Job Status (Admin Only)
**Endpoint:** `PATCH /jobs/admin/:id/status`

**Description:** Update job status (approve/reject/close)

**Authentication:** Required (Admin role)

**Path Parameters:**
- `id` (string, required) - Job ID

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Validation Rules:**
- `status` (enum, required) - Values: `APPROVED`, `REJECTED`, `CLOSED`

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job status updated to APPROVED",
  "data": {
    "id": "job_id",
    "status": "APPROVED",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Delete Job (Company/Admin)
**Endpoint:** `DELETE /jobs/:id`

**Description:** Soft delete a job

**Authentication:** Required (Company or Admin role)

**Path Parameters:**
- `id` (string, required) - Job ID

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### 7. Get All Jobs for Admin (Admin Only)
**Endpoint:** `GET /jobs/admin/all`

**Description:** Retrieve all jobs including pending ones

**Authentication:** Required (Admin role)

**Query Parameters:**
- `search` (string, optional) - Search in title
- `status` (string, optional) - Job status filter
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `sortBy` (string, optional) - Sort field (default: createdAt)
- `sortOrder` (string, optional) - Sort order: asc/desc (default: desc)

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Admin jobs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": [
    {
      "id": "job_id",
      "title": "Software Engineer",
      "status": "PENDING",
      "company": {
        "id": "company_id",
        "name": "Tech Company",
        "logo": "logo_url"
      },
      "category": {
        "id": "category_id",
        "name": "Engineering"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🏷️ Category Management APIs

### 1. Get All Categories (Public)
**Endpoint:** `GET /categories`

**Description:** Retrieve all categories with job counts

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "category_id",
      "name": "Engineering",
      "icon": "icon_url",
      "jobCount": 15
    },
    {
      "id": "category_id_2",
      "name": "Design",
      "icon": "icon_url_2",
      "jobCount": 8
    }
  ]
}
```

---

### 2. Get Category by ID (Public)
**Endpoint:** `GET /categories/:id`

**Description:** Retrieve a specific category by ID

**Path Parameters:**
- `id` (string, required) - Category ID

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Category fetched successfully",
  "data": {
    "id": "category_id",
    "name": "Engineering",
    "icon": "icon_url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "isDeleted": false
  }
}
```

---

### 3. Create Category (Admin Only)
**Endpoint:** `POST /categories`

**Description:** Create a new category

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "Marketing",
  "icon": "https://example.com/icon.png"
}
```

**Validation Rules:**
- `name` (string, required, min 1 character)
- `icon` (string, optional)

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "new_category_id",
    "name": "Marketing",
    "icon": "https://example.com/icon.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "isDeleted": false
  }
}
```

---

### 4. Update Category (Admin Only)
**Endpoint:** `PATCH /categories/:id`

**Description:** Update an existing category

**Authentication:** Required (Admin role)

**Path Parameters:**
- `id` (string, required) - Category ID

**Request Body:**
```json
{
  "name": "Digital Marketing",
  "icon": "https://example.com/new-icon.png"
}
```

**Validation Rules:**
All fields are optional:
- `name` (string)
- `icon` (string)

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "category_id",
    "name": "Digital Marketing",
    "icon": "https://example.com/new-icon.png",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Delete Category (Admin Only)
**Endpoint:** `DELETE /categories/:id`

**Description:** Soft delete a category

**Authentication:** Required (Admin role)

**Path Parameters:**
- `id` (string, required) - Category ID

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 📊 Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "errorMessages": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Authentication & Authorization

### User Roles:
- `ADMIN` - Full access to all endpoints
- `COMPANY` - Can create, update, and delete own jobs
- `USER` - Public access to job and category viewing

### JWT Token Format:
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "COMPANY",
  "companyId": "company_id"
}
```

---

## 📝 Notes

1. **Soft Delete**: Jobs and categories use soft delete (`isDeleted` flag)
2. **Job Status**: Jobs must be `APPROVED` to be visible publicly
3. **Pagination**: All list endpoints support pagination
4. **Caching**: Job data is cached in Redis for performance
5. **Validation**: All inputs are validated using Zod schemas
6. **Rate Limiting**: API endpoints are rate-limited to prevent abuse

---

## 🚀 Getting Started

1. Import the Postman collection: `QuickHire_API_Collection.json`
2. Set the base URL environment variable: `{{baseUrl}}`
3. Add your JWT token to the environment variables: `{{accessToken}}`
4. Start making API requests!

For more information about the project setup and configuration, refer to the main [README.md](../README.md) file.
