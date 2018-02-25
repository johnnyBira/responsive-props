import React from 'react';
import backgrounds from "@storybook/addon-backgrounds";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import BasicExample from './BasicExample';

import { Button, Welcome } from '@storybook/react/demo';

storiesOf('Responsive Props', module)
  .addDecorator(backgrounds([
      { name: "default", value: "#262626", default: true },
    ]))
  .add('Basic Example', () => <BasicExample />)
