import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { ThemeProvider } from 'styled-components';

const shallowWithTheme = (tree, theme, fn = shallow) => {
  const context = shallow(<ThemeProvider theme={theme} />)
    .instance()
    .getChildContext()
  return shallow(tree, { context })
}

export default shallowWithTheme;
