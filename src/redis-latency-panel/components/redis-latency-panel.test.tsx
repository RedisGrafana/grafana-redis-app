import React from 'react';
import { shallow } from 'enzyme';
import { Observable } from 'rxjs';
import { FieldType, toDataFrame, dateTime, GraphSeriesXY } from '@grafana/data';
import { RedisLatencyPanel } from './redis-latency-panel';
import { FieldName, ViewMode, DisplayNameByFieldName, SeriesMap } from '../types';

/**
 * Query Result
 */
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

/**
 * Latency Panel
 */
describe('RedisLatencyPanel', () => {
  const getComponent = ({ options = { interval: 1000, viewMode: ViewMode.Table }, ...restProps }: any) => (
    <RedisLatencyPanel {...restProps} options={options} />
  );
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
            displayName: DisplayNameByFieldName[field.name as FieldName],
          },
        })),
      });
      expect(tableDataFrame).toEqual(expectedDataFrame);
    });
  });

  describe('getSeriesMap', () => {
    it('Should add value to seriesMap', () => {
      const seriesMap = {
        info: [
          {
            time: dateTime(),
            value: 20,
          },
        ],
      };
      const dataFrame = toDataFrame({
        name: 'data',
        fields: [
          {
            type: FieldType.string,
            name: FieldName.Command,
            values: ['get', 'info'],
          },
        ],
      });
      const time = dateTime();
      const values = [10, 20];
      const result = RedisLatencyPanel.getSeriesMap(seriesMap, dataFrame, values, time);
      const expectedResult: SeriesMap = {
        get: [
          {
            time,
            value: values[0],
          },
        ],
        info: [
          ...seriesMap.info,
          {
            time,
            value: values[1],
          },
        ],
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGraphSeries', () => {
    it('Should return series for each command', () => {
      const seriesMap = {
        get: [
          {
            time: dateTime(),
            value: 100,
          },
        ],
        info: [
          {
            time: dateTime(),
            value: 10,
          },
          {
            time: dateTime().add(10, 'seconds'),
            value: 20,
          },
        ],
      };
      const result: GraphSeriesXY[] = RedisLatencyPanel.getGraphSeries(seriesMap);
      expect(result.length).toEqual(Object.keys(seriesMap).length);
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
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data }));
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
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockClear();
        wrapper.setProps({ options: { interval: 2000, viewMode: ViewMode.Table } });
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockClear();
        wrapper.setProps({ options: { interval: 2000, viewMode: ViewMode.Table } });
        expect(testedMethod).not.toHaveBeenCalled();
      });
    });

    describe('Unmount', () => {
      it('Should clear interval', () => {
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval').mockImplementation(() => {});
        wrapper.instance().componentWillUnmount();
        expect(testedMethod).toHaveBeenCalled();
      });
    });

    describe('Update tableDataFrame', () => {
      it('Should set timer and request data with interval', (done) => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
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
          viewMode: ViewMode.Table,
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
          viewMode: ViewMode.Table,
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
          viewMode: ViewMode.Table,
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
