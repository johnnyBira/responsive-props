import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';
import ResponsiveStyledComponent from './DemoExample';
import WrappedStyledComponent from './BasicExample';

const breakpoints = { xs: 320, s: 576, m: 768, l: 992, xl: 1200 };
const theme = {
  responsiveProps: {
    breakpoints,
  },
};

storiesOf('Responsive Props', module)
  .add('Demo', () => (
    <ResponsiveStyledComponent
      text={{ s: 'awesome', m: 'are', l: 'Props', xl: 'Responsive' }}
      background={{ s: '#002635', m: '#013440', l: '#AB1A25', xl: '#D97925' }}
      breakpoints={breakpoints}
    />
  ))
  .add('Basic Example', () => (
    <WrappedStyledComponent
      background={{ s: 'papayawhip', m: 'palevioletred', l: '#AB1A25' }}
      breakpoints={breakpoints}
    />
  ))
  .add('Basic Example With Thene', () => (
    <ThemeProvider theme={theme}>
      <WrappedStyledComponent
        background={{ s: 'papayawhip', m: 'palevioletred', l: '#AB1A25' }}
      />
    </ThemeProvider>
  ));
