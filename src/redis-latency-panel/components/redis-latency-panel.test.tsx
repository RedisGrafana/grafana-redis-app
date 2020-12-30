import React from 'react';
import { Observable } from 'rxjs';
import { toDataFrame, FieldType } from '@grafana/data';
import { shallow } from 'enzyme';
import { RedisLatencyPanel } from './redis-latency-panel';
import { DISPLAY_NAME_BY_FIELD_NAME } from './constants';
import { FieldName } from '../types';

const getDataSourceQueryResult = (fields: Array<{ name: FieldName; type: FieldType; values: number[] }>) => ({
  data: [
    toDataFrame({
      name: 'data',
      fields,
    }),
  ],
});

/*
 DataSource
 */
const dataSourceMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next(
          getDataSourceQueryResult([
            {
              type: FieldType.number,
              name: FieldName.Duration,
              values: [2000, 3000],
            },
            {
              type: FieldType.number,
              name: FieldName.Calls,
              values: [10, 20],
            },
          ])
        );
        subscriber.complete();
      })
  ),
  name: 'datasource',
};

const dataSourceSrvGetMock = jest.fn().mockImplementation(() => Promise.resolve(dataSourceMock));

jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: () => ({
    get: dataSourceSrvGetMock,
  }),
}));

describe('RedisLatencyPanel', () => {
  const getComponent = (props: any) => <RedisLatencyPanel {...props} />;
  describe('getLatencyValue', () => {
    it('Should calc correctly', () => {
      const duration = 100;
      const prevDuration = 50;
      const calls = 2;
      const prevCalls = 1;
      expect(RedisLatencyPanel.getLatencyValue({ duration, prevDuration, calls, prevCalls })).toEqual(
        (duration - prevDuration) / (calls - prevCalls)
      );
    });

    it('If calls=prevCalls should handle NaN and return 0', () => {
      const duration = 100;
      const prevDuration = 50;
      const calls = 2;
      const prevCalls = 2;
      expect(RedisLatencyPanel.getLatencyValue({ duration, prevDuration, calls, prevCalls })).toEqual(0);
    });

    it('If no prev values should calc correctly', () => {
      const duration = 100;
      const calls = 2;
      expect(RedisLatencyPanel.getLatencyValue({ duration, calls })).toEqual(duration / calls);
    });
  });

  describe('getValuesForCalculation', () => {
    it('Should return calls and duration field values', () => {
      const dataFrame = toDataFrame({
        name: 'dataFrame',
        fields: [
          {
            name: FieldName.Calls,
            type: FieldType.number,
            values: [1, 2],
          },
          {
            name: FieldName.Command,
            type: FieldType.string,
            values: ['info', 'get'],
          },
          {
            name: FieldName.Duration,
            type: FieldType.number,
            values: [100, 200],
          },
        ],
      });
      expect(RedisLatencyPanel.getValuesForCalculation(dataFrame)).toEqual({
        calls: [1, 2],
        duration: [100, 200],
      });
    });
  });

  describe('getLatencyValues', () => {
    it('Should calc values array', () => {
      const prevValues = {
        calls: [1, 2],
        duration: [100, 200],
      };
      const currentValues = {
        calls: [2, 2],
        duration: [300, 200],
      };
      const rowsCount = 2;
      const expectedResult = [];
      for (let row = 0; row < rowsCount; row++) {
        expectedResult.push(
          RedisLatencyPanel.getLatencyValue({
            duration: currentValues.duration[row],
            calls: currentValues.calls[row],
            prevDuration: prevValues.duration[row],
            prevCalls: prevValues.calls[row],
          })
        );
      }
      expect(RedisLatencyPanel.getLatencyValues(prevValues, currentValues, rowsCount)).toEqual(expectedResult);
    });
  });

  describe('getTableDataFrame', () => {
    it('Should add new column with latency values', () => {
      const fields = [
        {
          type: FieldType.number,
          name: FieldName.Duration,
          values: [200, 300],
        },
        {
          type: FieldType.number,
          name: FieldName.Calls,
          values: [1, 2],
        },
      ];
      const prevDataFrame = toDataFrame({
        name: 'prev',
        fields,
      });
      const currentDataFrame = toDataFrame({
        name: 'current',
        fields: fields.map((field) => ({
          ...field,
          values: field.values.map((value) => value * value),
        })),
      });
      const tableDataFrame = RedisLatencyPanel.getTableDataFrame(prevDataFrame, currentDataFrame);
      const expectedDataFrame = toDataFrame({
        name: 'tableDataFrame',
        fields: [
          ...fields.map((field) => ({
            ...field,
            values: field.values.map((value) => value * value),
          })),
          {
            type: FieldType.number,
            name: FieldName.Latency,
            values: RedisLatencyPanel.getLatencyValues(
              RedisLatencyPanel.getValuesForCalculation(prevDataFrame),
              RedisLatencyPanel.getValuesForCalculation(currentDataFrame),
              2
            ),
          },
        ].map((field) => ({
          ...field,
          config: {
            displayName: DISPLAY_NAME_BY_FIELD_NAME[field.name as FieldName],
          },
        })),
      });
      expect(tableDataFrame).toEqual(expectedDataFrame);
    });
  });

  describe('RequestData', () => {
    const data = {
      series: [
        toDataFrame({
          name: 'data',
          fields: [
            {
              type: FieldType.number,
              name: FieldName.Duration,
              values: [200, 300],
            },
            {
              type: FieldType.number,
              name: FieldName.Calls,
              values: [1, 2],
            },
          ],
        }),
      ],
    };

    describe('Mount', () => {
      it('If options.interval is filled should set interval', () => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();
      });

      it('If options.interval is empty should not set interval', () => {
        const options = {};
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).not.toHaveBeenCalled();
      });
    });

    describe('Update', () => {
      it('If options.interval was changed should set interval', () => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockClear();
        wrapper.setProps({ options: { interval: 2000 } });
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockClear();
        wrapper.setProps({ options: { interval: 2000 } });
        expect(testedMethod).not.toHaveBeenCalled();
      });
    });

    describe('Unmount', () => {
      it('Should clear interval', () => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval').mockImplementation(() => {});
        wrapper.instance().componentWillUnmount();
        expect(testedMethod).toHaveBeenCalled();
      });
    });

    describe('Update tableDataFrame', () => {
      it('Should set timer and request data with interval', (done) => {
        const options = {
          interval: 1000,
        };
        const getTableDataFrameMock = jest.spyOn(RedisLatencyPanel, 'getTableDataFrame');
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const setStateMock = jest.spyOn(wrapper.instance(), 'setState');

        setImmediate(() => {
          setStateMock.mockClear();
          dataSourceMock.query.mockClear();
          getTableDataFrameMock.mockClear();
          let checksCount = 2;
          const check = () => {
            expect(dataSourceMock.query).toHaveBeenCalled();
            expect(getTableDataFrameMock).toHaveBeenCalled();
            expect(setStateMock).toHaveBeenCalled();

            checksCount--;
            if (checksCount > 0) {
              getTableDataFrameMock.mockClear();
              setStateMock.mockClear();
              dataSourceMock.query.mockClear();
              setTimeout(check, options.interval);
            } else {
              getTableDataFrameMock.mockReset();
              done();
            }
          };
          setTimeout(check, options.interval);
        });
      });

      it('Should clear interval before setting new one', (done) => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval');
        setImmediate(() => {
          wrapper.instance().setRequestDataInterval();
          expect(testedMethod).toHaveBeenCalled();
          done();
        });
      });

      it('Should use passed datasource', (done) => {
        const options = {
          interval: 1000,
        };
        const overrideData = {
          ...data,
          request: {
            targets: [
              {
                datasource: 'redis',
              },
            ],
          },
        };
        shallow<RedisLatencyPanel>(getComponent({ data: overrideData, options }));
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });
    });

    describe('clearRequestDataInterval', () => {
      it('Should clear interval', (done) => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        setImmediate(() => {
          expect(wrapper.instance().requestDataTimer).toBeDefined();
          wrapper.instance().clearRequestDataInterval();
          expect(wrapper.instance().requestDataTimer).not.toBeDefined();
          done();
        });
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
