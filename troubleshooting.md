Troubleshooting & Resolution Summary
This document logs the architectural issues encountered during the setup of the Dockerized full-stack application (FastAPI backend, PostgreSQL database, and Nginx frontend) and the steps taken to resolve them.

1. Issues Encountered
Ubiquiti Network Noise (Port 8080 Conflict): The app initially mapped the frontend to port 8080, which happens to be the default port scanned/queried by local Ubiquiti network devices (sending encrypted binary payloads via AirControl Agent v1.0).

Nginx 404 Errors: Nginx was serving strictly static files and treated incoming API requests (/api/) and device inform requests (/inform) as local files on disk, resulting in 404 Not Found errors.

CORS Preflight Failures (400 Bad Request): The frontend JavaScript was configured with an absolute URL pointing directly to port 8000 (http://localhost:8000), triggering browser CORS preflight blocks and connection refusals.

2. Solutions Implemented
Configured Nginx Reverse Proxy (default.conf): Created a custom Nginx configuration to correctly route backend traffic:

Proxied /api/ requests to the FastAPI backend service (http://backend:8000).

Proxied /inform requests to the backend service.

Mounted default.conf into the frontend container using Docker volumes.

Port Reassignment (docker-compose.yml): Moved the frontend service away from port 8080 to port 3000 (3000:80) to completely eliminate local network device interference. Updated CORS_ORIGINS on the backend accordingly.

Added Backend Endpoints (main.py): Added a /inform handler endpoint in the FastAPI backend to gracefully accept incoming device pings.

Frontend Relative Path Fix (app.js): Updated the API_BASE variable to use a relative path (''), forcing all frontend fetch requests to route seamlessly through Nginx and bypassing browser CORS issues.