# Suot Web

Suot is a personal wardrobe app. This repository contains the Next.js frontend; the separate [Suot API](https://github.com/marigwell/suot-api) handles accounts and database storage.

This is a solo learning project built with React, TypeScript, Tailwind CSS, React Hook Form, Zod, and TanStack Query.

## What it does

- Register an account and sign in.
- View your closet and add clothing items.
- Edit an item's notes and delete items.
- Refresh the closet after successful changes without reloading the page.

Notes editing requires a backend with `PATCH /items/{item_id}`. The setup guide explains how to check this.

## Start here

| I want to… | Read |
| --- | --- |
| Run the app and try it | [Frontend guide](docs/FRONTEND.md) |
| Understand how the code connects | [Architecture and data flow](docs/ARCHITECTURE.md) |
| Check my changes | [Checks](docs/FRONTEND.md#checking-changes) |
| See what still needs work | [Current limitations](docs/FRONTEND.md#current-limitations) |

## Development notes

[DEVLOG.md](DEVLOG.md) records development history. [NOTES.md](NOTES.md) contains personal learning notes. Use the guides above for the current frontend.
