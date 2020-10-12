# Redis Application for Grafana

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**License**](#license)

## Introduction

### What is the Redis Application for Grafana?

The Redis Application, is a plug-in for Grafana that provides custom panels for (Redis Data Source)[https://grafana.com/grafana/plugins/redis-datasource].

### What is Grafana?

If you are not familiar with Grafana yet, it is a very popular tool used to build dashboards allowing to monitor applications, infrastructures and any kind of software components.

### What Grafana version is supported?

Only Grafana 7.0 and later with a new plug-in platform supported.

### What kind of panels it provides?

- Redis CLI panel with expirience similar to `redis-cli`.

## Getting Started

### Run using `docker-compose`

Project provides `docker-compose.yml` to start Redis with Redis Labs modules and Grafana 7.0.

**Start Redis and Grafana**

```bash
docker-compose up
```

### Open Grafana

Open Grafana in your browser and configure Redis Data Source. You can add as many data sources as you want to support multiple Redis databases.

## License

- Apache License Version 2.0, see [LICENSE](LICENSE)
