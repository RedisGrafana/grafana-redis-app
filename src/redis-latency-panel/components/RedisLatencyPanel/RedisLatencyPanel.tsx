import React, { ChangeEvent, createRef, PureComponent, RefObject } from 'react';
import { lastValueFrom, Observable } from 'rxjs';
import { css } from '@emotion/css';
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
import { Label, RadioButtonGroup, Switch } from '@grafana/ui';
import { RedisQuery } from '../../../types';
import { DefaultInterval, FieldName, MaxItemsPerSeries, ViewMode, ViewModeOptions } from '../../constants';
import { PanelOptions, SeriesMap, ValuesForCalculation } from '../../types';
import { RedisLatencyGraph } from '../RedisLatencyGraph';
import { RedisLatencyTable } from '../RedisLatencyTable';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * State
 */
interface State {
  /**
   * Data Frame
   *
   * @type {DataFrame}
   */
  dataFrame?: DataFrame;

  /**
   * Series
   *
   * @type {SeriesMap}
   */
  seriesMap: SeriesMap;

  /**
   * Form height
   */
  formHeight: number;
}

/**
 * Redis Latency Panel
 */
export class RedisLatencyPanel extends PureComponent<Props, State> {
  /**
   * Calc latency value per command
   * @param duration
   * @param prevDuration
   * @param calls
   * @param prevCalls
   */
  static getLatencyValue({
    duration,
    prevDuration,
    calls,
    prevCalls,
  }: {
    duration: number;
    prevDuration?: number;
    calls: number;
    prevCalls?: number;
  }): number {
    if (prevDuration === undefined || prevCalls === undefined) {
      return duration / calls;
    }

    /**
     * Calculate
     */
    const diffDuration = duration - prevDuration;
    const diffCalls = calls - prevCalls;
    if (diffCalls <= 0 || diffDuration < 0) {
      return 0;
    }

    /**
     * Return Latency
     */
    return diffDuration / diffCalls;
  }

  /**
   * Get Values
   *
   * @param dataFrame {DataFrame} Data Frame
   */
  static getValuesForCalculation(dataFrame: DataFrame): ValuesForCalculation {
    const numberOfCallsField = dataFrame.fields.find((field) => field.name === FieldName.Calls);
    const totalDurationField = dataFrame.fields.find((field) => field.name === FieldName.Duration);

    /**
     * Result
     */
    const result: ValuesForCalculation = {
      calls: [],
      duration: [],
    };

    if (numberOfCallsField) {
      result.calls = numberOfCallsField.values.toArray().map((value) => value);
    }

    if (totalDurationField) {
      result.duration = totalDurationField.values.toArray().map((value) => value);
    }

    return result;
  }

  /**
   * Calc latency values
   * @param prevValues
   * @param currentValues
   * @param rowsCount
   */
  static getLatencyValues(
    prevValues: ValuesForCalculation,
    currentValues: ValuesForCalculation,
    rowsCount: number
  ): number[] {
    const latencyValues: number[] = [];

    /**
     * Processing rows
     */
    for (let row = 0; row < rowsCount; row++) {
      const prevDuration = prevValues.duration[row];
      const duration = currentValues.duration[row];
      const prevCalls = prevValues.calls[row];
      const calls = currentValues.calls[row];

      latencyValues.push(
        RedisLatencyPanel.getLatencyValue({
          prevDuration,
          duration,
          prevCalls,
          calls,
        })
      );
    }

    return latencyValues;
  }

  /**
   * Get updated series map and limit max items per series
   * @param seriesMap
   * @param dataFrame
   * @param values
   * @param time
   * @param itemsLimit
   */
  static getSeriesMap(
    seriesMap: SeriesMap,
    dataFrame: DataFrame,
    values: any[],
    time: DateTime,
    itemsLimit = 1000
  ): SeriesMap {
    const commandField = dataFrame.fields.find((field) => field.name === FieldName.Command);
    const commands = commandField?.values.toArray() || [];
    const result = {
      ...seriesMap,
    };

    commands.forEach((command: string, index: number) => {
      const value = {
        time,
        value: values[index],
      };

      if (!result[command]) {
        result[command] = [value];
      } else if (result[command].length + 1 > itemsLimit) {
        /**
         * Remove 1 item if length > itemsLimit
         */
        result[command] = [...result[command].slice(1, result[command].length), value];
      } else {
        result[command] = result[command].concat(value);
      }
    });

    return result;
  }

  /**
   * State
   */
  state: State = {
    seriesMap: {},
    formHeight: 0,
  };

  /**
   * Form html element
   */
  formRef: RefObject<HTMLDivElement> = createRef();

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

    if (this.formRef.current) {
      this.setState({
        formHeight: this.formRef.current.getBoundingClientRect().height,
      });
    }
  }

  /**
   * Update
   */
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (prevProps.options.interval !== this.props.options.interval) {
      this.setRequestDataInterval();
    }

    if (prevProps.options !== this.props.options || prevProps.width !== this.props.width) {
      if (this.formRef.current) {
        this.setState({
          formHeight: this.formRef.current.getBoundingClientRect().height,
        });
      }
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
      section: 'commandstats',
      type: 'command',
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

    const { dataFrame, seriesMap } = this.state;
    const newDataFrame = response.data[0] as DataFrame;

    if (!newDataFrame) {
      return Promise.resolve();
    }

    const latencyValues = RedisLatencyPanel.getLatencyValues(
      RedisLatencyPanel.getValuesForCalculation(dataFrame ? dataFrame : newDataFrame),
      RedisLatencyPanel.getValuesForCalculation(newDataFrame),
      newDataFrame.length
    );

    const lastUpdatedTime = dateTime();
    const itemsLimit = this.props.options.maxItemsPerSeries || MaxItemsPerSeries;

    const newSeriesMap = RedisLatencyPanel.getSeriesMap(
      seriesMap,
      newDataFrame,
      latencyValues,
      lastUpdatedTime,
      itemsLimit
    );

    this.setState({
      dataFrame: newDataFrame,
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
   * Change view mode
   * @param event
   */
  onChangeViewMode = (event?: ViewMode) => {
    if (event === undefined) {
      return;
    }

    const { onOptionsChange, options } = this.props;

    onOptionsChange({
      ...options,
      viewMode: event,
    });
  };

  /**
   * Change hide zero options
   * @param event
   */
  onChangeHideZero = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;

    onOptionsChange({
      ...options,
      hideZero: event.target.checked,
    });
  };

  /**
   * Render
   */
  render() {
    const { options, height } = this.props;
    const { dataFrame, seriesMap, formHeight } = this.state;

    let component = null;
    const contentHeight = height - formHeight;

    /**
     * Check for data frames
     */
    if (dataFrame) {
      if (options.viewMode === ViewMode.Table) {
        component = (
          <RedisLatencyTable {...this.props} height={contentHeight} dataFrame={dataFrame} seriesMap={seriesMap} />
        );
      }
      if (options.viewMode === ViewMode.Graph) {
        component = <RedisLatencyGraph {...this.props} height={contentHeight} seriesMap={seriesMap} />;
      }
    }

    return (
      <>
        <div className="gf-form-inline" style={{ paddingBottom: 12 }} ref={this.formRef}>
          <RadioButtonGroup value={options.viewMode} options={ViewModeOptions} onChange={this.onChangeViewMode} />

          {options.viewMode === ViewMode.Graph && (
            <div
              className={css`
                display: flex;
                align-items: center;
                margin: 4px 0 4px 8px;
              `}
            >
              <Switch value={options.hideZero} onChange={this.onChangeHideZero} />
              <Label
                className={css`
                  margin: 0 0 0 4px;
                `}
              >
                Hide commands which have only zero values
              </Label>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', height: contentHeight }}>{component}</div>
      </>
    );
  }
}
