import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';

function loadStories() {
  require('../stories');
}

addDecorator((story, context) => withInfo('common info')(story)(context));

addDecorator(story => ([
  <div key="index" style={{
    background: '#262626',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    {story()}
  </div>,
]))

// Option defaults:
setOptions({
  name: 'Responsive Props',
  showStoriesPanel: true,
  showAddonPanel: false,
});

configure(loadStories, module);
