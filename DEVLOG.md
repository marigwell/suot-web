# Development Log


## Contents

- [Frontend setup](#frontend-setup)
- [Connecting to the API](#connecting-to-the-api)
- [Registration and login](#registration-and-login)
- [Loading the closet](#loading-the-closet)
- [Adding items](#adding-items)
- [Next up](#next-up)

## Frontend setup

Started `suot-web` with Next.js, React, TypeScript, and Tailwind CSS. Kept it separate from the existing `suot-api` backend.

Organized the source into pages, components, API helpers, schemas, and types. Added React Hook Form and Zod to handle forms and validation.

## Connecting to the API

Set up the API URL and tested a request to the backend's health endpoint. The browser initially blocked the connection because the frontend and backend used different ports.

Configured CORS in FastAPI to allow the local frontend. After that, the two projects could communicate through the browser.

## Registration and login

Built `/register` and `/login`, with validation and basic error messages. Registration sends JSON to the API, while login sends URL-encoded credentials with the email in the `username` field.

Successful login stores the JWT temporarily in localStorage and opens `/closet`. This storage approach is for the MVP and needs to be revisited before real users.

## Loading the closet

Added TanStack Query and a shared query provider. The closet uses `GET /items` with the Bearer token to load the current user's items.

Added `Item` and `ItemPage` types to match the response. The page displays the item list and total count, along with loading and error messages. Pagination details are included in the response, but the controls aren't built yet.

The first successful result was an empty closet showing zero items. That confirmed the login and authenticated read flow were connected.

## Adding items

Worked on the item form in `feature/item-create-ui`. Added the `ItemCreate` type, a Zod schema, and `createItem()` to send an authenticated `POST /items` request.

The form uses `useMutation`. After a successful save, it resets and invalidates `['items']`, which makes the closet fetch the updated list.

The manual test worked: the new item was saved and appeared without refreshing the page. Suot now supports creating an account, signing in, viewing items, and adding to the closet.

## Next up

Show closet statistics using the existing `GET /items/stats` endpoint. After that, work on pagination, better validation and error messages, session handling, and automated tests.

See [README.md](README.md) for setup and [NOTES.md](NOTES.md) for more detailed explanations.
