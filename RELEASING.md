# Releasing

This document describes the steps to publish a new version of the Redis Application plugin.

## Prerequisites

### Grafana Cloud Access Policy Token

A `GRAFANA_ACCESS_POLICY_TOKEN` GitHub secret must be configured for plugin signing. To create one:

1. Log in to [Grafana Cloud](https://grafana.com) and go to **My Account → Security → Access Policies**.
2. Create an access policy with:
   - **Realm:** your org (all stacks)
   - **Scope:** `plugins:write`
3. Generate a token from the policy and save it.
4. Add the token as a repository secret in **GitHub → Settings → Secrets and variables → Actions** with the name `GRAFANA_ACCESS_POLICY_TOKEN`.

> The Grafana Cloud org slug must match the first part of the plugin ID (`redis`).

## Release steps

### 1. Update the changelog

Add a new section to `CHANGELOG.md` with the version number, date, and a summary of changes.

### 2. Bump the version

Update the `version` field in both `package.json` and `src/plugin.json`.

### 3. Create and push a tag

```bash
git tag v<VERSION>
git push origin v<VERSION>
```

This triggers the **Release** workflow (`.github/workflows/main.yml`) which:

- Installs dependencies and builds the plugin
- Builds the Go backend (if present)
- Signs the plugin using `GRAFANA_ACCESS_POLICY_TOKEN`
- Creates a GitHub release with the plugin ZIP and MD5 checksum attached

### 4. Docker images (automatic)

The **Docker** workflow (`.github/workflows/docker.yml`) runs nightly on a schedule. It builds and pushes `ghcr.io/redisgrafana/redis-app:latest` and `:master` images. No manual action is needed — images will be updated within 24 hours of a release.

To trigger it immediately, use **Actions → Docker → Run workflow** in GitHub.

### 5. Submit to the Grafana plugin catalog

After the release workflow completes:

1. Go to the [Grafana release](https://github.com/RedisGrafana/grafana-redis-app/releases) page and download the `.md5` file.
2. Open it to get the MD5 checksum (e.g., `0b54c4d72066c75af4b4412e993c4845`).
3. Go to the [Grafana plugin admin panel](https://grafana.com/orgs/redis/plugins) and submit a new version:
   - **URL:** the GitHub release download link for the `.zip` file
   - **Checksum:** the MD5 hash from the `.md5` file (hash only, not the filename)
4. The Grafana team will review the submission. You can track the status on the admin panel.

> Only MD5 and SHA1 checksums are accepted. Do not use the SHA256 hash shown on the GitHub release page.
