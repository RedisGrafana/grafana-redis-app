import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Observable } from 'rxjs';
import { AppPluginMeta, PluginType } from '@grafana/data';
import { InfoBox } from '@grafana/ui';
import { DataSourceType, RedisCommand } from '../types';
import { RootPage } from './root-page';
import { DataSourceList } from './data-source-list';

const getMeta = (): AppPluginMeta => ({
  id: '',
  name: '',
  type: PluginType.app,
  module: '',
  baseUrl: '',
  info: {
    author: {} as any,
    description: '',
    logos: {
      large: '',
      small: '',
    },
    links: [],
    screenshots: [],
    updated: '',
    version: '',
  },
});

type ShallowComponent = ShallowWrapper<RootPage['props'], RootPage['state'], RootPage>;

const getDataSourceMock = jest.fn().mockImplementation(() => Promise.resolve([]));
const redisMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next({
          data: [
            {
              fields: [
                {
                  values: {
                    toArray() {
                      return ['info', '2', '3'];
                    },
                  },
                },
              ],
              length: 1,
            },
          ],
        });
        subscriber.complete();
      })
  ),
};
const getRedisMock = jest.fn().mockImplementation(() => Promise.resolve(redisMock));

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    get: getDataSourceMock,
  }),
  getDataSourceSrv: () => ({
    get: getRedisMock,
  }),
}));

describe('RootPage', () => {
  const meta = getMeta();
  const path = '/app';
  const onNavChangedMock = jest.fn();

  beforeEach(() => {
    onNavChangedMock.mockClear();
    getDataSourceMock.mockClear();
    getRedisMock.mockClear();
    redisMock.query.mockClear();
  });

  describe('Mounting', () => {
    it('Should update navigation', () => {
      const wrapper = shallow<RootPage>(
        <RootPage meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      const testedMethod = jest.spyOn(wrapper.instance(), 'updateNav');
      wrapper.instance().componentDidMount();
      expect(testedMethod).toHaveBeenCalledTimes(1);
    });

    it('Should make get /api/datasources request', () => {
      const wrapper = shallow<RootPage>(
        <RootPage meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      wrapper.instance().componentDidMount();
      expect(getDataSourceMock).toHaveBeenCalledWith('/api/datasources');
    });

    it('Should check supported commands', (done) => {
      getDataSourceMock.mockImplementationOnce(() =>
        Promise.resolve([
          {
            type: DataSourceType.REDIS,
            name: 'redis',
          },
        ])
      );
      const wrapper = shallow<RootPage>(
        <RootPage meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      wrapper.instance().componentDidMount();
      setImmediate(() => {
        expect(getRedisMock).toHaveBeenCalledWith('redis');
        expect(redisMock.query).toHaveBeenCalledWith({ targets: [{ query: RedisCommand.COMMAND }] });
        expect(wrapper.state().loading).toBeFalsy();
        expect(wrapper.state().datasources).toEqual([
          {
            type: DataSourceType.REDIS,
            name: 'redis',
            commands: ['INFO'],
          },
        ]);
        done();
      });
    });
  });
  describe('updateNav', () => {
    it('Should call onNavChanged prop', () => {
      const wrapper = shallow<RootPage>(
        <RootPage meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      wrapper.instance().updateNav();
      const node = {
        text: 'Redis Application',
        img: meta.info.logos.large,
        subTitle: 'Redis Data Source',
        url: path,
        children: [
          {
            text: 'Home',
            url: path,
            id: 'home',
            icon: 'fa fa-fw fa-database',
            active: true,
          },
        ],
      };
      expect(onNavChangedMock).toHaveBeenCalledWith({
        node: node,
        main: node,
      });
    });
  });

  describe('rendering', () => {
    it('Should show message if loading=true', (done) => {
      const wrapper = shallow<RootPage>(
        <RootPage meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      const loadingMessageComponent = wrapper.findWhere(
        (node) => node.is(InfoBox) && node.prop('title') === 'Loading...'
      );
      expect(loadingMessageComponent.exists()).toBeTruthy();
      wrapper.instance().componentDidMount();
      setImmediate(() => {
        const dataSourceListComponent = wrapper.findWhere((node) => node.is(DataSourceList));
        const loadingMessageComponent = wrapper.findWhere(
          (node) => node.is(InfoBox) && node.prop('title') === 'Loading...'
        );
        expect(loadingMessageComponent.exists()).not.toBeTruthy();
        expect(dataSourceListComponent.exists()).toBeTruthy();
        expect(dataSourceListComponent.prop('datasources')).toEqual(wrapper.state().datasources);
        done();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
