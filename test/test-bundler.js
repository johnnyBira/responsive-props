import "jest-enzyme";
import "jest-styled-components";
import { JSDOM } from "jsdom";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import shallowWithTheme from './utils/shallowWithTheme';

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
global.document = jsdom.doc;
global.window = jsdom.defaultView;
// global.shallowWithTheme = shallowWithTheme;

configure({ adapter: new Adapter() });
