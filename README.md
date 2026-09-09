# suot-web

Suot is a fashion inventory app for keeping track of your clothes. This repository contains the Next.js frontend. It connects to `suot-api`, a separate FastAPI backend backed by PostgreSQL.

Right now, you can create an account, sign in, view your closet, and add items. After adding an item, the closet updates without a page refresh.

I'm building Suot to get more experience taking a feature from the database through to a working interface. It's still an MVP, with more work needed on authentication, validation, and the UI before it's ready for real users.

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS for styling
- React Hook Form and Zod for forms and validation
- TanStack Query for fetching and updating server data
- FastAPI and PostgreSQL in the separate `suot-api` project

## How the projects fit together

Next.js serves the frontend on port 3000. The React app makes HTTP requests to FastAPI on port 8000, and FastAPI handles the database work.

```text
Browser / React UI -> suot-api / FastAPI -> PostgreSQL
       |
  served by Next.js
```

The frontend and backend have their own repositories and development servers. CORS is configured on the backend to allow requests from the local frontend.

## Running locally

You'll need Node.js and npm, plus a working local setup of `suot-api`. The installed Next.js version requires Node.js 20.9.0 or newer. Follow the backend's setup instructions for its Python environment, database, and migrations.

From the `suot-web` directory:

```shell
npm ci
```

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Leave off the trailing slash. This URL is visible to the browser, so don't put secrets in `NEXT_PUBLIC_` variables. Keep `.env.local` out of Git and restart the dev server after changing it.

In another terminal, start the configured backend from `suot-api`:

```shell
uv run python -m uvicorn app.main:app --reload
```

Then start the frontend from `suot-web`:

```shell
npm run dev
```

Go to [localhost:3000/register](http://localhost:3000/register), create an account, and sign in.

Other commands:

```shell
npm run lint
npm run build
npm run start
```

`start` serves the app after a successful build.

On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`, for example `npm.cmd run dev`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/login` |
| `/register` | Create an account, then go to login |
| `/login` | Sign in, then go to the closet |
| `/closet` | View items and add a new one |

The API requires authentication to read or create items. The frontend still needs better handling for missing or expired sessions; it currently shows a basic error when the closet request fails.

## What's working

Registration and login use React Hook Form with Zod validation. Login saves the JWT temporarily in localStorage, and the API helper attaches it to authenticated requests.

The closet displays items and a total count from `GET /items`, with loading and error messages. The Add Item form accepts name, category, color, and size, along with optional brand, price, purchase date, condition, and notes.

Item creation uses `useMutation`. Once `POST /items` succeeds, the form resets and invalidates `['items']`. TanStack Query refetches the active closet query, and React renders the updated data.

## Project structure

```text
src/
  app/
    layout.tsx                 Shared layout and QueryProvider
    page.tsx                   Redirect to login
    globals.css                Global styles
    register/page.tsx
    login/page.tsx
    closet/page.tsx
  components/
    query-provider.tsx         Shared query client
    closet/item-form.tsx       Add Item form
  lib/
    api.ts                     Requests to FastAPI
    auth.ts                    Access-token helper
  schemas/
    auth.ts                    Zod auth schemas
    item.ts                    Zod item schema
  types/
    auth.ts                    Auth request and response types
    item.ts                    Item, ItemPage, and ItemCreate
public/                        Static assets
```

## Working with the API

Requests live in `src/lib/api.ts`.

| Endpoint | Sent by the frontend | Returns |
| --- | --- | --- |
| `POST /auth/register` | JSON registration data | User |
| `POST /auth/login` | URL-encoded credentials | JWT and token type |
| `GET /items` | Bearer token | ItemPage |
| `POST /items` | Bearer token and JSON item data | Saved item |

Login has one detail that's easy to miss: the email is sent in a field called `username`, which is what the backend's `OAuth2PasswordRequestForm` expects.

Authenticated requests include:

```http
Authorization: Bearer <JWT>
```

The backend gets the owner from that token. The create request doesn't include a `user_id`.

`GET /items` returns an `ItemPage` object:

```json
{
  "items": [],
  "total": 0,
  "limit": 20,
  "offset": 0,
  "has_more": false
}
```

The list uses `items`, and the count uses `total`. The response already includes pagination details, but the frontend currently loads only the default page. Pagination controls still need to be built.

## Checking the current flow

With both servers running, register and sign in, then add an item to the closet. In the browser's Network panel, you should see a successful `POST /items` followed by `GET /items`. The total and returned list should update without manually reloading. Reload afterward to check that the item was saved.

If the API can't be reached, check the base URL, backend logs, and CORS settings. The allowed origin must match the address you're using: `localhost` and `127.0.0.1` are different hostnames.

## Still to do

Next up is showing closet stats from the existing `GET /items/stats` endpoint. After that:

- Pagination, filtering, and sorting
- Editing and deleting items
- Better form labels, validation, and error messages
- Logout and expired-session handling
- Automated tests for the main user flows
- Deployment setup

JWT storage in localStorage is **MVP-only** and needs to be revisited before real users. JavaScript can read the token, so an XSS vulnerability could expose it. Session handling and clearing cached data when accounts change also need work.

Price is still handled as text, and item validation is basic. The current flow has been checked manually; automated frontend tests aren't set up yet.

[DEVLOG.md](DEVLOG.md) tracks the work so far. [NOTES.md](NOTES.md) holds the concepts and details I want to remember.
