import React, { PureComponent } from 'react';
import { lastValueFrom, Observable } from 'rxjs';
import {
  AppRootProps,
  DataQueryRequest,
  DataQueryResponse,
  DataQueryResponseData,
  Field,
  NavModelItem,
} from '@grafana/data';
import { config, getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { Alert } from '@grafana/ui';
import { ApplicationName, ApplicationSubTitle, DataSourceType, RedisCommand } from '../../constants';
import { GlobalSettings, RedisDataSourceInstanceSettings, RedisQuery } from '../../types';
import { DataSourceList } from '../DataSourceList';

/**
 * Properties
 */
interface Props extends AppRootProps<GlobalSettings> {}

/**
 * State
 */
interface State {
  /**
   * Data sources
   *
   * @type {RedisDataSourceInstanceSettings[]}
   */
  dataSources: RedisDataSourceInstanceSettings[];

  /**
   * Loading
   *
   * @type {boolean}
   */
  loading: boolean;
}

/**
 * Root Page
 */
export class RootPage extends PureComponent<Props, State> {
  /**
   * Default state
   */
  state: State = {
    loading: true,
    dataSources: [],
  };

  /**
   * Mount
   */
  async componentDidMount() {
    this.updateNav();

    /**
     * Get data sources
     */
    const dataSources = await getBackendSrv()
      .get('/api/datasources')
      .then((result: RedisDataSourceInstanceSettings[]) => {
        return result.filter((ds: RedisDataSourceInstanceSettings) => {
          return ds.type === DataSourceType.REDIS;
        });
      });

    /**
     * Workaround, until reload function will be added to DataSourceSrv
     *
     * @see https://github.com/grafana/grafana/issues/30728
     * @see https://github.com/grafana/grafana/issues/29809
     */
    await getBackendSrv()
      .get('/api/frontend/settings')
      .then((settings: any) => {
        if (!settings.datasources) {
          return;
        }

        /**
         * Set data sources
         */
        config.datasources = settings.datasources;
        config.defaultDatasource = settings.defaultDatasource;
      });

    /**
     * Check supported commands for Redis Data Sources
     */
    await Promise.all(
      dataSources.map(async (ds: RedisDataSourceInstanceSettings) => {
        ds.commands = [];

        /**
         * Get Data Source
         */
        const redis = await getDataSourceSrv().get(ds.name);

        /**
         * Execute query
         */
        const dsQuery = redis.query({
          targets: [{ refId: 'A', query: RedisCommand.COMMAND }],
        } as DataQueryRequest<RedisQuery>) as unknown;

        const query = lastValueFrom(dsQuery as Observable<DataQueryResponse>);
        if (!query) {
          return;
        }

        /**
         * Get available commands
         */
        await query
          .then((response: DataQueryResponse) => response.data)
          .then((data: DataQueryResponseData[]) =>
            data.forEach((item: DataQueryResponseData) => {
              item.fields.forEach((field: Field) => {
                ds.commands.push(
                  ...field.values
                    .toArray()
                    .filter((value: string) => value.match(/\S+\.\S+|INFO/i))
                    .map((value) => value.toUpperCase())
                );
              });
            })
          )
          .catch(() => {});
      })
    );

    /**
     * Set state
     */
    this.setState({
      dataSources,
      loading: false,
    });
  }

  /**
   * Navigation
   */
  updateNav() {
    const { path, onNavChanged, meta } = this.props;
    const tabs: NavModelItem[] = [];

    /**
     * Home
     */
    tabs.push({
      text: 'Home',
      url: path,
      id: 'home',
      icon: 'fa fa-fw fa-home',
      active: true,
    });

    /**
     * Header
     */
    const node = {
      text: ApplicationName,
      img: meta.info.logos.large,
      subTitle: ApplicationSubTitle,
      url: path,
      children: tabs,
    };

    /**
     * Update the page header
     */
    onNavChanged({
      node: node,
      main: node,
    });
  }

  /**
   * Render
   */
  render() {
    const { loading, dataSources } = this.state;

    /**
     * Loading
     */
    if (loading) {
      return (
        <Alert title="Loading..." severity="info">
          <p>Loading time depends on the number of configured data sources.</p>
        </Alert>
      );
    }

    return <DataSourceList dataSources={dataSources} />;
  }
}
