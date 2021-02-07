# Redis Application plug-in for Grafana

![Application](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-app.png)

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
[![Redis Data Source](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Data%20Source&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-datasource)](https://grafana.com/grafana/plugins/redis-datasource)
[![Redis Application plug-in](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Application%20plug-in&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-app)](https://grafana.com/grafana/plugins/redis-app)
![CI](https://github.com/RedisGrafana/grafana-redis-app/workflows/CI/badge.svg)
![Docker](https://github.com/RedisGrafana/grafana-redis-app/workflows/Docker/badge.svg)
[![codecov](https://codecov.io/gh/RedisGrafana/grafana-redis-app/branch/master/graph/badge.svg?token=15SIRGU8SX)](https://codecov.io/gh/RedisGrafana/grafana-redis-app)

## Summary

- [**Introduction**](#introduction)
- [**Redis CLI panel**](#redis-cli-panel)
- [**Getting Started**](#getting-started)
- [**Feedback**](#feedback)
- [**Contributing**](#contributing)
- [**License**](#license)

## Introduction

### What is the Redis Application for Grafana?

The Redis Application, is a plug-in for Grafana that provides custom panels for [Redis Data Source](https://grafana.com/grafana/plugins/redis-datasource):

- Command line interface (CLI) panel
- Latency panel

### What Grafana version is supported?

Only Grafana 7.0 and later with a new plug-in platform supported.

### How to build Application

To learn how to build Redis Application plug-in and register in the new or existing Grafana please take a look at [BUILD](https://github.com/RedisGrafana/grafana-redis-app/blob/master/BUILD.md) instructions.

## Redis CLI panel

This panel provides [Redis command line interface](https://redis.io/topics/rediscli) that allows to send commands to Redis, and read the replies sent by the server, directly from the Grafana.

![CLI](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-cli-panel.png)

## Getting Started

### Install using `grafana-cli`

Use the `grafana-cli` tool to install from the commandline:

```bash
grafana-cli plugins install redis-app
```

### Run using `docker`

```bash
docker run -d -p 3000:3000 --name=grafana -e "GF_INSTALL_PLUGINS=redis-app" grafana/grafana
```

### Run using `docker-compose` for development

Application plug-in and Redis Data Source have to be built following [BUILD](https://github.com/RedisGrafana/grafana-redis-app/blob/master/BUILD.md) instructions before starting using `docker-compose-dev.yml` file.

Project provides `docker-compose-dev.yml` to start Redis with Redis Labs modules and Grafana 7.0.

```bash
docker-compose -f docker-compose-dev.yml up
```

### Open Grafana

Open Grafana in your browser, enable Redis Application plug-in and configure Redis Data Sources.

## Learn more

- [Real-time observability with Redis and Grafana](https://grafana.com/go/observabilitycon/real-time-observability-with-redis-and-grafana/)

## Feedback

We love to hear from users, developers and the whole community interested by this plug-in. These are various ways to get in touch with us:

- Ask a question, request a new feature and file a bug with [GitHub issues](https://github.com/RedisGrafana/grafana-redis-app/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/RedisGrafana/grafana-redis-app/blob/master/LICENSE).
