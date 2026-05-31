---
name: api-backend
description: Comprehensive Backend API Skill. Provides guidelines and best practices for RESTful API design, schema validation, token/session authentication, database query optimization, security hardening, and error handling.
---

# API Backend - Comprehensive Skill

This skill provides the core guidelines and execution patterns for designing, implementing, and securing backend APIs, services, database interactions, and authentication systems.

## Core Execution Flow

1. **Endpoint Contract & Routing**:
   - Establish a clean, resource-oriented endpoint structure (e.g., `/api/v1/resources`).
   - Use correct HTTP methods: `GET` for retrieval, `POST` for creation, `PUT` for full update, `PATCH` for partial update, `DELETE` for removal.
   - Use standard HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`, `500 Internal Server Error`.
2. **Request Schema Validation & Sanitization**:
   - Always validate request input data at the boundary layer (e.g., using Zod, Joi, class-validator, or language-native schemas).
   - Sanitize parameters to block SQL Injection, command injection, and Cross-Site Scripting (XSS).
3. **Authentication & Authorization**:
   - Implement secure token/session protocols. Use `HttpOnly` and `Secure` cookies for JWT storage where appropriate.
   - Set up role-based access control (RBAC) or attribute-based access control (ABAC). Check permissions at the gateway or middleware level before invoking service layer actions.
4. **Database Access & Optimization**:
   - Optimize queries: use appropriate indices, analyze query execution plans, and prevent the `N+1` query problem (use eager loading / joins).
   - Keep transactions short and focused on critical operations to avoid row locks. Use connection pooling.
5. **Security Hardening**:
   - Configure Cross-Origin Resource Sharing (CORS) rules strictly; do not use wildcard `*` in production.
   - Protect against CSRF attacks and implement rate limiting on sensitive routes (e.g., login, password reset).
   - Set up essential HTTP headers (e.g., Helmet middleware).
6. **Robust Error Handling & Structured Logging**:
   - Use a global exception filter/middleware to capture unhandled errors.
   - Return clean, semantic error payloads to the client (hide stack traces in production).
   - Write structured logs containing request ID, timestamp, log level, and contextual metadata.

---

## Detailed Execution Guidelines

### Request Validation Example (Node.js/Zod)
```javascript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).optional(),
});

export function validateCreateUser(req, res, next) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.errors,
    });
  }
  req.validatedBody = result.data;
  next();
}
```

### Secure JWT Handshake
- **Access Token**: Short-lived (e.g., 15 minutes), passed in Authorization header (`Bearer <token>`).
- **Refresh Token**: Long-lived (e.g., 7 days), stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie, saved in database/Redis with revocation check on rotation.

### Database Query Checklists
- Avoid `SELECT *`. Select only required fields.
- Make sure foreign keys and fields frequently queried in `WHERE` / `ORDER BY` clauses are indexed.
- Use pagination for lists (`limit` and `offset`, or cursor-based pagination for large/real-time datasets).
