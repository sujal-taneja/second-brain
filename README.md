# Second Brain

A full-stack web application to save, organize, and share your digital content — tweets, articles, videos, images, audio, and links — all in one place. Think of it as your personal knowledge base with public sharing capabilities.

## Tech Stack

| Layer    | Technologies                                             |
| -------- | -------------------------------------------------------- |
| Frontend | React, TypeScript, React Router, Tailwind CSS, Axios     |
| Backend  | Node.js, Express, TypeScript, Mongoose, Zod, bcrypt, JWT |
| Database | MongoDB                                                  |

## Project Structure

```
second-brain/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       ├── validators/
│       └── index.ts
├── frontend/
│   └── src/
│       ├── components/
│       ├── utils/
│       ├── config.ts
│       ├── App.tsx
│       └── main.tsx
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local instance or Atlas connection string)
- npm

### Environment Variables

Create a `.env` file inside `backend/` with:

```
MONGO_URL=mongodb://localhost:27017/
PORT=3000
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret_here
```

### Installation & Running

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

**Local MongoDB Container**

```bash
docker run --name second-brain -d -p 27017:27017 mongo
```

> Make sure `BACKEND_URL` in `frontend/src/config.ts` matches your backend's address (defaults to `http://localhost:3000`).

## Database Models

### User

| Field      | Type   | Constraints       |
| ---------- | ------ | ----------------- |
| `username` | String | required, unique  |
| `password` | String | required (hashed) |

### Content

| Field    | Type       | Constraints                                                 |
| -------- | ---------- | ----------------------------------------------------------- |
| `title`  | String     | required                                                    |
| `link`   | String     | optional                                                    |
| `type`   | String     | enum: `tweet`, `image`, `video`, `article`, `audio`, `link` |
| `tags`   | ObjectId[] | references `tags` collection                                |
| `userId` | ObjectId   | references `users` collection                               |

### Link (share links)

| Field    | Type     | Constraints           |
| -------- | -------- | --------------------- |
| `hash`   | String   | required              |
| `userId` | ObjectId | required, ref `users` |

### Tag

| Field   | Type   | Constraints |
| ------- | ------ | ----------- |
| `title` | String | required    |

## API Reference

Base URL: `/api/v1`

### Authentication

```
POST /api/v1/signup
```

Creates a new user account. Passwords are hashed with bcrypt before storage.

**Request body:**

```json
{
  "username": "sujal",
  "password": "Secret@123"
}
```

**Success response** — `200 OK`:

```json
{
  "message": "User signed up"
}
```

---

#### Sign In

```
POST /api/v1/signin
```

Authenticates a user and returns a JWT in the `Authorization` response header.

**Request body:**

```json
{
  "username": "sujal",
  "password": "Secret@123"
}
```

**Success response** — `200 OK`:

```json
{
  "message": "User signed in"
}
```

The JWT is returned in the **response header**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### Content (requires authentication)

All content endpoints require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

#### Add Content

```
POST /api/v1/content
```

Creates a new content entry for the authenticated user. Tags are automatically upserted — if a tag title already exists, it reuses the existing record.

**Request body:**

```json
{
  "title": "this is some text",
  "type": "article",
  "link": "https://url.com",
  "tags": ["react", "frontend"]
}
```

Only `title` is required. `type`, `link`, and `tags` are optional.

**Success response** — `200 OK`:

```json
{
  "message": "Content added"
}
```

---

#### Get All Content

```
GET /api/v1/content
```

Returns all content belonging to the authenticated user, with `userId` and `tags` populated.

**Success response** — `200 OK`:

```json
{
  "content": [
    {
      "_id": "660f1a2b3c4d5e6f7a8b9c0d",
      "title": "this is some text",
      "type": "article",
      "link": "https://url.com",
      "tags": [
        { "_id": "660f1a2b3c4d5e6f7a8b9c10", "title": "react" },
        { "_id": "660f1a2b3c4d5e6f7a8b9c11", "title": "frontend" }
      ],
      "userId": { "_id": "660f1a2b3c4d5e6f7a8b9c0e", "username": "sujal" }
    }
  ]
}
```

---

#### Get Content by Type

```
GET /api/v1/content/:type
```

Filters content by type. Valid types: `tweet`, `image`, `video`, `article`, `audio`, `link`.

**Example:**

```
GET /api/v1/content/article
```

**Success response** — `200 OK`:

```json
{
  "content": [
    {
      "_id": "660f1a2b3c4d5e6f7a8b9c0d",
      "title": "this is some text",
      "type": "article",
      "link": "https://url.com",
      "tags": [{ "_id": "...", "title": "react" }],
      "userId": { "_id": "...", "username": "sujal" }
    }
  ]
}
```

---

#### Delete Content

```
DELETE /api/v1/content
```

Deletes a content entry owned by the authenticated user.

**Request body:**

```json
{
  "contentId": "660f1a2b3c4d5e6f7a8b9c0d"
}
```

**Success response** — `200 OK`:

```json
{
  "message": "Content deleted"
}
```

---

### Sharing

#### Create / Toggle Share Link

```
POST /api/v1/brain/share
```

**Requires authentication.** Enables or disables a public share link for the user's brain.

**Enable sharing:**

```json
{
  "share": "true"
}
```

**Success response** — `200 OK`:

```json
{
  "link": "660f1a2b3c4d5e6f7a8b9c0d"
}
```

If a link already exists, the same hash is returned.

**Disable sharing:**

```json
{
  "share": "false"
}
```

**Response** — `400 Bad Request`:

```json
{
  "message": "sharing is turned off"
}
```

The existing share link is deleted from the database.

---

#### View Shared Brain (public)

```
GET /api/v1/brain/:shareLink
```

**No authentication required.** Returns all content belonging to the user who created the share link.

**Example:**

```
GET /api/v1/brain/660f1a2b3c4d5e6f7a8b9c0d
```

**Success response** — `200 OK`:

```json
[
  {
    "_id": "...",
    "title": "this is some text",
    "type": "article",
    "link": "https://url.com",
    "tags": [{ "_id": "...", "title": "react" }],
    "userId": { "_id": "...", "username": "sujal" }
  }
]
```

> Note: This endpoint returns a top-level array, not wrapped in `{ content: [...] }`.
