# Suot frontend

## Overview

Suot Web lets you manage clothing through a browser. The frontend displays your closet and sends requests to FastAPI, which saves the data and checks item ownership.

## Running locally

You need Git, **Node.js 20.9.0 or newer**, npm, and a working local Suot API.

### 1. Start the backend

Follow the setup instructions in the [Suot API repository](https://github.com/marigwell/suot-api) for the database, environment variables, and migrations. Leave the API running at `http://localhost:8000` in a separate terminal.

Open [Swagger UI](http://localhost:8000/docs) and check for **`PATCH /items/{item_id}`** before trying notes editing. A backend that only supports `PUT` cannot handle this form, which sends only the notes field.

### 2. Install and configure the frontend

```shell
git clone https://github.com/marigwell/suot-web.git
cd suot-web
npm ci
```

If you already have the repository, run `npm ci` from its root.

Create `.env.local` in the repository root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Use the API's base URL without a trailing slash. This value is visible to the browser; keep backend secrets out of it. The file is ignored by Git. Restart the development server after changing it.

### 3. Start the frontend

```shell
npm run dev
```

Open [registration](http://localhost:3000/register). Keep the frontend on port **3000**, which the backend allows by default. Stop it with Ctrl+C.

On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd` instead, such as `npm.cmd run dev`.

## How it works

```text
Browser form → frontend API helper → FastAPI → PostgreSQL
```

After an item is saved, the frontend fetches the updated closet and refreshes the screen. See [architecture and data flow](ARCHITECTURE.md) for a walkthrough with links to the code.

## Using the app

| Page | Purpose |
| --- | --- |
| `/` | Redirect to login |
| `/register` | Create an account, then go to login |
| `/login` | Sign in, then open the closet |
| `/closet` | View items, add items, edit notes, and delete items |

Try this with a new local account and a disposable item:

1. **Register and sign in.** Use your email and password to log in. Registration does not sign you in automatically.
2. **Add a shirt.** Enter a name, category, color, and size, then click **Add Item**. The form clears and the closet list and count refresh. Reload to confirm the item was saved.
3. **Edit its notes.** Click **Edit**, enter a note, and click **Save**. The editor closes after success. Reload and reopen Edit to check the saved note.
4. **Delete the demo item.** Click **Delete**. There is no confirmation prompt; the list and count refresh after success.

Name, category, color, and size are required. Brand, price, purchase date, condition, and notes are optional. Blank optional fields are sent as `null`; prices are sent as text and dates use `YYYY-MM-DD`.

Edit currently changes **notes only**. Saving empty notes clears them. Cancel closes the editor without saving. Closet cards display the item's name, brand, and category.

## Checking changes

From the frontend repository root:

```shell
npm run lint
npm run build
```

These check code rules and compilation. There is no automated frontend test suite yet, so also repeat the walkthrough above. Add **two items in a row** to check that the form still submits after resetting.

In the browser's Network panel, successful create, edit, and delete requests should be followed by `GET /items`. To preview a production build locally, run `npm run start` after building, with the API still running. Changing the API URL requires rebuilding that production bundle.

## Troubleshooting

| Problem | Check |
| --- | --- |
| API requests fail | Confirm the API is running and `.env.local` has the correct URL. Restart the frontend after changing it. |
| CORS error | CORS controls which browser origins may call the API. The backend allows `http://localhost:3000` and `http://127.0.0.1:3000`; another address needs backend configuration. |
| Closet will not load | Sign in first. If requests return 401, sign in again to get a fresh token. |
| Notes will not save | Check that the API supports `PATCH /items/{item_id}`. A 405 response can mean you are running a version with only `PUT`. |
| A form fails with an unclear message | Check the browser's Network panel and backend logs. The UI currently hides detailed API errors. |

## Current limitations

- Editing is limited to notes. Filtering, sorting, pagination controls, and closet statistics are not displayed. The closet loads only the first page, up to 20 items by default.
- Login tokens are stored in localStorage, which browser JavaScript can read. Logout, token refresh, and automatic login redirects for expired sessions are not implemented.
- Switching accounts does not explicitly clear the cached closet data. Session handling needs further work.
- Form validation is basic, including no numeric price validation in the frontend. Edit and delete failures do not yet show an error message.
