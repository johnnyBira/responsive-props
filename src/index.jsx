import React, { Component } from "react";
import styledBreakpoint from "@humblebee/styled-components-breakpoint";
import proptypes from "prop-types";
import { css, withTheme } from "styled-components";
import isobject from "isobject";

// Errors
export const InvalidBreakpointError = (bp, breakpoints) =>
  Error(
    `Invalid breakpoint '${bp}', choose one of the defined breakpoints: ${breakpoints.list.join(
      ", "
    )}`
  );

export class ResponsiveProps extends Component {
  static defaultProps = {
    breakpoints: undefined,
    theme: {
      responsiveProps: {
        breakpoint: undefined
      }
    }
  };

  static propTypes = {
    breakpoints: proptypes.shape({}),
    theme: proptypes.shape({})
  };

  static defaultProps = {
    theme: {}
  };

  /**
   * Determains if an arguemnt is in the form of a breakpoint map or not.
   * @method isBreakpointArg
   * @param {*} args - The args to be checked.
   * @return {boolean}
   */
  static isBreakpointArg(args, breakpoints) {
    const argKeys = Object.keys(args);
    // Return early if args are not an object
    if (!isobject(args)) {
      return false;
    }
    // Return false if key is unknown to the listed breakpoints
    for (let i = 0; i < argKeys.length; i += 1) {
      if (breakpoints.list.indexOf(argKeys[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Invokes breakpoint mixins
   * @method invokeBreakpointMixins
   * @param {object} mixinsByBreakpint - Map object of mixins grpuped by breakpoint.
   * @return {array} - Tagged template litteral
   */
  static invokeBreakpointMixins(mixinsByBreakpint, breakpoints, mixins) {
    const emptyBp = (...args) =>
      css`
        ${css(...args)}
      `;
    return Object.keys(mixinsByBreakpint).reduce((acc, bp) => {
      //
      const bpMixin =
        typeof breakpoints[bp] === "undefined" ? emptyBp : breakpoints[bp];
      return [
        ...acc,
        bpMixin`
          ${Object.keys(mixinsByBreakpint[bp]).map(method => {
            const args = mixinsByBreakpint[bp][method];
            // Return method if args are defined
            return () =>
              mixins[method][
                // Invoke function with apply if args are in the form of an array, else use call
                Array.isArray(args) ? "apply" : "call"
              ](null, args);
          })}
        `
      ];
    }, []);
  }

  /**
   * Groups mixin under a matching map key.
   * ie. { xl: { firstMethod: 'argument', secondMethod: 'argument' } }
   * @method groupMixinsByBreakpoint
   * @param {*} props - Props of the wrapped component.
   * @return {object} - Map object of mixins grpuped by breakpoint.
   */
  static groupMixinsByBreakpoint(props, breakpoints, mixins) {
    // Create an object wtih placeholders for each keys in the initial breakpoint order
    let group = {};
    group = breakpoints.list.reduce((acc, bp) => ({ ...acc, [bp]: {} }), {});
    group.noBreakpoint = {};

    const mixinsMap = Object.keys(props).reduce((acc, key) => {
      if (mixins[key]) {
        if (props[key] === null || typeof props[key] === "undefined") {
          return group;
        }
        // Add method to the `noBreakpoint` key, if the props is not an object
        if (!isobject(props[key])) {
          group.noBreakpoint[key] = props[key];
          return group;
        }
        // Add method to it's coresponding breakpoint namespace
        Object.keys(props[key]).forEach(bp => {
          // Validate breakpoint
          if (!(breakpoints.list.indexOf(bp) > -1)) {
            throw new InvalidBreakpointError(bp, breakpoints);
          }
          // Puts the mixins under the correct namespace
          group[bp][key] = props[key][bp];
        });
        return group;
      }
      return group;
    }, {});

    // Remove empty keys from group before return
    return Object.keys(mixinsMap).reduce(
      (acc, key) => ({
        ...acc,
        ...(Object.keys(mixinsMap[key]).length > 0
          ? { [key]: mixinsMap[key] }
          : {})
      }),
      {}
    );
  }

  /**
   * Get's the breakpoints either from props or theme
   * Throws an error if neither is present
   * @method groupMixinsByBreakpoint
   * @param {*} props - Props of the wrapped component.
   * @return {object} - Map object of mixins grpuped by breakpoint.
   */
  static getBreakpointUtils(theme, breakpoints) {
    if (typeof breakpoints !== "undefined") {
      return styledBreakpoint(breakpoints);
    } else if (
      typeof theme !== "undefined" &&
      typeof theme.responsiveProps !== "undefined" &&
      typeof theme.responsiveProps.breakpoints !== "undefined"
    ) {
      return styledBreakpoint(theme.responsiveProps.breakpoints);
    }
    throw new Error(
      "Breakpoints need to be provided either through the prop `breakpoints`, or be present under the theme namesapce `responsiveProps.breakpoints` in a `theme` of a ThemeProvider: https://www.npmjs.com/package/responsive-props#register-breakpoints"
    );
  }

  /**
   * Removes mixins properties from the props object
   * @method filterMixinsFromProps
   * @param {*} props - Props of the wrapped component.
   * @param string[] mixinList - Array of string/keys of the registtred mixins
   * @return {object} - Object filtred out props
   */
  static filterMixinsFromProps(props, mixinList) {
    return Object.keys(props).reduce((acc, key) => {
      if (mixinList.indexOf(key) === -1) {
        acc[key] = props[key];
      }
      return acc;
    }, {});
  }

  render() {
    const {
      wrappedComponent: WrappedComponent,
      breakpoints,
      theme,
      forwardRef,
      mixins,
      ...props
    } = this.props;
    const breakpointUtils = ResponsiveProps.getBreakpointUtils(
      theme,
      breakpoints
    );
    const groupedMethods = ResponsiveProps.groupMixinsByBreakpoint(
      props,
      breakpointUtils,
      mixins
    );
    const invokedMethods = ResponsiveProps.invokeBreakpointMixins(
      groupedMethods,
      breakpointUtils,
      mixins
    );
    const fliteredProps = ResponsiveProps.filterMixinsFromProps(
      this.props,
      Object.keys(mixins)
    );

    return (
      <WrappedComponent
        theme={theme}
        {...fliteredProps}
        ref={forwardRef}
        responsiveProps={invokedMethods}
      />
    );
  }
}

/** HOC props proxy for dealing with responsive props. */
/* Enhances a styled component with the props responsiveProps
 */
const withResponsiveProps = (WrappedComponent, mixins = {}) => {
  return React.forwardRef((props, ref) =>
    React.createElement(withTheme(ResponsiveProps), {
      forwardRef: ref,
      wrappedComponent: WrappedComponent,
      mixins,
      ...props
    })
  );
};

withResponsiveProps.displayName = "responsiveProps";
export default withResponsiveProps;
