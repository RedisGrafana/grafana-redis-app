import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { InfoBox } from '@grafana/ui';
import { RedisCommand } from 'types';
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
import { DataSourceList } from './data-source-list';

type ShallowComponent = ShallowWrapper<typeof DataSourceList>;

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
    error: `Can't retrieve a list of commands`,
  };

  it('If datasources.length=0 should show no items message', () => {
    const wrapper = shallow(<DataSourceList datasources={[]} />);
    const testedComponent = wrapper.findWhere((node) => node.is(InfoBox));
    expect(testedComponent.exists()).toBeTruthy();
  });

  it('If datasources is undefined should not show no items message', () => {
    const wrapper = shallow(<DataSourceList datasources={void 0} />);
    const testedComponent = wrapper.findWhere((node) => node.is(InfoBox));
    expect(testedComponent.exists()).not.toBeTruthy();
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
        const datasources = [
          {
            commands: [''],
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(RedisCube));
        expect(testedComponent.prop('fill')).toEqual(FILLS.success);
        expect(testedComponent.prop('title')).toEqual(TITLES.success);
      });

      it('If there are not any commands should use alternative fill and title values', () => {
        const datasources = [
          {
            commands: [],
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
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
        const datasources = [
          {
            commands: [],
            jsonData: {},
            name: 'hello',
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-name'));
        expect(testedComponent.text()).toEqual(datasources[0].name);
      });
    });

    /**
     * Url
     */
    describe('Url', () => {
      it('Should render url', () => {
        const datasources = [
          {
            commands: [],
            jsonData: {},
            url: 'hello',
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-sub-name'));
        expect(testedComponent.text()).toEqual(datasources[0].url);
      });
    });

    /**
     * Title
     */
    describe('Title', () => {
      it('If there are not any commands should show title', () => {
        const datasources = [
          {
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.hasClass('card-item-type'));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.text()).toEqual(TITLES.error);
      });

      it('If there are some commands should hide title', () => {
        const datasources = [
          {
            commands: [''],
            jsonData: {},
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
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
        const datasources = [
          {
            commands: [],
            jsonData: {
              tlsAuth: true,
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(MultiLayerSecurity));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.error);
      });

      it('if jsonData.acl=true should be shown', () => {
        const datasources = [
          {
            commands: ['get'],
            jsonData: {
              acl: true,
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(MultiLayerSecurity));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.success);
      });

      it('if jsonData.acl=false and jsonData.tlsAuth=false should not be shown', () => {
        const datasources = [
          {
            commands: ['get'],
            jsonData: {
              tlsAuth: false,
              acl: false,
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
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
        const datasources = [
          {
            commands: [],
            jsonData: {
              client: 'cluster',
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(HighAvailability));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.error);
      });

      it('if jsonData.client matches with "sentinel" should be shown', () => {
        const datasources = [
          {
            commands: ['get'],
            jsonData: {
              client: 'sentinel',
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
        const item = getItem(wrapper);
        const testedComponent = item.findWhere((node) => node.is(HighAvailability));
        expect(testedComponent.exists()).toBeTruthy();
        expect(testedComponent.prop('fill')).toEqual(FILLS.success);
      });

      it('if jsonData.client does not match with cluster|sentinel should not be shown', () => {
        const datasources = [
          {
            commands: ['get'],
            jsonData: {
              client: 'manual',
            },
          },
        ];
        const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
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
          const datasources = [
            {
              commands: [valueToShow],
              jsonData: {},
            },
          ];
          const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
          const item = getItem(wrapper);
          const testedComponent = item.findWhere((node) => node.is(component));
          expect(testedComponent.exists()).toBeTruthy();
          expect(testedComponent.prop('fill')).toEqual(FILLS.success);
        });

        it(`Should not be shown if commands do not contain item "${valueToShow}"`, () => {
          const datasources = [
            {
              commands: [valueToHide],
              jsonData: {},
            },
          ];
          const wrapper = shallow<typeof DataSourceList>(<DataSourceList datasources={datasources} />);
          const item = getItem(wrapper);
          const testedComponent = item.findWhere((node) => node.is(component));
          expect(testedComponent.exists()).not.toBeTruthy();
        });
      });
    });
  });
});
