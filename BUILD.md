# How to install and build Grafana with Redis Application plug-in on RPM-based Linux

## Clone repository

```bash
git clone https://github.com/RedisGrafana/grafana-redis-app.git
```

## Install Grafana

- Follow [Install on RPM-based Linux](https://grafana.com/docs/grafana/latest/installation/rpm/) to install and start Grafana

- Open Grafana in web-browser `http://X.X.X.X:3000`

## Build Application

- Install the latest version of Node.js using [Node Version Manager](https://github.com/nvm-sh/nvm)

- Install `yarn` to build Application

```bash
npm install yarn -g
```

- Install dependencies

```bash
yarn install
```

- Build Application

```bash
yarn build
```

## Update Grafana Configuration

- Move distribution to Grafana's `plugins/` folder

```bash
mv dist/ /var/lib/grafana/plugins/redis-app
```

- Add `redis-app` to allowed unsigned plugins

```bash
vi /etc/grafana/grafana.ini
```

```
[plugins]
;enable_alpha = false
;app_tls_skip_verify_insecure = false
# Enter a comma-separated list of plugin identifiers to identify plugins that are allowed to be loaded even if they lack a valid signature.
allow_loading_unsigned_plugins = redis-app
```

- Verify that plugin registered

```bash
tail -100 /var/log/grafana/grafana.log
```

- Enable Redis Application in Grafana using `Configuration` -> `Plugins`

If you have questions, enhancement ideas or running into issues, please just open an issue on the repository: https://github.com/RedisGrafana/grafana-redis-app
