# Security checklist
- Restrict SSH (22) to your IP. Expose only required HTTP/HTTPS ports.
- Do not expose PostgreSQL or Redis publicly.
- Keep `.env` mode 0600; never commit it or bake secrets into images.
- Use a dedicated deploy key and rotate credentials.
- Use GitHub Actions GITHUB_TOKEN for GHCR publishing; grant the host read-package access.
- Move production secrets to AWS Secrets Manager/SSM and use an EC2 instance role.
- Enable encrypted EBS and automated database backups.
- Use immutable commit-SHA tags for deployment and retain previous successful images.
