# Configure AWS SSO CLI

ref: <https://www.fundamentals-of-devops.com/resources/2025/01/25/authenticate-to-aws-with-iam-identity-center/#authenticate-to-aws-on-the-command-line>

```bash
https://d-xxxxxxxxxx.awsapps.com/start/
https://d-9067d53b03.awsapps.com/start/

aws configure set region <new_region_code> --profile <profile_name>

# Example:
aws configure set region us-east-1 --profile dev-profile
aws configure set region eu-central-1 --profile ts_terrasacha_admin_access

```