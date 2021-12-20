import React, { PureComponent } from 'react';
import { lastValueFrom, Observable } from 'rxjs';
import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceRef,
  DateTime,
  dateTime,
  PanelProps,
} from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { RedisQuery } from '../../../types';
import { DefaultInterval, DisplayNameByFieldName, FieldName, MaxItemsPerSeries } from '../../constants';
import { PanelOptions, SeriesMap, ValuesForCalculation } from '../../types';
import { RedisCPUGraph } from '../RedisCPUGraph';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * State
 */
interface State {
  /**
   * Values
   *
   * @type {ValuesForCalculation}
   */
  values?: ValuesForCalculation;

  /**
   * Series
   *
   * @type {SeriesMap}
   */
  seriesMap: SeriesMap;
}

/**
 * Redis CPU Panel
 */
export class RedisCPUPanel extends PureComponent<Props, State> {
  /**
   * Get Values
   *
   * @param dataFrame {DataFrame} Data Frame
   */
  static getValuesForCalculation(dataFrame: DataFrame): ValuesForCalculation {
    const userField = dataFrame.fields.find((field) => field.name === FieldName.User);
    const systemField = dataFrame.fields.find((field) => field.name === FieldName.System);

    /**
     * Return Values
     */
    return {
      time: dateTime(),
      user: userField?.values.toArray().map((value) => value)[0],
      system: systemField?.values.toArray().map((value) => value)[0],
    };
  }

  /**
   * Get updated series map and limit max items per series
   * @param seriesMap
   * @param values
   * @param newValues
   * @param itemsLimit
   */
  static getSeriesMap(
    seriesMap: SeriesMap,
    values: ValuesForCalculation,
    newValues: ValuesForCalculation,
    itemsLimit = 1000
  ): SeriesMap {
    const result = {
      ...seriesMap,
    };

    const user = ((newValues.user - values.user) / (newValues.time.diff(values.time) / 1000)) * 100;
    const system = ((newValues.system - values.system) / (newValues.time.diff(values.time) / 1000)) * 100;
    const dt = dateTime();

    /**
     * Calculate Usage
     */
    const value: { [id: string]: { time: DateTime; value: number } } = {
      user: {
        time: dt,
        value: user >= 0 ? user : 0,
      },
      system: {
        time: dt,
        value: system >= 0 ? system : 0,
      },
    };

    Object.keys(DisplayNameByFieldName).forEach((id) => {
      if (!result[id]) {
        result[id] = [value[id]];
      } else if (result[id].length + 1 > itemsLimit) {
        result[id] = [...result[id].slice(1, result[id].length), value[id]];
      } else {
        result[id] = result[id].concat(value[id]);
      }
    });

    return result;
  }

  /**
   * State
   */
  state: State = {
    seriesMap: {},
  };

  /**
   * Request Data Timer
   */
  requestDataTimer?: NodeJS.Timeout | undefined;

  /**
   * Mount
   */
  componentDidMount(): void {
    this.updateData();

    if (this.props.options.interval !== undefined) {
      this.setRequestDataInterval();
    }
  }

  /**
   * Update
   */
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (prevProps.options.interval !== this.props.options.interval) {
      this.setRequestDataInterval();
    }
  }

  /**
   * Unmount
   */
  componentWillUnmount(): void {
    this.clearRequestDataInterval();
  }

  /**
   * makeQuery using request.targets with default commands
   */
  async makeQuery(): Promise<DataQueryResponse | null> {
    const targets = this.props.data.request?.targets;
    let datasource: string | DataSourceRef = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    }

    if (!datasource || !targets) {
      return Promise.resolve(null);
    }

    /**
     * Data Source
     */
    const ds = await getDataSourceSrv().get(datasource);

    /**
     * Override default values if was set query params
     */
    const targetsWithCommands = targets.map((target: RedisQuery) => ({
      command: 'info',
      section: 'cpu',
      ...target,
    }));

    const query = ds.query({
      ...this.props.data.request,
      targets: targetsWithCommands,
    } as DataQueryRequest<RedisQuery>) as unknown;

    return lastValueFrom(query as Observable<DataQueryResponse>);
  }

  /**
   * Request data and update dataFrame and seriesMap in state
   */
  async updateData() {
    const response = await this.makeQuery();

    if (response === null) {
      return Promise.resolve();
    }

    let { values, seriesMap } = this.state;

    /**
     * New Data Frame
     */
    const newDataFrame = response.data[0] as DataFrame;
    if (!newDataFrame) {
      return Promise.resolve();
    }

    /**
     * Get Values
     */
    const newValues = RedisCPUPanel.getValuesForCalculation(newDataFrame);
    if (!values) {
      values = newValues;
    }

    /**
     * Update Series Map
     */
    const itemsLimit = this.props.options.maxItemsPerSeries || MaxItemsPerSeries;
    const newSeriesMap = RedisCPUPanel.getSeriesMap(seriesMap, values, newValues, itemsLimit);

    /**
     * Set State
     */
    this.setState({
      values: newValues,
      seriesMap: newSeriesMap,
    });
  }

  /**
   * Request Interval
   */
  setRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      this.clearRequestDataInterval();
    }

    /**
     * Interval
     */
    this.requestDataTimer = setInterval(() => {
      /**
       * Update data
       */
      this.updateData();
    }, this.props.options.interval || DefaultInterval);
  }

  /**
   * Clear Interval
   */
  clearRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      clearTimeout(this.requestDataTimer);
      delete this.requestDataTimer;
    }
  }

  /**
   * Render
   */
  render() {
    const { height } = this.props;
    const { seriesMap } = this.state;

    return <RedisCPUGraph {...this.props} height={height} seriesMap={seriesMap} />;
  }
}
