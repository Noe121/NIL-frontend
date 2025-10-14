
# NILbx Frontend

This is the frontend for NILbx.com, built with React and Vite. It provides a landing page, early access form, and integration with the NILbx backend API, hosted statically on S3 via CloudFront.

## Features
- Modern React SPA (Single Page Application)
- Styled landing page for athletes, sponsors, and fans
- Early access form (Formspree integration)
- API demo component for backend integration

## Getting Started
1. Install dependencies:
	```sh
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
	The app runs at http://localhost:5173

3. Build for production:
	```sh
	npm run build
	```
	Output is in `dist/` for static hosting (e.g., S3, CloudFront).

## Project Structure
- `src/` - React components and main app logic
- `public/` - Static assets
- `assets/` - Images, icons, styles
- `index.html` - Main HTML entry point

## API Integration
Connects to the backend API (`dev-api-service`) at the ALB DNS endpoint (retrieve from AWS Console > EC2 > Load Balancers > `dev-nilbx-alb`).
The API demo component in `src/ApiDemo.jsx` shows example usage (update with ALB DNS).

## Deployment
Build the project:
```sh
npm run build
```
Deploy `dist/` to the S3 bucket (`dev-nilbx-frontend`) via:
```sh
aws s3 cp dist/ s3://dev-nilbx-frontend/ --recursive --acl public-read
```
Verify at https://nilbx.com (after DNS propagation) or http://d2uhd59q6wvgwq.cloudfront.net (temporary).

## License
© 2025 NILbx.com. All rights reserved.
