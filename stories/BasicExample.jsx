import React from 'react';
import styled from 'styled-components';
import withResponsiveProps from '../src';

const StyledComponent = styled.div`
  width: 200px;
  height: 200px;
  background: palevioletred;
  margin 0 auto;

  ${({ responsiveProps }) => responsiveProps}
`;

const background = val => `
  background: ${val};
`;

const text = val => `
  position: relative;
  font-family: helvetica;
  font-wieght: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;

  &:before {
    content: "${val}";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ResponsiveStyledComponent = withResponsiveProps(
  // Wrap StyledComponent
  StyledComponent,
  // Register mixins
  {
    background,
    text,
  },
);

const BasicExample = () => (
  <ResponsiveStyledComponent
    breakpoints={{ s: 0, m: 320, l: 576, xl: 768 }}
    text={{ s: 'awesome', m: 'are', l: 'Props', xl: 'Responsive' }}
    background={{ s: '#002635', m: '#013440', l: '#AB1A25', xl: '#D97925' }}
  />
);

export default BasicExample;
