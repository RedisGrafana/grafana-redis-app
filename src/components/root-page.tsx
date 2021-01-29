import React, { PureComponent } from 'react';
import { Observable } from 'rxjs';
import {
  AppRootProps,
  DataQueryRequest,
  DataQueryResponse,
  DataQueryResponseData,
  Field,
  NavModelItem,
} from '@grafana/data';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { InfoBox } from '@grafana/ui';
import { RedisQuery } from '../redis-cli-panel/types';
import { DataSourceType, GlobalSettings, RedisCommand, RedisDataSourceInstanceSettings } from '../types';
import { DataSourceList } from './data-source-list';

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
      .then((result: any) => {
        return result.filter((ds: any) => {
          return ds.type === DataSourceType.REDIS;
        });
      });

    /**
     * Check supported commands for Redis Data Sources
     */
    await Promise.all(
      dataSources.map(async (ds: any) => {
        ds.commands = [];

        try {
          /**
           * Get Data Source
           */
          const redis = await getDataSourceSrv().get(ds.name);

          /**
           * Execute query
           */
          const query = ((redis.query({
            targets: [{ query: RedisCommand.COMMAND }],
          } as DataQueryRequest<RedisQuery>) as unknown) as Observable<DataQueryResponse>).toPromise();

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
        } catch (e) {
          /**
           * Workaround
           * Could be a case when dataSourceSrv does not contain a data source that was added via http api
           * We are unable to call updateFrontendSettings into plugins
           * https://github.com/grafana/grafana/blob/1d689888b0fc2de2dbed6e606eee19561a3ef006/public/app/features/datasources/state/actions.ts#L211
           */
          window.location.reload();
        }
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
      icon: 'fa fa-fw fa-database',
      active: true,
    });

    /**
     * Header
     */
    const node = {
      text: 'Redis Application',
      img: meta.info.logos.large,
      subTitle: 'Redis Data Source',
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
        <InfoBox title="Loading...">
          <p>Loading time depends on the number of configured data sources.</p>
        </InfoBox>
      );
    }

    return <DataSourceList dataSources={dataSources} />;
  }
}
