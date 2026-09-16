# suot-web

Suot is a fashion inventory app for keeping track of your clothes. This repository contains the Next.js frontend. It connects to `suot-api`, a separate FastAPI backend backed by PostgreSQL.

Right now, you can create an account, sign in, view your closet, and add items. After adding an item, the closet updates without a page refresh.

I'm building Suot to get more experience taking a feature from the database through to a working interface. It's still an MVP, with more work needed on authentication, validation, and the UI before it's ready for real users.

## Contents

- [Stack](#stack)
- [Running locally](#running-locally)
- [Routes](#routes)
- [What's working](#whats-working)
- [Still to do](#still-to-do)

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS for styling
- React Hook Form and Zod for forms and validation
- TanStack Query for fetching and updating server data
- FastAPI and PostgreSQL in the separate `suot-api` project

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

## Still to do

Next up is showing closet stats from the existing `GET /items/stats` endpoint. After that:

- Pagination, filtering, and sorting
- Editing and deleting items
- Better form labels, validation, and error messages
- Logout and expired-session handling
- Automated tests for the main user flows
- Deployment setup

[DEVLOG.md](DEVLOG.md) tracks the work so far. [NOTES.md](NOTES.md) holds the concepts and details I want to remember.
