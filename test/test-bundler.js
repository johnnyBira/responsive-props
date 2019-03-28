import "jest-enzyme";
import "jest-styled-components";
import { JSDOM } from "jsdom";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import shallowWithTheme from './utils/shallowWithTheme';

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

global.window = window;
global.document = window.document;
// global.shallowWithTheme = shallowWithTheme;

Enzyme.configure({ adapter: new Adapter() });
