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
- [**Dashboards**](#dashboards)
- [**Custom panels**](#custom-panels)
- [**Getting Started**](#getting-started)
- [**Feedback**](#feedback)
- [**Contributing**](#contributing)
- [**License**](#license)

## Introduction

### What is the Redis Application for Grafana?

The Redis Application, is a plug-in for Grafana that provides application pages and custom panels for [Redis Data Source](https://grafana.com/grafana/plugins/redis-datasource):

- [**Command line interface (CLI)**](#redis-cli-panel)
- [**Command Latency (graph and table)**](#latency-panel)
- [**Keys consuming a lot of memory**](#keys-consuming-a-lot-of-memory-panel)
- [**Redis Gears**](#redis-gears-panel)

### What Grafana version is supported?

Only Grafana 7.1 and later with a new plug-in platform supported.

## Dashboards

Redis application plug-in includes Redis Overview, CLI and RedisGears dashboards. All dashboard are available from Application's icon in the left side menu.

![Redis-CLI-Dashboards](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-cli-dashboard.png)

Redis CLI dashboard combines Redis CLI with streaming panels to observe Redis database in real-time.

## Custom Panels

## Redis CLI panel

This panel provides [Redis command line interface](https://redis.io/topics/rediscli) that allows to send commands to Redis, and read the replies sent by the server, directly from the Grafana.

![CLI](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-cli-panel.png)

## Latency panel

Redis is often used in the context of demanding use cases, where it serves a large number of queries per second per instance, and at the same time, there are very strict latency requirements both for the average response time and for the worst case latency.

![Latency-Graph](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-latency-panel-graph.png)

This panel provides commands's latency based on [INFO COMMANDSTATS](https://redis.io/commands/info). Information is provide as chart and table.

![Latency-Table](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-latency-panel-table.png)

## Keys consuming a lot of memory panel

Do you want to know which keys consume a lot of memory in your Redis database? This panel is based on [SCAN](https://redis.io/commands/scan) and [MEMORY USAGE](https://redis.io/commands/memory-usage) commands to scan keys and sort results based on memory usage in the table format.

![Keys](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-keys-panel.png)

Please use this command in OFF-PEAK as it cause latency increase. Interval and count for SCAN command is configurable to keep latency under control.

## Redis Gears panel

[RedisGears](https://oss.redislabs.com/redisgears/) is a dynamic framework that enables developers to write and execute functions that implement data flows in Redis, while abstracting away the data’s distribution and deployment. This panel support Python syntax and allows to execute functions in blocking and non-blocking mode.

![RedisGears-Dashboard](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-app/master/src/img/redis-gears-dashboard.png)

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

### Run using `docker` the nightly build (UNSTABLE)

Supported platforms are:

- linux/amd64
- linux/arm64
- linux/arm

```bash
docker run -d -p 3000:3000 --name=redis-app ghcr.io/redisgrafana/redis-app:latest
```

### Run using `docker-compose` for development

Application plug-in and Redis Data Source have to be built following [BUILD](https://github.com/RedisGrafana/grafana-redis-app/blob/master/BUILD.md) instructions before starting.

Project provides `docker-compose/dev.yml` to start Redis with Redis Labs modules and Grafana 7.0.

```bash
docker-compose -f docker-compose/dev.yml up
```

### Open Grafana and enable Redis Application plug-in

Open Grafana in your browser, enable Redis Application plug-in and configure Redis Data Sources.

## Learn more

- [Real-time observability with Redis and Grafana](https://grafana.com/go/observabilitycon/real-time-observability-with-redis-and-grafana/)
- [Redis Data Source](https://grafana.com/grafana/plugins/redis-datasource)

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
