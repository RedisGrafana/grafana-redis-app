import React, { PureComponent } from 'react';
import { DataFrame, FieldType, getDisplayProcessor, PanelProps, toDataFrame } from '@grafana/data';
import { config } from '@grafana/runtime';
import { Table, TableSortByFieldState } from '@grafana/ui';
import { DisplayNameByFieldName, FieldName } from '../../constants';
import { PanelOptions, SeriesMap } from '../../types';

/**
 * Table Properties
 */
export interface Props extends PanelProps<PanelOptions> {
  /**
   * Data Frame
   *
   * @type {DataFrame}
   */
  dataFrame: DataFrame;

  /**
   * Series
   *
   * @type {SeriesMap}
   */
  seriesMap: SeriesMap;
}

/**
 * State
 */
interface State {
  /**
   * Sorted fields
   */
  sortedFields: TableSortByFieldState[];
}

/**
 * Redis Latency Panel
 */
export class RedisLatencyTable extends PureComponent<Props, State> {
  /**
   * Get table data frame
   * @param dataFrame
   * @param seriesMap
   */
  static getTableDataFrame(dataFrame: DataFrame, seriesMap: SeriesMap): DataFrame {
    const commandField = dataFrame.fields.find((field) => field.name === FieldName.Command);
    const commands = commandField?.values.toArray() || [];

    const latencyValues = commands.map((command: string) => {
      const seriesValues = seriesMap[command];
      if (seriesValues) {
        return seriesValues[seriesValues.length - 1].value;
      }
      return 0;
    });

    /**
     * Fields
     */
    const fields = [
      ...dataFrame.fields.map((field) => ({
        ...field,
        config: {
          ...(field?.config || {}),
          displayName: DisplayNameByFieldName[field.name as FieldName],
        },
      })),
      {
        name: FieldName.Latency,
        type: FieldType.number,
        values: latencyValues,
        config: {
          ...(dataFrame.fields.find((field) => field.name === FieldName.Duration)?.config || {}),
          displayName: DisplayNameByFieldName[FieldName.Latency],
        },
      },
    ];

    /**
     * Data Frame
     */
    const tableDataFrame = toDataFrame({
      name: 'TableDataFrame',
      fields,
    });

    /**
     * Set Fields
     */
    tableDataFrame.fields = tableDataFrame.fields.map((field) => ({
      ...field,
      display: getDisplayProcessor({ field, theme: config.theme2 }),
    }));

    /**
     * Return Data Frame
     */
    return tableDataFrame;
  }

  /**
   * State
   */
  state = {
    sortedFields: [{ displayName: DisplayNameByFieldName[FieldName.Latency], desc: true }],
  };

  /**
   * Change sort
   * @param sortedFields
   */
  onChangeSort = (sortedFields: TableSortByFieldState[]) => {
    this.setState({
      sortedFields,
    });
  };

  /**
   * Render
   */
  render() {
    const { width, height, dataFrame, seriesMap } = this.props;
    const { sortedFields } = this.state;

    /**
     * Return Table
     */
    return (
      <Table
        data={RedisLatencyTable.getTableDataFrame(dataFrame, seriesMap)}
        initialSortBy={sortedFields}
        width={width}
        height={height}
        onSortByChange={this.onChangeSort}
      />
    );
  }
}
