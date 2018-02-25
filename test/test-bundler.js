import 'jest-enzyme';
import 'jest-styled-components';
import jsdom from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import shallowWithTheme from './utils/shallowWithTheme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView
// global.shallowWithTheme = shallowWithTheme;

configure({ adapter: new Adapter() });
