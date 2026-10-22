# iOS TestFlight CI Setup

This repo now has a GitHub Actions workflow at
`.github/workflows/ios-testflight.yml` that builds the iOS app and uploads it
to TestFlight automatically on every push to `main`. It runs on GitHub's
macOS runners, which have a current Xcode — this Mac's old Xcode 14.2 is not
involved at all once this is set up.

## One-time setup: add these GitHub Secrets

Go to: **github.com/kemperdesign/jimmy-jam-app → Settings → Secrets and
variables → Actions → New repository secret**

Add each of these. The *value* for each comes from a local file in
`/tmp/jimmyjam-ci/` — open the file, copy its full contents, and paste as the
secret value. Never paste these into chat with Claude.

| Secret name | Value source |
|---|---|
| `BUILD_CERTIFICATE_BASE64` | Contents of `/tmp/jimmyjam-ci/dist_cert_base64.txt` |
| `P12_PASSWORD` | Contents of `/tmp/jimmyjam-ci/p12_password.txt` |
| `PROVISIONING_PROFILE_BASE64` | Contents of `/tmp/jimmyjam-ci/profile_base64.txt` |
| `APP_STORE_CONNECT_API_KEY_BASE64` | Contents of `/tmp/jimmyjam-ci/apikey_base64.txt` |
| `APP_STORE_CONNECT_KEY_ID` | `449MMK5Y23` |
| `APP_STORE_CONNECT_ISSUER_ID` | `cd523a02-688c-43d7-a167-eb87ba7dbd15` |
| `KEYCHAIN_PASSWORD` | Any password — this just protects a throwaway keychain created fresh on each CI run. Suggested: `LAnLsbGQfYWWfQq9Jy6sBIPprOzKMb/Z` (or generate your own with `openssl rand -base64 24`) |

## After adding secrets

Push to `main`, or go to the repo's **Actions** tab → "iOS TestFlight" →
**Run workflow** to trigger it manually. First run will take ~10-15 minutes
(installing dependencies, building, archiving, uploading). Watch the Actions
tab for progress and any errors.

Once it succeeds, the build appears in **App Store Connect → TestFlight**
within a few minutes (Apple does its own automated processing pass first).

## Cleanup

Once secrets are safely stored in GitHub, you can delete the local files in
`/tmp/jimmyjam-ci/` — they're in `/tmp` so they'll also clear automatically
on next reboot.
