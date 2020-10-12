import React, { PureComponent } from 'react';
import { RedisQuery } from 'redis-cli-panel/types';
import { Observable } from 'rxjs';
import { map as map$, switchMap as switchMap$ } from 'rxjs/operators';
import { AppRootProps, DataFrame, DataQueryRequest, DataQueryResponse, NavModelItem } from '@grafana/data';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { HorizontalGroup, Icon, InfoBox, VerticalGroup } from '@grafana/ui';
import { GlobalSettings } from '../types';

/**
 * Properties
 */
interface Props extends AppRootProps<GlobalSettings> {}

/**
 * State
 */
interface State {
  datasources: any[];
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
    datasources: [],
    loading: true,
  };

  /**
   * Mount
   */
  async componentDidMount() {
    this.updateNav();

    /**
     * Get data sources
     */
    const datasources = await getBackendSrv()
      .get('/api/datasources')
      .then((result: any) => {
        return result.filter((ds: any) => {
          return ds.type === 'redis-datasource';
        });
      });

    /**
     * Check supported commands
     */
    await datasources.map(async (ds: any) => {
      /**
       * Get Data Source
       */
      const redis = await getDataSourceSrv().get(ds.name);

      /**
       * Get available commands
       */
      ds.commands = await ((redis.query({
        targets: [{ query: 'command' }],
      } as DataQueryRequest<RedisQuery>) as unknown) as Observable<DataQueryResponse>)
        .pipe(
          switchMap$((response) => response.data),
          switchMap$((data: DataFrame) => data.fields),
          map$((field) =>
            field.values
              .toArray()
              .map((value) => {
                return value;
              })
              .filter((value) => value.match(/\S+\.\S+/))
          )
        )
        .toPromise();
    });

    /**
     * Set state
     */
    this.setState({
      datasources,
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
     * Tab
     */
    tabs.push({
      text: 'Home',
      url: path,
      id: 'home',
      active: true,
    });

    /**
     * Header
     */
    const node = {
      text: 'Redis Application',
      img: meta.info.logos.large,
      subTitle: 'Redis Data Source Manager',
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
    const { loading, datasources } = this.state;

    if (datasources.length === 0) {
      return (
        <InfoBox title="Redis Data Sources are not configured." url={'https://grafana.com/plugins/redis-datasource'}>
          <p>
            Go to Configuration -&gt; Data Sources to add Redis Data Sources. You can add as many data sources as you
            want to support multiple Redis databases.
          </p>
        </InfoBox>
      );
    }

    /**
     * Loading
     */
    if (loading) {
      return <div>Loading...</div>;
    }

    /**
     * Return
     */
    return (
      <div>
        <section className="card-section card-list-layout-list">
          <ol className="card-list">
            {datasources.map((redis, index) => {
              return (
                <li className="card-item-wrapper" key={index} aria-label="check-card">
                  <a className="card-item" href={`/datasources/edit/${redis.id}`}>
                    <HorizontalGroup justify="space-between">
                      <div className="card-item-body">
                        {redis.commands && (
                          <figure className="card-item-figure">
                            <Icon
                              name={redis.commands?.length ? 'heart' : 'heart-break'}
                              size="xxl"
                              className={`alert-rule-item__icon alert-state-${
                                redis.commands?.length ? 'ok' : 'warning'
                              }`}
                            />
                          </figure>
                        )}
                        <VerticalGroup>
                          <div className="card-item-name">{redis.name}</div>
                          <div className="card-item-sub-name">{redis.url}</div>
                        </VerticalGroup>
                      </div>
                    </HorizontalGroup>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    );
  }
}
