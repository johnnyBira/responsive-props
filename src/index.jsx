import React, { Component } from 'react';
import styledBreakpoint from '@humblebee/styled-components-breakpoint';
import proptypes from 'prop-types';
import { css, withTheme } from 'styled-components';
import isobject from 'isobject';

// Errors
export const InvalidBreakpointError = (bp, breakpoints) => (
  Error(`Invalid breakpoint '${bp}', choose one of the defined breakpoints: ${breakpoints.list.join(', ')}`)
);

/** HOC props proxy for dealing with responsive props. */
/* Enhances a styled component with the props responsiveProps
*/
const withResponsiveProps = (WrappedComponent, mixins = {}) => {
  class responsiveProps extends Component {
    static defaultProps = {
      breakpoints: undefined,
      theme: {
        responsiveProps: {
          breakpoint: undefined,
        },
      },
    };

    static propTypes = {
      breakpoints: proptypes.shape({}),
      theme: proptypes.shape({}),
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
    static invokeBreakpointMixins(mixinsByBreakpint, breakpoints) {
      const emptyBp = (...args) => css`${css(...args)}`;
      return (
        Object.keys(mixinsByBreakpint).reduce((acc, bp) => {
          //
          const bpMixin = typeof breakpoints[bp] === 'undefined' ? emptyBp : breakpoints[bp];
          return (
            [...acc, bpMixin`
            ${Object.keys(mixinsByBreakpint[bp]).map((method) => {
              const args = mixinsByBreakpint[bp][method];
              // Return method if args are defined
              return () => mixins[method][
                // Invoke function with apply if args are in the form of an array, else use call
                Array.isArray(args) ? 'apply' : 'call'
              ](null, args);
            })}
          `]
          );
        }, [])
      );
    }

    /**
     * Groups mixin under a matching map key.
     * ie. { xl: { firstMethod: 'argument', secondMethod: 'argument' } }
     * @method groupMixinsByBreakpoint
     * @param {*} props - Props of the wrapped component.
     * @return {object} - Map object of mixins grpuped by breakpoint.
     */
    static groupMixinsByBreakpoint(props, breakpoints) {
      // Create an object wtih placeholders for each keys in the initial breakpoint order
      let group = {};
      group = breakpoints.list.reduce((acc, bp) => ({ ...acc, [bp]: {} }), {});
      group.noBreakpoint = {};

      const mixinsMap = (
        Object.keys(props).reduce((acc, key) => {
          if (mixins[key]) {
            if (props[key] === null || typeof props[key] === 'undefined') {
              return group;
            }
            // Add method to the `noBreakpoint` key, if the props is not an object
            if (!isobject(props[key])) {
              group.noBreakpoint[key] = props[key];
              return group;
            }
            // Add method to it's coresponding breakpoint namespace
            (Object.keys(props[key]).forEach((bp) => {
              // Validate breakpoint
              if (!(breakpoints.list.indexOf(bp) > -1)) {
                throw new InvalidBreakpointError(bp, breakpoints);
              }
              // Puts the mixins under the correct namespace
              group[bp][key] = props[key][bp];
            }));
            return group;
          }
          return group;
        }, {})
      );

      // Remove empty keys from group before return
      return (
        Object.keys(mixinsMap).reduce((acc, key) => ({
          ...acc, ...Object.keys(mixinsMap[key]).length > 0 ? { [key]: mixinsMap[key] } : {},
        }), {})
      );
    }

    /**
     * Get's the breakpoint util either from props or theme
     * Throws an error if neither is present
     * @method groupMixinsByBreakpoint
     * @param {*} props - Props of the wrapped component.
     * @return {object} - Map object of mixins grpuped by breakpoint.
     */
    static getBreakpointUtils(theme, breakpoints) {
      if (typeof breakpoints !== 'undefined') {
        return styledBreakpoint(breakpoints);
      } else if (typeof theme.responsiveProps.breakpoint !== 'undefined') {
        return styledBreakpoint(theme.responsiveProps.breakpoint);
      }
      throw new Error('Breakpoint utils need to be provided either as the prop `breakpoints`, or be present under the theme namesapce `responsiveProps.breakpoint` the `theme` of a ThemeProvider');
    }

    render() {
      const { breakpoints, theme, ...props } = this.props;
      const breakpointUtils = responsiveProps.getBreakpointUtils(theme, breakpoints);
      const groupedMethods = responsiveProps.groupMixinsByBreakpoint(props, breakpointUtils);
      const invokedMethods = responsiveProps.invokeBreakpointMixins(
        groupedMethods,
        breakpointUtils,
      );
      return (
        <WrappedComponent theme={theme} {...this.props} responsiveProps={invokedMethods} />
      );
    }
  }

  return withTheme(responsiveProps);
};

// withResponsivePropsHoc.displayName = 'Row';
export default withResponsiveProps;
