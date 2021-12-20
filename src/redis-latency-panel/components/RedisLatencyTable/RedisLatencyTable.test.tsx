import { shallow } from 'enzyme';
import React from 'react';
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

/**
 * Latency Table
 */
describe('RedisLatencyTable', () => {
  const getComponent = (props: any = {}) => <RedisLatencyTable {...props} />;

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
      const expectedDataFrame = toDataFrame({
        name: 'TableDataFrame',
        fields: [
          ...fields,
          {
            type: FieldType.number,
            name: FieldName.Latency,
            values: [1, 0],
          },
        ].map((field) => ({
          ...field,
          config: {
            displayName: DisplayNameByFieldName[field.name as FieldName],
          },
        })),
      });
      expect(tableDataFrame).toEqual(expectedDataFrame);
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
      const expectedDataFrame = toDataFrame({
        name: 'tableDataFrame',
        fields: [
          ...fields,
          {
            type: FieldType.number,
            name: FieldName.Latency,
            values: [undefined, undefined],
          },
        ].map((field) => ({
          ...field,
          config: {
            displayName: DisplayNameByFieldName[field.name as FieldName],
          },
        })),
      });
      expect(tableDataFrame).toEqual(expectedDataFrame);
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

      const wrapper = shallow(getComponent({ dataFrame, seriesMap }));
      const tableComponent = wrapper.find(Table);
      expect(tableComponent.exists()).toBeTruthy();
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

      const wrapper = shallow<RedisLatencyTable>(getComponent({ dataFrame, seriesMap }), {
        disableLifecycleMethods: true,
      });

      const sortedFields = [{ displayName: DisplayNameByFieldName[FieldName.Latency], desc: true }];
      expect(wrapper.state().sortedFields).toEqual(sortedFields);

      const tableComponent = wrapper.find(Table);
      expect(tableComponent.prop('initialSortBy')).toEqual(sortedFields);

      tableComponent.simulate('sortByChange', [
        { displayName: DisplayNameByFieldName[FieldName.Duration], desc: true },
      ]);
      expect(wrapper.state().sortedFields).toEqual([
        { displayName: DisplayNameByFieldName[FieldName.Duration], desc: true },
      ]);
    });
  });
});
