import React, { FC } from 'react';
import { SVGProps } from '../types';

/**
 * RedisGraph
 */
export const RedisGraph: FC<SVGProps> = ({ size, fill, ...rest }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href="http://redisgraph.io"
      title="RedisGraph is the first queryable Property Graph database to use sparse matrices to represent the adjacency matrix in graphs and linear algebra to query the graph."
    >
      <svg version="1.1" id="RedisGraph" x="0px" y="0px" viewBox="0 0 32 32" width={size} height={size} {...rest}>
        <path
          fill={fill ? fill : '#DC382D'}
          d="M0,4.8v22.3C0,29.8,2.2,32,4.8,32v-1C2.7,31,1,29.3,1,27.2V4.8C1,2.7,2.7,1,4.8,1V0C2.2,0,0,2.2,0,4.8z M27.2,0
	v1C29.3,1,31,2.7,31,4.8v22.3c0,2.1-1.7,3.8-3.8,3.8v1c2.7,0,4.8-2.2,4.8-4.8V4.8C32,2.2,29.8,0,27.2,0z M8,5c1.7,0,3,1.3,3,3
	s-1.3,3-3,3S5,9.7,5,8S6.3,5,8,5z M16,5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,5,16,5z M16,10c-1.1,0-2-0.9-2-2s0.9-2,2-2
	s2,0.9,2,2S17.1,10,16,10z M24,5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S25.7,5,24,5z M24,10c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2
	S25.1,10,24,10z M8,13c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S9.7,13,8,13z M8,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S9.1,18,8,18z
	 M16,13c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S14.3,13,16,13z M24,13c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S25.7,13,24,13z M24,18
	c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S25.1,18,24,18z M8,21c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S6.3,21,8,21z M16,21
	c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,21,16,21z M16,26c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S17.1,26,16,26z M24,21
	c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S25.7,21,24,21z M24,26c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S25.1,26,24,26z"
        />
      </svg>
    </a>
  );
};
