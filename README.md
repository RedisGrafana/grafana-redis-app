# Redis Application for Grafana

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**Feedback**](#feedback)
- [**Contributing**](#contributing)
- [**License**](#license)

## Introduction

### What is the Redis Application for Grafana?

The Redis Application, is a plug-in for Grafana that provides custom panels for [Redis Data Source](https://grafana.com/grafana/plugins/redis-datasource).

### What is the Redis Data Source for Grafana?

If you’re not familiar with Grafana, it’s a very popular tool used to build dashboards to monitor applications, infrastructures, and software components. The Redis Data Source for Grafana is a plug-in that allows users to connect to the Redis database and build dashboards in Grafana to easily monitor Redis and application data. It provides an out-of-the-box predefined dashboard, but also lets you build customized dashboards tuned to your specific needs.

### What Grafana version is supported?

Only Grafana 7.0 and later with a new plug-in platform supported.

### What kind of panels it provides?

- Redis CLI panel with expirience similar to [redis-cli](https://redis.io/topics/rediscli).

## Getting Started

### Run using `docker-compose`

Project provides `docker-compose.yml` to start Redis with Redis Labs modules and Grafana 7.0.

```bash
docker-compose up
```

### Open Grafana

Open Grafana in your browser, configure Redis Data Source and enable Redis Application plug-in. You can add as many data sources as you want to support multiple Redis databases.

## Feedback

We love to hear from users, developers and the whole community interested by this plug-in. These are various ways to get in touch with us:

- Ask a question, request a new feature and file a bug with [GitHub issues](https://github.com/RedisGrafana/grafana-redis-app/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](LICENSE).
