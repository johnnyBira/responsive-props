[![codecov](https://codecov.io/gh/johnnyBira/responsive-props/branch/develop/graph/badge.svg)](https://codecov.io/gh/johnnyBira/responsive-props)
![Travis](https://img.shields.io/travis/johnnyBira/responsive-props.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

## Responsive Props 💅
Responsive props for [Styled Components](https://www.styled-components.com/).

![alt text](https://raw.githubusercontent.com/johnnyBira/responsive-props/master/docs/images/demoExample.gif "Demo Exmaple")

`responsive-props` is a [HOC](https://reactjs.org/docs/higher-order-components.html) that enhances a [styled component](https://www.styled-components.com/) with a responsive API, to handle styling based on any number of media queries.

This is useful when a styled component needs to have different styles based one or more media queries, in different contexts of an application.

A common example of this is a column in a grid, where a column can have a different widths depending on a matching media query. For that particular use case, `responsive-props` can provide the following API:

```javascript
// Possibility to target specific media queries and apply styles accordingly
<Row>
  <Column span={{ m: 6, l: 4, xl: 3 }} />
</Row>
// Or pass a single value that will apply styles without any media queries
<Row>
  <Column span={6} />
</Row>
```
The above example is take from the [Styled Flexbox Grid](https://github.com/johnnyBira/styled-flexbox-grid) library, which uses `responsive-props`.

#### Installation

```sh
yarn add responsive-props
# or
npm install responsive-props
```
---

## Basic Example

The default export of `responsive-props` is a [HOC](https://reactjs.org/docs/higher-order-components.html) that takes two parameters. The first parameter is the component to be wrapped/enhanced, and the second parameter is an object containing functions, know as [mixins](https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md#more-powerful-example), that will generate styles for a given media query.

```javascript
import React from 'react';
import styled, { css } from 'styled-components';
// responsive-props HOC
import withResponsiveProps from 'responsive-props';

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
    background={{ s: '#002635', m: '#013440', l: '#AB1A25' }}
    breakpoints={breakpoints}
  />
);

export default Example;
```

The above component `WrappedStyledComponent`, will result in a div in the shaped of a square, with different background colors depending on what media query is matching.

![alt text](https://raw.githubusercontent.com/johnnyBira/responsive-props/master/docs/images/basicExample.gif "Basic Exmaple")

Notice how different breakpoint are targeted inside of the `background` prop of `WrappedStyledComponent`. The value for each breakpoint (`#002635`, `#013430` and `#AB1A25`) will be passed as the `bg` parameter of the `background` mixin, and generate corresponding styled for each media query.

Also notice that the name of the prop `background`, matches that of the key `background` in the object of mixins that is passed to the `withResponsiveProps` HOC.

<br/>

> **Important:** The line `${({ responsiveProps }) => responsiveProps}` is where styles of each media queries will be inserted. Without this no media queries will be applied to the styled component.

<br/>

It is possible to register any number of breakpoints with a naming convention of your choice. In the above examples we used the naming convention:  `xs`, `s`, `m`, `l`, `xl`. However if you for example prefer the convention used by Twitter Bootstrap (`xs`, `sm`, `md`, `lg`, `xl`) you could configure the breakpoints like this:

```javascript
// Define the breakpoints, passed to `WrappedStyledComponent` `breakpoints` prop bellow
const breakpoints = { xs: 320, sm: 576, md: 768, lg: 992, xl: 1200 };

// WrappedStyledComponent can now be used in the following way
const Example = () => (
  <WrappedStyledComponent
    background={{ sm: 'papayawhip', md: 'palevioletred', lg: '#AB1A25' }}
    breakpoints={breakpoints}
  />
);
```

## Register breakpoints

There are two ways to register the breakpoints for components enhanced by `responsive-props`.

The first (which has already been demonstrated in the  [Basic Example](#basic-example)  is to pass to pass an object of breakpoints to the enhanced component via the `breakpoints` prop. The other more convenient way is to register the breakpoints inside a theme of the `styled-components` [ThemeProvider](https://www.styled-components.com/docs/advanced#theming).

### Via `<ThemeProvider />` (recommended)

Putting the breakpoints inside a theme has the benefit of only having to define them once, and not having to remember to include for every component.
The breakpoints should be put under the namespace `responsiveProps.breakpoints` of the theme, as demonstrated bellow.

```javascript
import React from 'react';
import { ThemeProvider } from 'styled-components';
const theme = {
  responsiveProps: {
    breakpoints: {
      xs: 320,
      s: 576,
      m: 768,
      l: 992,
      xl: 1200
    }
  }
}

// The `breakpoints` prop from the `Basic Example` can now be omitted
const Example = () => (
  <ThemeProvider theme={theme}>
    <WrappedStyledComponent background={{ s: '#002635', m: '#013440', l: '#AB1A25' }} />
  <ThemeProvider theme={theme}>
);

```
Of course this is a contrived example where the benefit of theme isn't very clear. Normally the `ThemeProvider` would be placed somewhere higher up the component three, where any component inside the `ThemeProvider` can omit the `breakpoints` prop.

### Via the `breakpoints` prop

If your application doesn't make use of `ThemeProvider` (or you would like to override the default breakpoints provided by theme) it is possible to pass breakpoints via the `breakpoints` prop, of a component enhanced by `responsive-props`.

```javascript
<WrappedStyledComponent breakpoint={{ xs: 320,s: 576,m: 768,l: 992, xl: 1200 }} >
```

## API

The API of a component enhanced by `responsive-props` is centered around the format of the value, that is passed to the props of the component. They can either be in the form of an object to [target specific media queries](#target-specific-media-queries) or a [single value](#single-value-without-media-queries) to seamlessly act as regular [adaptational props](https://www.styled-components.com/docs/basics#adapting-based-on-props).

In [React](https://reactjs.org/) terms the pattern implemented by `responsive-props` is known as Props Proxy.

### Target specific media queries

To target a specific breakpoint an object of breakpoints is passed as the value of the prop. The keys of the of object should be present in the [registered breakpoints](#register-breakpoints) in order to work.

Bellow the keys (`s`, `m`, and `l`) are the breakpoints to target. The values (`#002635`, `#013440` and `#AB1A25`) are parameter that will be passed to a mixin/function namned `background`, responsible for generating styles for the specified breakpoints.

```javascript
<WrappedStyledComponent background={{ s: '#002635', m: '#013440', l: '#AB1A25' }} />
```

This will result in different background colors (`#002635`, `#013440` and `#AB1A25`) for each breakpoint (`s`, `m`, and `l`).

### Single value (without media queries)

If a style should be applied without media queries (i.e. independent of the bowser/viewport width) it is possible to only pass a single value to the same prop, instead of an object of breakpoints.

```javascript
<WrappedStyledComponent background="#002635" />
```
This will result in a background color of `#002635` for all viewports.

### Mixins with multiple parameters

If a mixin accept more than one parameter it is possible to pass the parameter for a given breakpoint in the form on an array. In the example bellow the `verticalPadding` mixin takes two parameters, the first for top padding and the second for bottom padding.

```javascript
<WrappedStyledComponent verticalPadding={{ s: ['2rem', '1rem'], m: ['3rem', '2rem'] }}
```

More detailed snippet of the above example:
```javascript
// Define the mixin `background`
const verticalPadding = (paddingBottom, paddingTop = 0) => css`
  padding: ${paddingTop} 0 ${paddingBottom} 0;
`;

// Wrap `StyledComponent with the `responsive-props` HOC
const WrappedStyledComponent = withResponsiveProps(
  // Wraps `StyledComponent`
  StyledComponent, {
    // registers `verticalPadding` as a mixin
    verticalPadding: verticalPadding,
  });

// WrappedStyledComponent can now be used in the following way
const Example = () => (
  <WrappedStyledComponent verticalPadding={{ s: ['2rem', '1rem'], m: ['3rem', '2rem'] }}
  />
);
```
---
