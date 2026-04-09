# AWS Deployment Guide (Option B)

This project is configured for:

- Frontend: S3 + CloudFront (`https://app.<your-domain>`)
- Backend: Elastic Beanstalk (`https://api.<your-domain>`)
- Database: RDS PostgreSQL

## 1) Backend deploy (Elastic Beanstalk)

From `finflow-backend`:

1. Build:
   - `./mvnw clean package`
2. Create zip bundle for EB:
   - include `target/*.jar` and `Procfile`
3. Create EB environment (Java 21 / Corretto platform recommended).
4. In EB environment variables, set:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://<rds-endpoint>:5432/finflowbackend`
   - `SPRING_DATASOURCE_USERNAME=<db-user>`
   - `SPRING_DATASOURCE_PASSWORD=<db-password>`
   - `GOOGLE_CLIENT_ID=<google-client-id>`
   - `GOOGLE_CLIENT_SECRET=<google-client-secret>`
   - `APP_SECURITY_ALLOWED_ORIGIN_PATTERNS=https://app.<your-domain>`
   - `APP_FRONTEND_DASHBOARD_URL=https://app.<your-domain>/app`
   - `APP_FRONTEND_COMPLETE_PROFILE_URL=https://app.<your-domain>/complete-profile`
5. Attach ACM cert + Route53 record so backend is served from `https://api.<your-domain>`.

Notes:
- The backend runs with profile `prod` via `Procfile`.
- Session cookie is configured for secure cross-origin usage in `application-prod.yml`.

## 2) Frontend deploy (S3 + CloudFront)

From `finflow-frontend`:

1. Set env file before build:
   - `VITE_API_BASE_URL=https://api.<your-domain>`
2. Build:
   - `npm ci`
   - `npm run build`
3. Upload `dist/` to S3 bucket.
4. Set CloudFront distribution origin to the S3 bucket and attach ACM cert for `app.<your-domain>`.

## 3) Google OAuth setup

In Google Cloud Console (OAuth client):

- Authorized JavaScript origins:
  - `https://app.<your-domain>`
- Authorized redirect URIs:
  - `https://api.<your-domain>/login/oauth2/code/google`

## 4) Security checklist

- Use AWS Secrets Manager or EB Secrets integration for sensitive values.
- Restrict RDS security group to only backend/EB security group.
- Keep backend CORS limited to frontend origin(s) only.
- Enforce HTTPS-only access to both app and api domains.
