import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

function loadStories() {
  require('../stories');
}

// Option defaults:
setOptions({
  name: 'Responsive Props',
  showStoriesPanel: false,
  showAddonPanel: false,
});

configure(loadStories, module);
