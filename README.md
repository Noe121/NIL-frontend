
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


## Automated Integration Workflow
To validate frontend-backend integration automatically:

### 1. Environment Setup
- Ensure Node.js and npm are installed.
- Install dependencies in both `api-service` and `frontend`:
	```sh
	cd api-service && pip install -r requirements.txt
	cd ../frontend && npm install
	```
- Set the API URL for frontend integration (e.g., in `.env` or as an environment variable):
	```sh
	export REACT_APP_API_URL=http://localhost:8000/
	```

### 2. SSH Tunnel (Generalized)
Set up an SSH tunnel to your RDS or MySQL instance. Example:
	```sh
	ssh -i <your-key.pem> -L 3306:<your-rds-endpoint>:3306 ec2-user@<your-ec2-host>
	```
Replace `<your-key.pem>`, `<your-rds-endpoint>`, and `<your-ec2-host>` with your actual values.

### 3. Integration Workflow Script
Run the integration workflow script from the `frontend` directory:
	```sh
	./run_landingpage_integration.sh
	```
This script will:
- Start the backend FastAPI service (using Uvicorn)
- Run the integration test script (`test_landingpage_integration.js`)
- Stop the backend service

#### Dependencies
- Backend must be runnable via Uvicorn (see `api-service/src/main.py`)
- Integration test script (`test_landingpage_integration.js`) must exist in `frontend`
- SSH tunnel must be active for DB connectivity

## Deployment

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
