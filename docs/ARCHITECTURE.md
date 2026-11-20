# Frontend architecture and data flow

When you add a shirt, Suot checks the form, sends the details to the API, and fetches the updated closet. React updates the screen without a full page reload.

For setup and a demo walkthrough, see the [frontend guide](FRONTEND.md).

## Where the code lives

| Location | Job |
| --- | --- |
| [`src/app/`](../src/app/) | Pages, navigation, and the shared layout |
| [`src/components/closet/`](../src/components/closet/) | Add Item and Edit forms |
| [`src/lib/api.ts`](../src/lib/api.ts) | Send requests to FastAPI and attach login tokens |
| [`src/lib/auth.ts`](../src/lib/auth.ts) | Read the stored login token |
| [`src/schemas/`](../src/schemas/) | Zod rules for checking form input |
| [`src/types/`](../src/types/) | TypeScript definitions for API data |
| [`query-provider.tsx`](../src/components/query-provider.tsx) | Share TanStack Query's data cache across the app |

Next.js serves the app. The interactive pages use `"use client"` to handle input and browser storage. API requests go directly from the browser to FastAPI, which handles the database and ownership checks.

## Example: adding a shirt

1. **Check the form.** [`ItemForm`](../src/components/closet/item-form.tsx) uses React Hook Form to manage inputs and Zod to check required fields. A schema is a set of rules for valid data.
2. **Send the details.** The form changes blank optional fields to `null` and calls [`createItem`](../src/lib/api.ts). The helper sends `POST /items` with the login token.
3. **Save the item.** FastAPI checks the token, assigns ownership, saves the item, and returns it. The frontend does not send an owner ID.
4. **Refresh the closet.** After success, the form resets and asks TanStack Query to refresh `["items"]`. This is the name of the cached closet data—a local copy of the last response.
5. **Show the result.** [`ClosetPage`](../src/app/closet/page.tsx) fetches `GET /items` again and displays the new list and total count.

In the code, `useQuery` reads server data, `useMutation` manages a change such as saving or deleting, and `invalidateQueries` marks cached data as out of date so the active closet query refetches it.

## Login and ownership

The [login page](../src/app/login/page.tsx) sends the email and password to the API. The helper puts the email in a form field called `username`, as the backend expects.

The API returns a JWT—a signed login token. The page stores it as `access_token` in localStorage and opens `/closet`. Item requests include it in the `Authorization` header. FastAPI verifies the token and decides which items the user may access.

Without a valid session, the closet currently shows an error instead of redirecting to login.

## Editing and screen updates

React state holds temporary choices, such as which editor is open and the unsaved notes. TanStack Query holds the item data fetched from the API.

[`ItemEditForm`](../src/components/closet/item-edit-form.tsx) sends only the notes through `PATCH /items/{item_id}`. After success, it refreshes the closet and closes. Delete uses `DELETE /items/{item_id}` and refreshes the same list.

All item requests share the API helper, so URL and authorization handling stay in one place. Form schemas check input while the app runs; TypeScript types help check the code but do not validate the API's response at runtime.

See [current limitations](FRONTEND.md#current-limitations) for the remaining gaps.
