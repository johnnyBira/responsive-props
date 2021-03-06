import React, { Component } from "react";
import { mount, shallow } from "enzyme";
import styled, { css, withTheme, ThemeProvider } from "styled-components";
import renderer from "react-test-renderer";
import styledBreakpoint from "@humblebee/styled-components-breakpoint";
import shallowWithTheme from "../test/utils/shallowWithTheme";
import withResponsivePropsHoc, { ResponsiveProps } from "./index";

const bps = {
  xs: 320,
  s: 576,
  m: 768,
  l: 992,
  xl: 1200
};

// Breakpoints
const breakpoint = styledBreakpoint(bps);

const theme = {
  responsiveProps: {
    breakpoints: bps
  }
};

// Spies
const testMethodOne = () => jest.fn();
const testMethodTwo = () => jest.fn();

const mockMixins = {
  testMethodOne,
  testMethodTwo
};

// Compoennt to be wrapped
const TestWrapped = styled.div`
  background: red;
  width: 100px;
  ${({ responsiveProps }) => responsiveProps}
`;

// const withResponsiveProps = withResponsivePropsHoc(breakpoint);

describe("withResponsiveProps", () => {
  describe("methods", () => {
    // groupMixinsByBreakpoint
    describe("groupMixinsByBreakpoint", () => {
      it("retruns a map of mixins groupbed by it's breakpoint", () => {
        const mockProps = {
          testMethodTwo: { xl: 1, xs: 10, s: 30 },
          testMethodOne: { l: 10, s: 10 },
          breakpoints: breakpoint
        };

        const groupedMethods = ResponsiveProps.groupMixinsByBreakpoint(
          mockProps,
          breakpoint,
          mockMixins
        );

        expect(groupedMethods).toMatchSnapshot();
      });

      it("returns an empty object if the props dosen't match any mixins", () => {
        // const wrapper = shallow(<WrappedComponent test="test" breakpoints={breakpoint} />);
        const mockProps = {
          test: "test",
          breakpoints: breakpoint
        };

        // const instance = wrapper.instance();
        const groupedMethods = ResponsiveProps.groupMixinsByBreakpoint(
          mockProps,
          breakpoint,
          mockMixins
        );

        expect(groupedMethods).toEqual({});
      });

      it("Adds mixins under the namespace `noBreakpoint` if the props is not an object", () => {
        const mockProps = {
          testMethodOne: { xl: 1, xs: 10, s: 30 },
          testMethodTwo: 30,
          breakpoints: breakpoint
        };

        const groupedMethods = ResponsiveProps.groupMixinsByBreakpoint(
          mockProps,
          breakpoint,
          mockMixins
        );
        expect(groupedMethods).toMatchSnapshot();
      });

      it("Returns an empty object early, if prop value is nulll or undefined", () => {
        const mockProps = {
          testMethodTwo: undefined
        };

        const groupedMethods = ResponsiveProps.groupMixinsByBreakpoint(
          mockProps,
          breakpoint,
          mockMixins
        );
        expect(groupedMethods).toMatchSnapshot();
      });
    });

    // invokeBreakpointMixins
    describe("invokeBreakpointMixins", () => {
      const bgSpy = jest.fn();
      const paddingSpy = jest.fn();
      const marginSpy = jest.fn();

      const bgMixin = arg => css`
        background: ${arg};
        ${bgSpy(arg)}
      `;

      const paddingMixin = (argOne, argTwo) => css`
        padding: ${argOne};
        ${paddingSpy(argOne, argTwo)}
      `;

      const margingMixin = argOne => css`
        margin: ${argOne};
        ${marginSpy(argOne)}
      `;

      // Wrapped component
      const WrappedComponent = withResponsivePropsHoc(TestWrapped, {
        bgMixin,
        paddingMixin,
        margingMixin
      });

      const wrapper = mount(
        <WrappedComponent
          bgMixin={{ xl: "red", xs: "green", s: "blue" }}
          paddingMixin={{ xl: [5, 15] }}
          margingMixin={10}
          breakpoints={bps}
        />
      );

      it("renders as expected", () => {
        expect(wrapper).toMatchSnapshot();
      });

      it("invokes it's mixin methods", () => {
        expect(bgSpy.mock.calls).toMatchSnapshot();
      });

      it("invokes mixins with multiple paraneters when argument is in the form of an array", () => {
        expect(marginSpy).toHaveBeenCalledWith(10);
      });
    });

    describe("isBreakpointProps", () => {
      const breakpointSpy = () => jest.fn();
      const nonBreakpointSpy = () => jest.fn();
      const WrappedComponent = withResponsivePropsHoc(TestWrapped, {
        breakpointSpy,
        nonBreakpointSpy
      });

      it("returns false when the args are not not an object", () => {
        expect(
          ResponsiveProps.isBreakpointArg([1, 2, 3, 4], breakpoint, mockMixins)
        ).toBe(false);
      });
      it("returns false when a non breakpoint key is found", () => {
        expect(
          ResponsiveProps.isBreakpointArg(
            {
              s: 1,
              m: 2,
              xl: 4,
              unkonwn: 5
            },
            breakpoint,
            mockMixins
          )
        ).toBe(false);
      });
      it("returns true for breakpoiont arguments", () => {
        expect(
          ResponsiveProps.isBreakpointArg(
            { s: 1, m: 2, xl: 4 },
            breakpoint,
            mockMixins
          )
        ).toBe(true);
      });
    });

    describe("withTheme", () => {
      const testMethod = jest.fn();
      // const styleTestMethod = args => css`
      //   mock: ${args};
      //   ${testMethod(args)};
      // `;
      const WrappedComponent = withResponsivePropsHoc(TestWrapped, {
        testMethod
      });

      it("uses the breakpoint utils provided by a theme", () => {
        const wrapper = mount(
          <ThemeProvider theme={theme}>
            <WrappedComponent />
          </ThemeProvider>
        );
        // console.log(wrapper.find(WrappedComponent).instance());
        // expect(wrapper.instance().props.bbre).toMatchSnapshot();
      });

      it("overrides the breakpoint utils provided by theme", () => {
        const wrapper = mount(
          <ThemeProvider theme={theme}>
            <WrappedComponent
              breakpoints={{
                small: 100,
                medium: 200,
                large: 300
              }}
              testMethod={{
                small: 100,
                medium: 200,
                large: 300
              }}
            />
          </ThemeProvider>
        );
        wrapper.update();
        expect(testMethod).toHaveBeenCalledWith(200);
        expect(testMethod.mock.calls).toMatchSnapshot();
      });
    });

    describe("filterMixinsFromProps", () => {
      const testMethodOne = jest.fn();
      const testMethodTwo = jest.fn();
      // const styleTestMethod = args => css`
      //   mock: ${args};
      //   ${testMethod(args)};
      // `;
      const mixins = {
        testMethodOne,
        testMethodTwo
      };
      const WrappedComponent = withResponsivePropsHoc(TestWrapped, { mixins });

      const wrapper = mount(
        <ThemeProvider theme={theme}>
          <WrappedComponent
            breakpoints={{
              small: 100,
              medium: 200,
              large: 300
            }}
            testMethodOne={{
              small: 100,
              medium: 200,
              large: 300
            }}
            testMethodTwo={{
              small: 100,
              medium: 200,
              large: 300
            }}
            testPropOne="Test one"
            testPropTwo="Test two"
          />
        </ThemeProvider>
      );
      wrapper.update();
      const instance = wrapper.find(ResponsiveProps).instance();
      const fliteredProps = ResponsiveProps.filterMixinsFromProps(
        instance.props,
        Object.keys(mixins)
      );

      it("removes mixins properties from the props object", () => {
        // Check unfitered props
        expect(instance.props).toHaveProperty("testMethodOne");
        expect(instance.props).toHaveProperty("testMethodTwo");
        // Check filtered props
        expect(fliteredProps).not.toHaveProperty("testMethodOne");
        expect(fliteredProps).not.toHaveProperty("testMethodTwo");
        expect(fliteredProps).toMatchSnapshot();
      });

      it("keeps props the are not mixins", () => {
        expect(instance.props).toHaveProperty("testPropOne");
        expect(instance.props).toHaveProperty("testPropTwo");
      });
    });
  });

  describe("forwardRef", () => {
    const WrappedComponent = withResponsivePropsHoc(TestWrapped, {});
    const forwardRef = React.createRef(null);

    mount(
      <ThemeProvider theme={theme}>
        <WrappedComponent ref={forwardRef} />
      </ThemeProvider>
    );

    // const instanceOne = wrapperOne.find(WrappedComponent).instance();
    it("returns the underlaying DOM element of the wrapped styled-comoonent via `ref`", () => {
      expect(forwardRef.current).toMatchSnapshot();
    });
  });

  describe("errors", () => {
    // Wrapped component
    const testMethodOne = () => jest.fn();
    const WrappedComponent = withResponsivePropsHoc(TestWrapped, {
      testMethodOne
    });

    it("throws an error when an invalid breakpoint is passed", () => {
      const Wrapper = () =>
        mount(
          <WrappedComponent testMethodOne={{ test: 10 }} breakpoints={bps} />
        );
      // spyOn suppresses unwanted react error
      spyOn(console, "error");
      expect(Wrapper).toThrowErrorMatchingSnapshot();
    });

    it("throws an error when an breakpoints are neither present in theme or prop", () => {
      const Wrapper = () =>
        mount(<WrappedComponent testMethodOne={{ test: 10 }} />);
      // spyOn suppresses unwanted react error
      spyOn(console, "error");
      expect(Wrapper).toThrowErrorMatchingSnapshot();
    });
  });
});
