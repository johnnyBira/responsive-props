import React from 'react';
import styled, { css } from 'styled-components';
// responsive-props HOC
import withResponsiveProps from '../src';

// Create a styled-components
const StyledComponent = styled.div`
  width: 200px;
  height: 200px;
  background: palevioletred;

  ${({ responsiveProps }) => responsiveProps}
`;

// Define the mixin `background`
const background = bg => css`
  background: ${bg};
`;

// Wrap `StyledComponent with the `responsive-props` HOC
const WrappedStyledComponent = withResponsiveProps(
  // Wraps `StyledComponent
  StyledComponent, {
    // registers ´background` as a mixin
    background: background,
  });

// Define the breakpoints, passed to `WrappedStyledComponent` `breakpoints` prop bellow
const breakpoints = { xs: 320, s: 576, m: 768, l: 992, xl: 1200 };

// WrappedStyledComponent can now be used in the following way
const Example = () => (
  <WrappedStyledComponent
    background={{ s: 'papayawhip', m: 'palevioletred', l: '#AB1A25' }}
    breakpoints={breakpoints}
  />
);

// WrappedStyledComponent.displayName = 'WrappedStyledComponent';
export default WrappedStyledComponent;
