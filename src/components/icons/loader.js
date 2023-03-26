import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      <g id="A" transform="translate(28.000000, 18.000000), scale(0.6)" className={' inline-block'}>
        <path
          fill="transparent"
          stroke="currentColor"
          strokeWidth={'6'}
          d="M5,90
           l30,-80 30,80
           M20,50
           l30,0"
        />
      </g>
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 50, 5
                  L 11, 27
                  L 11, 72
                  L 50, 95
                  L 89, 73
                  L 89, 28 z"
      />
    </g>
  </svg>
);

export default IconLoader;
