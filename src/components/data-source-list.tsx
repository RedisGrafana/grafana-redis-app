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
} from 'icons';
import React, { FC } from 'react';
import { RedisCommand } from 'types';
import { Container, HorizontalGroup, InfoBox, LinkButton, VerticalGroup } from '@grafana/ui';

/**
 * Properties
 */
interface Props {
  /**
   * Data sources
   *
   * @type {any[]}
   */
  datasources?: any[];
}

export const DataSourceList: FC<Props> = ({ datasources }) => {
  /**
   * Check if any data sources was added
   */
  if (datasources?.length === 0) {
    return (
      <div>
        <div className="page-action-bar">
          <div className="page-action-bar__spacer" />
          <LinkButton href="datasources/new" icon="database">
            Add Redis Data Source
          </LinkButton>
        </div>
        <InfoBox title="Please add Redis Data Sources." url={'https://grafana.com/plugins/redis-datasource'}>
          <p>You can add as many data sources as you want to support multiple Redis databases.</p>
        </InfoBox>
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
        <LinkButton href="datasources/new" icon="database">
          Add Redis Data Source
        </LinkButton>
      </div>

      <section className="card-section card-list-layout-list">
        <ol className="card-list">
          {datasources?.map((redis, index) => {
            const title = redis.commands?.length ? 'Working as expected' : "Can't retrieve a list of commands";
            const fill = redis.commands?.length ? '#DC382D' : '#A7A7A7';

            return (
              <li className="card-item-wrapper" key={index} aria-label="check-card">
                <a className="card-item" href={`datasources/edit/${redis.id}`}>
                  <HorizontalGroup justify="space-between">
                    <HorizontalGroup justify="flex-start">
                      <Container margin="xs">
                        <RedisCube size={32} fill={fill} title={title} />
                      </Container>
                      <VerticalGroup>
                        <div className="card-item-name">{redis.name}</div>
                        <div className="card-item-sub-name">{redis.url}</div>
                      </VerticalGroup>
                    </HorizontalGroup>

                    <HorizontalGroup justify="flex-end">
                      {!redis.commands?.length && (
                        <div className="card-item-header">
                          <div className="card-item-type">{title}</div>
                        </div>
                      )}
                      {(redis.jsonData['tlsAuth'] || redis.jsonData['acl']) && (
                        <Container margin="xs">
                          <MultiLayerSecurity size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.jsonData['client']?.match(/cluster|sentinel/) && (
                        <Container margin="xs">
                          <HighAvailability size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISGEARS) !== -1 && (
                        <Container margin="xs">
                          <RedisGears size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISTIMESERIES) !== -1 && (
                        <Container margin="xs">
                          <RedisTimeSeries size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISAI) !== -1 && (
                        <Container margin="xs">
                          <RedisAI size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISEARCH) !== -1 && (
                        <Container margin="xs">
                          <RediSearch size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISJSON) !== -1 && (
                        <Container margin="xs">
                          <RedisJSON size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISGRAPH) !== -1 && (
                        <Container margin="xs">
                          <RedisGraph size={32} fill={fill} />
                        </Container>
                      )}
                      {redis.commands?.indexOf(RedisCommand.REDISBLOOM) !== -1 && (
                        <Container margin="xs">
                          <RedisBloom size={32} fill={fill} />
                        </Container>
                      )}
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
