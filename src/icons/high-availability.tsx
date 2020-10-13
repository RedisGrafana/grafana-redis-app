import React, { FC } from 'react';
import { SVGProps } from '../types';

/**
 * High Availability
 */
export const HighAvailability: FC<SVGProps> = ({ size, fill, ...rest }) => {
  return (
    <a target="_blank" href="http://redis.io" title="High Availability enabled.">
      <svg version="1.1" id="HighAvailability" x="0px" y="0px" viewBox="0 0 32 32" width={size} height={size} {...rest}>
        <path
          fill={fill ? fill : '#DC382D'}
          d="M29.5,0h-9C19.1,0,18,1.1,18,2.5V9h-6.5C10.1,9,9,10.1,9,11.5V18H2.5C1.1,18,0,19.1,0,20.5v9
	C0,30.9,1.1,32,2.5,32h9c1.4,0,2.5-1.1,2.5-2.5V23h6.5c1.4,0,2.5-1.1,2.5-2.5V14h6.5c1.4,0,2.5-1.1,2.5-2.5v-9C32,1.1,30.9,0,29.5,0
	z M13,29.5c0,0.8-0.7,1.5-1.5,1.5h-9C1.7,31,1,30.3,1,29.5v-9C1,19.7,1.7,19,2.5,19H9v1.5c0,1.4,1.1,2.5,2.5,2.5H13V29.5z M13,22
	h-1.5c-0.8,0-1.5-0.7-1.5-1.5V19h1.5c0.8,0,1.5,0.7,1.5,1.5V22z M22,20.5c0,0.8-0.7,1.5-1.5,1.5H14v-1.5c0-1.4-1.1-2.5-2.5-2.5H10
	v-6.5c0-0.8,0.7-1.5,1.5-1.5H18v1.5c0,1.4,1.1,2.5,2.5,2.5H22V20.5z M22,13h-1.5c-0.8,0-1.5-0.7-1.5-1.5V10h1.5
	c0.8,0,1.5,0.7,1.5,1.5V13z M31,11.5c0,0.8-0.7,1.5-1.5,1.5H23v-1.5c0-1.4-1.1-2.5-2.5-2.5H19V2.5C19,1.7,19.7,1,20.5,1h9
	C30.3,1,31,1.7,31,2.5V11.5z"
        />
      </svg>
    </a>
  );
};
