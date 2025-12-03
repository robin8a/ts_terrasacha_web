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

## Re-authenticate

If your session expires (e.g., after 12 hours), you can log in again using the aws sso login command:

```bash
# aws sso login --sso-session ts_terrasacha_admin_access
aws sso login --profile ts_terrasacha_admin_access
```

## Amplify

```sh
# Replace <sso-profile-name> with the profile name you created
amplify push --profile <sso-profile-name>
amplify pull --profile <sso-profile-name>
amplify status --profile <sso-profile-name>

amplify init --profile ts_terrasacha_admin_access


```