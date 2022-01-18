import { shallow, ShallowWrapper } from 'enzyme';
import {
  HighAvailability,
  MultiLayerSecurity,
  RedisAI,
  RedisBloom,
  RedisCube,
  RediSearch,
  RedisGears,
  RedisGraph,
  RedisJSON,
  RedisTimeSeries,
} from 'icons';
import React from 'react';
import { Alert } from '@grafana/ui';
import { DataSourceType, RedisCommand } from '../../constants';
import { DataSourceList } from './DataSourceList';

type ShallowComponent = ShallowWrapper<typeof DataSourceList>;

const backendSrvMock = {
  post: jest.fn(),
};

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => backendSrvMock,
  locationService: {
    push: () => jest.fn(),
  },
}));

/**
 * DataSourceList
 */
describe('DataSourceList', () => {
  const FILLS = {
    success: '#DC382D',
    error: '#A7A7A7',
  };
  const TITLES = {
    success: 'Working as expected',
    error: `Can't retrieve a list of commands. Check that user has permissions to see a list of all commands.`,
  };

  beforeEach(() => {
    Object.values(backendSrvMock).forEach((mock) => mock.mockClear());
  });

  it('If datasources.length=0 should show no items message', () => {
    const wrapper = shallow(<DataSourceList dataSources={[]} />);
    const testedComponent = wrapper.findWhere((node) => node.is(Alert));
    expect(testedComponent.exists()).toBeTruthy();
  });

  /**
   * Item
   */
  describe('Item', () => {
    const getItem = (wrapper: ShallowComponent): ShallowWrapper =>
      wrapper.findWhere((node) => node.hasClass('card-item-wrapper')).first();

    /**
     * RedisCube
     */
    describe('RedisCube', () => {
      it('Should render', () => {
        const dataSources = [
          {
            commands: [''],
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(RedisCube));
        expect(testedComponent.prop('fill')).toEqual(FILLS.success);
        expect(testedComponent.prop('title')).toEqual(TITLES.success);
      });

      it('If there are not any commands should use alternative fill and title values', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(RedisCube));
        expect(testedComponent.prop('fill')).toEqual(FILLS.error);
        expect(testedComponent.prop('title')).toEqual(TITLES.error);
      });
    });

    /**
     * Name
     */
    describe('Name', () => {
      it('Should render name', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {},
            name: 'hello',
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-name'));
        expect(testedComponent.text()).toEqual(dataSources[0].name);
      });
    });

    /**
     * Url
     */
    describe('Url', () => {
      it('Should render url', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {},
            url: 'hello',
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-sub-name'));
        expect(testedComponent.text()).toEqual(dataSources[0].url);
      });
    });

    /**
     * Title
     */
    describe('Title', () => {
      it('If there are not any commands should show title', () => {
        const dataSources = [
          {
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-type'));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.text()).toEqual(TITLES.error);
      });

      it('If there are some commands should hide title', () => {
        const dataSources = [
          {
            commands: [''],
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-type'));
        expect(testedComponent.exists()).not.toBeTruthy();
      });
    });

    /**
     * MultiLayerSecurity
     */
    describe('MultiLayerSecurity', () => {
      it('if jsonData.tlsAuth=true should be shown', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {
              tlsAuth: true,
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(MultiLayerSecurity));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.error);
      });

      it('if jsonData.acl=true should be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              acl: true,
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(MultiLayerSecurity));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.success);
      });

      it('if jsonData.acl=false and jsonData.tlsAuth=false should not be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              tlsAuth: false,
              acl: false,
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(MultiLayerSecurity));
        expect(testedComponent.exists()).not.toBeTruthy();
      });
    });

    /**
     * HighAvailability
     */
    describe('HighAvailability ', () => {
      it('if jsonData.client matches with "cluster" should be shown', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {
              client: 'cluster',
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(HighAvailability));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.error);
      });

      it('if jsonData.client matches with "sentinel" should be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              client: 'sentinel',
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(HighAvailability));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.success);
      });

      it('if jsonData.client does not match with cluster|sentinel should not be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              client: 'manual',
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(HighAvailability));
        expect(testedComponent.exists()).not.toBeTruthy();
      });
    });

    /**
     * Tests for similar components
     */
    const tests = [
      {
        name: 'RedisGears',
        component: RedisGears,
        valueToShow: RedisCommand.REDISGEARS,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisTimeSeries',
        component: RedisTimeSeries,
        valueToShow: RedisCommand.REDISTIMESERIES,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisAI',
        component: RedisAI,
        valueToShow: RedisCommand.REDISAI,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RediSearch',
        component: RediSearch,
        valueToShow: RedisCommand.REDISEARCH,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisJSON',
        component: RedisJSON,
        valueToShow: RedisCommand.REDISJSON,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisGraph',
        component: RedisGraph,
        valueToShow: RedisCommand.REDISGRAPH,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisBloom',
        component: RedisBloom,
        valueToShow: RedisCommand.REDISBLOOM,
        valueToHide: RedisCommand.COMMAND,
      },
    ];
    tests.forEach(({ name, component, valueToShow, valueToHide }) => {
      describe(name, () => {
        it(`Should be shown if commands contain item "${valueToShow}"`, () => {
          const dataSources = [
            {
              commands: [valueToShow],
              jsonData: {},
            },
          ];
          const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
          const item = getItem(wrapper);
          const testedComponent = item.findWhere((node) => node.is(component));
          expect(testedComponent.exists()).toBeTruthy();
          expect(testedComponent.prop('fill')).toEqual(FILLS.success);
        });

        it(`Should not be shown if commands do not contain item "${valueToShow}"`, () => {
          const dataSources = [
            {
              commands: [valueToHide],
              jsonData: {},
            },
          ];
          const wrapper = shallow<typeof DataSourceList>(<DataSourceList dataSources={dataSources as any} />);
          const item = getItem(wrapper);
          const testedComponent = item.findWhere((node) => node.is(component));
          expect(testedComponent.exists()).not.toBeTruthy();
        });
      });
    });
  });

  /**
   * addNewDataSource
   */
  describe('addNewDataSource', () => {
    it('Should add new datasource and redirect on edit page', (done) => {
      const dataSources = [
        {
          id: 1,
          name: 'Redis Data Source',
          commands: [],
          jsonData: {},
        },
      ];
      const wrapper = shallow<ShallowComponent>(<DataSourceList dataSources={dataSources as any} />);
      const addDataSourceButton = wrapper.findWhere(
        (node) => node.name() === 'Button' && node.text() === 'Add Redis Data Source'
      );
      backendSrvMock.post.mockImplementationOnce(() => Promise.resolve({ datasource: { uid: 123 } }));
      addDataSourceButton.simulate('click');
      setImmediate(() => {
        expect(backendSrvMock.post).toHaveBeenCalledWith('/api/datasources', {
          name: 'Redis',
          type: DataSourceType.REDIS,
          access: 'proxy',
        });
        done();
      });
    });

    it('Should calc new name', (done) => {
      const dataSources = [
        {
          id: 1,
          name: 'Redis',
          commands: [],
          jsonData: {},
        },
        {
          id: 2,
          name: 'Redis-1',
          commands: [],
          jsonData: {},
        },
      ];
      const wrapper = shallow<ShallowComponent>(<DataSourceList dataSources={dataSources as any} />);
      const addDataSourceButton = wrapper.findWhere(
        (node) => node.name() === 'Button' && node.text() === 'Add Redis Data Source'
      );
      backendSrvMock.post.mockImplementationOnce(() => Promise.resolve({ datasource: { uid: 123 } }));
      addDataSourceButton.simulate('click');
      setImmediate(() => {
        expect(backendSrvMock.post).toHaveBeenCalledWith('/api/datasources', {
          name: 'Redis-2',
          type: DataSourceType.REDIS,
          access: 'proxy',
        });
        done();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
