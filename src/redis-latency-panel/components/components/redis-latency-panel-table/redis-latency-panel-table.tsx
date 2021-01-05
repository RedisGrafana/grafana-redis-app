import React, { PureComponent } from 'react';
import { DataFrame, FieldType, getDisplayProcessor, toDataFrame } from '@grafana/data';
import { Table } from '@grafana/ui';
import { DisplayNameByFieldName, FieldName, SeriesMap, TableProps } from '../../../types';

/**
 * Redis Latency Panel
 */
export class RedisLatencyPanelTable extends PureComponent<TableProps, {}> {
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
      display: getDisplayProcessor({ field }),
    }));

    /**
     * Return Data Frame
     */
    return tableDataFrame;
  }

  /**
   * State
   */
  state = {};

  /**
   * Render
   */
  render() {
    const { width, height, dataFrame, seriesMap } = this.props;

    /**
     * Return Table
     */
    return (
      <Table
        data={RedisLatencyPanelTable.getTableDataFrame(dataFrame, seriesMap)}
        initialSortBy={[{ displayName: DisplayNameByFieldName[FieldName.Latency], desc: true }]}
        width={width}
        height={height}
      />
    );
  }
}
