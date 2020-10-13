import React, { FC } from 'react';
import { SVGProps } from '../types';

/**
 * RedisTimeSeries
 */
export const RedisTimeSeries: FC<SVGProps> = ({ size, fill, ...rest }) => {
  return (
    <a
      target="_blank"
      href="http://redistimeseries.io"
      title="RedisTimeSeries is a Redis Module adding a Time Series data structure to Redis."
    >
      <svg version="1.1" id="RedisTimeSeries" x="0px" y="0px" viewBox="0 0 32 32" width={size} height={size} {...rest}>
        <path
          fill={fill ? fill : '#DC382D'}
          d="M8.5,16.7l3.1,3.1l7.3-7.3l3.7,3.7l8.6-8.6l-0.7-0.7l-7.8,7.8L19,11l-7.3,7.3L9.2,16L8.5,16.7z M26.9,21.7
	l-0.7,0.7l3.8,3.8H9.3c-1.9,0-3.4-1.5-3.4-3.4V2.1l3.8,3.7l0.7-0.7L5.5,0.3L0.6,5.1l0.7,0.7l3.5-3.5v20.4c0,2.4,2,4.4,4.4,4.4h20.4
	l-3.5,3.5l0.7,0.7l4.9-4.8L26.9,21.7z"
        />
      </svg>
    </a>
  );
};
