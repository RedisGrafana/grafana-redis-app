import React, { FC, useCallback } from 'react';
import { getBackendSrv, locationService } from '@grafana/runtime';
import { Alert, Button, Container, HorizontalGroup, LinkButton, VerticalGroup } from '@grafana/ui';
import { DataSourceName, DataSourceType, RedisCommand } from '../../constants';
import {
  HighAvailability,
  MultiLayerSecurity,
  RedisAI,
  RedisBloom,
  RedisCube,
  RediSearch,
  RedisGears,
  RedisGraph,
  RedisJSON,
  RedisTimeSeries,
} from '../../icons';
import { RedisDataSourceInstanceSettings } from '../../types';

/**
 * Properties
 */
interface Props {
  /**
   * Data sources
   *
   * @type {RedisDataSourceInstanceSettings[]}
   */
  dataSources: RedisDataSourceInstanceSettings[];
}

/**
 * Get unique name for a new data source
 * @param dataSources
 */
const getNewDataSourceName = (dataSources: RedisDataSourceInstanceSettings[]) => {
  let postfix = 1;
  const name = DataSourceName.REDIS;

  /**
   * Check if exists
   */
  if (!dataSources.some((dataSource) => dataSource.name === name)) {
    return name;
  }

  while (dataSources.some((dataSource) => dataSource.name === `${name}-${postfix}`)) {
    postfix++;
  }

  return `${name}-${postfix}`;
};

export const DataSourceList: FC<Props> = ({ dataSources }) => {
  const addNewDataSource = useCallback(() => {
    getBackendSrv()
      .post('/api/datasources', {
        name: getNewDataSourceName(dataSources),
        type: DataSourceType.REDIS,
        access: 'proxy',
      })
      .then(({ datasource }) => {
        locationService.push(`/datasources/edit/${datasource.uid}`);
      });
  }, [dataSources]);

  /**
   * Check if any data sources was added
   */
  if (dataSources.length === 0) {
    return (
      <div>
        <div className="page-action-bar">
          <div className="page-action-bar__spacer" />
          <Button onClick={addNewDataSource} icon="plus" variant="secondary">
            Add Redis Data Source
          </Button>
        </div>
        <Alert title="Please add Redis Data Sources." severity="info">
          <p>You can add as many data sources as you want to support multiple Redis databases.</p>
        </Alert>
      </div>
    );
  }

  /**
   * Return
   */
  return (
    <div>
      <div className="page-action-bar">
        <div className="page-action-bar__spacer" />
        <Button onClick={addNewDataSource} icon="plus" variant="secondary">
          Add Redis Data Source
        </Button>
      </div>

      <section className="card-section card-list-layout-list">
        <ol className="card-list">
          {dataSources.map((redis, index) => {
            const title = redis.commands?.length
              ? 'Working as expected'
              : "Can't retrieve a list of commands. Check that user has permissions to see a list of all commands.";
            const fill = redis.commands?.length ? '#DC382D' : '#A7A7A7';
            const url = redis.url ? redis.url : 'Not specified';

            return (
              <li className="card-item-wrapper" key={index} aria-label="check-card">
                <a className="card-item" href={`d/RpSjVqWMz/redis-overview?var-redis=${redis.name}`}>
                  <HorizontalGroup justify="space-between">
                    <HorizontalGroup justify="flex-start">
                      <Container margin="xs">
                        <RedisCube size={32} fill={fill} title={title} />
                      </Container>
                      <VerticalGroup>
                        <div className="card-item-name">{redis.name}</div>
                        <div className="card-item-sub-name">{url}</div>
                      </VerticalGroup>
                    </HorizontalGroup>

                    <HorizontalGroup justify="flex-end">
                      {!redis.commands?.length && (
                        <div className="card-item-header">
                          <div className="card-item-type">{title}</div>
                        </div>
                      )}
                      {(redis.jsonData['tlsAuth'] || redis.jsonData['acl']) && (
                        <Container>
                          <MultiLayerSecurity size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.jsonData['client']?.match(/cluster|sentinel/) && (
                        <Container>
                          <HighAvailability size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISGEARS) !== -1 && (
                        <Container>
                          <RedisGears size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISTIMESERIES) !== -1 && (
                        <Container>
                          <RedisTimeSeries size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISAI) !== -1 && (
                        <Container>
                          <RedisAI size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISEARCH) !== -1 && (
                        <Container>
                          <RediSearch size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISJSON) !== -1 && (
                        <Container>
                          <RedisJSON size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISGRAPH) !== -1 && (
                        <Container>
                          <RedisGraph size={24} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISBLOOM) !== -1 && (
                        <Container>
                          <RedisBloom size={24} fill={fill} />
                        </Container>
                      )}
                    </HorizontalGroup>

                    <HorizontalGroup justify="flex-end">
                      {redis.commands?.length && (
                        <Container>
                          <LinkButton
                            href={`d/_SGxCBNGk/redis-cli?var-redis=${redis.name}`}
                            title="Redis CLI"
                            icon="monitor"
                          >
                            CLI
                          </LinkButton>
                        </Container>
                      )}

                      {redis.commands?.indexOf(RedisCommand.REDISGEARS) !== -1 && (
                        <Container>
                          <LinkButton
                            href={`d/xFPiNzLMz/redis-gears?var-redis=${redis.name}`}
                            title="RedisGears"
                            icon="cog"
                          >
                            RedisGears
                          </LinkButton>
                        </Container>
                      )}

                      <Container>
                        <LinkButton
                          variant="secondary"
                          href={`datasources/edit/${redis.id}`}
                          title="Data Source Settings"
                          icon="sliders-v-alt"
                        >
                          Settings
                        </LinkButton>
                      </Container>
                    </HorizontalGroup>
                  </HorizontalGroup>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};
