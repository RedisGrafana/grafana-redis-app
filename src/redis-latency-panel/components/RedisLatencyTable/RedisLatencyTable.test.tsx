import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { dateTime, FieldType, toDataFrame } from '@grafana/data';
import { Table } from '@grafana/ui';
import { DisplayNameByFieldName, FieldName } from '../../constants';
import { RedisLatencyTable } from './RedisLatencyTable';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  config: { theme2: {} },
}));

jest.mock('@grafana/ui', () => {
  const React = require('react');
  const actual = jest.requireActual('@grafana/ui');
  const MockTable = jest.fn((props: any) => React.createElement('div', { 'data-testid': 'mock-table' }));
  return {
    ...actual,
    Table: MockTable,
  };
});

/**
 * Latency Table
 */
describe('RedisLatencyTable', () => {
  const renderComponent = ({ ref, ...props }: any = {}) => {
    const defaultProps = {
      width: 400,
      height: 300,
      dataFrame: toDataFrame({
        name: 'prev',
        fields: [
          {
            type: FieldType.string,
            name: FieldName.Command,
            values: ['get', 'info'],
          },
        ],
      }),
      seriesMap: {
        get: [
          {
            time: dateTime(),
            value: 1,
          },
        ],
      },
    };
    return render(<RedisLatencyTable ref={ref} {...defaultProps} {...props} />);
  };

  /**
   * getTableDataFrame
   */
  describe('getTableDataFrame', () => {
    it('Should add new column with latency values', () => {
      /**
       * Fields
       */
      const fields = [
        {
          type: FieldType.string,
          name: FieldName.Command,
          values: ['get', 'info'],
        },
      ];

      /**
       * Series
       */
      const seriesMap = {
        get: [
          {
            time: dateTime(),
            value: 1,
          },
        ],
      };

      /**
       * Data frame
       */
      const dataFrame = toDataFrame({
        name: 'prev',
        fields,
      });

      const tableDataFrame = RedisLatencyTable.getTableDataFrame(dataFrame, seriesMap);
      expect(tableDataFrame.name).toBe('TableDataFrame');
      expect(tableDataFrame.fields).toHaveLength(2);
      expect(tableDataFrame.fields[0].name).toBe(FieldName.Command);
      expect(tableDataFrame.fields[0].config.displayName).toBe(DisplayNameByFieldName[FieldName.Command]);
      expect(tableDataFrame.fields[0].values.toArray()).toEqual(['get', 'info']);
      expect(tableDataFrame.fields[1].name).toBe(FieldName.Latency);
      expect(tableDataFrame.fields[1].type).toBe(FieldType.number);
      expect(tableDataFrame.fields[1].config.displayName).toBe(DisplayNameByFieldName[FieldName.Latency]);
      expect(tableDataFrame.fields[1].values.toArray()).toEqual([1, 0]);
    });

    it('Should work without fails if no command field', () => {
      /**
       * Fields
       */
      const fields = [
        {
          type: FieldType.number,
          name: FieldName.Calls,
          values: [1, 2],
        },
      ];

      const seriesMap = {};

      /**
       * Data frame
       */
      const dataFrame = toDataFrame({
        name: 'prev',
        fields,
      });

      const tableDataFrame = RedisLatencyTable.getTableDataFrame(dataFrame, seriesMap);
      expect(tableDataFrame.name).toBe('TableDataFrame');
      expect(tableDataFrame.fields).toHaveLength(2);
      expect(tableDataFrame.fields[0].name).toBe(FieldName.Calls);
      expect(tableDataFrame.fields[0].config.displayName).toBe(DisplayNameByFieldName[FieldName.Calls]);
      expect(tableDataFrame.fields[1].name).toBe(FieldName.Latency);
      expect(tableDataFrame.fields[1].type).toBe(FieldType.number);
      expect(tableDataFrame.fields[1].values.toArray()).toEqual([undefined, undefined]);
    });
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('Should render table', () => {
      /**
       * Fields
       */
      const fields = [
        {
          type: FieldType.string,
          name: FieldName.Command,
          values: ['get', 'info'],
        },
      ];

      /**
       * Series
       */
      const seriesMap = {
        get: [
          {
            time: dateTime(),
            value: 1,
          },
        ],
      };

      /**
       * Data frame
       */
      const dataFrame = toDataFrame({
        name: 'prev',
        fields,
      });

      renderComponent({ dataFrame, seriesMap, width: 400, height: 300 });
      const mockTable = screen.getByTestId('mock-table');
      expect(mockTable).toBeInTheDocument();
    });
  });

  /**
   * Sorting
   */
  describe('Sorting', () => {
    it('Should set default sort and update sorting', async () => {
      /**
       * Fields
       */
      const fields = [
        {
          type: FieldType.string,
          name: FieldName.Command,
          values: ['get', 'info'],
        },
      ];

      /**
       * Series
       */
      const seriesMap = {
        get: [
          {
            time: dateTime(),
            value: 1,
          },
        ],
      };

      /**
       * Data frame
       */
      const dataFrame = toDataFrame({
        name: 'prev',
        fields,
      });

      const tableRef = createRef<RedisLatencyTable>();
      renderComponent({ ref: tableRef, dataFrame, seriesMap, width: 400, height: 300 });

      const sortedFields = [{ displayName: DisplayNameByFieldName[FieldName.Latency], desc: true }];
      const TableMock = Table as jest.Mock;
      const initialProps = TableMock.mock.calls[TableMock.mock.calls.length - 1][0];
      expect(initialProps.initialSortBy).toEqual(sortedFields);
      expect(tableRef.current!.state.sortedFields).toEqual(sortedFields);

      await act(async () => {
        initialProps.onSortByChange([{ displayName: DisplayNameByFieldName[FieldName.Duration], desc: true }]);
      });

      expect(tableRef.current!.state.sortedFields).toEqual([
        { displayName: DisplayNameByFieldName[FieldName.Duration], desc: true },
      ]);
    });
  });
});
