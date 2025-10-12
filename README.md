# NIL Frontend

This project is structured for static content hosting (e.g., via S3) and can easily transition to a dynamic web application.

## Structure
- `public/`: Static assets for deployment (images, fonts, etc.)
- `src/`: Source code for dynamic app (JS/TS, React, etc.)
- `assets/`: Additional resources (icons, etc.)
- `index.html`: Entry point for static site

## Getting Started
- Place static content in `public/` for S3 hosting.
- For dynamic app, add code in `src/` and update `index.html` as needed.

## Transitioning to Dynamic
- React and Vite are included for dynamic frontend development.
- Add React components in `src/` (see `main.jsx`).
- Use Vite for local development and building:
	- `npm run dev` to start local server
	- `npm run build` to create production assets
- Update or add other tools as needed (e.g., testing, linting).
