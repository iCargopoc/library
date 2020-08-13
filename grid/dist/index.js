function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ClickAwayListener = _interopDefault(require('react-click-away-listener'));
var reactTable = require('react-table');
var reactWindow = require('react-window');
var AutoSizer = _interopDefault(require('react-virtualized-auto-sizer'));
var InfiniteLoader = _interopDefault(require('react-window-infinite-loader'));
var reactDnd = require('react-dnd');
var reactDndHtml5Backend = require('react-dnd-html5-backend');
var reactDndTouchBackend = require('react-dnd-touch-backend');
var MultiBackend = require('react-dnd-multi-backend');
var MultiBackend__default = _interopDefault(MultiBackend);
var update = _interopDefault(require('immutability-helper'));
var JsPdf = _interopDefault(require('jspdf'));
require('jspdf-autotable');
var FileSaver = require('file-saver');
var XLSX = require('xlsx');
require('!style-loader!css-loader!sass-loader!./Styles/main.scss');

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}var AsyncMode=l;var ConcurrentMode=m;var ContextConsumer=k;var ContextProvider=h;var Element=c;var ForwardRef=n;var Fragment=e;var Lazy=t;var Memo=r;var Portal=d;
var Profiler=g;var StrictMode=f;var Suspense=p;var isAsyncMode=function(a){return A(a)||z(a)===l};var isConcurrentMode=A;var isContextConsumer=function(a){return z(a)===k};var isContextProvider=function(a){return z(a)===h};var isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};var isForwardRef=function(a){return z(a)===n};var isFragment=function(a){return z(a)===e};var isLazy=function(a){return z(a)===t};
var isMemo=function(a){return z(a)===r};var isPortal=function(a){return z(a)===d};var isProfiler=function(a){return z(a)===g};var isStrictMode=function(a){return z(a)===f};var isSuspense=function(a){return z(a)===p};
var isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};var typeOf=z;

var reactIs_production_min = {
	AsyncMode: AsyncMode,
	ConcurrentMode: ConcurrentMode,
	ContextConsumer: ContextConsumer,
	ContextProvider: ContextProvider,
	Element: Element,
	ForwardRef: ForwardRef,
	Fragment: Fragment,
	Lazy: Lazy,
	Memo: Memo,
	Portal: Portal,
	Profiler: Profiler,
	StrictMode: StrictMode,
	Suspense: Suspense,
	isAsyncMode: isAsyncMode,
	isConcurrentMode: isConcurrentMode,
	isContextConsumer: isContextConsumer,
	isContextProvider: isContextProvider,
	isElement: isElement,
	isForwardRef: isForwardRef,
	isFragment: isFragment,
	isLazy: isLazy,
	isMemo: isMemo,
	isPortal: isPortal,
	isProfiler: isProfiler,
	isStrictMode: isStrictMode,
	isSuspense: isSuspense,
	isValidElementType: isValidElementType,
	typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}
});

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var CellDisplayAndEditContext = React.createContext({});
var RowEditContext = React.createContext({});
var AdditionalColumnContext = React.createContext({});

var checkInnerCells = function checkInnerCells(column, cellKey) {
  if (column) {
    var innerCells = column.innerCells;

    if (innerCells) {
      var innerCellData = innerCells.find(function (cell) {
        return cell.accessor === cellKey;
      });

      if (innerCellData) {
        return true;
      }
    }
  }

  return false;
};

var CellDisplayAndEditTag = function CellDisplayAndEditTag(props) {
  var contextVallues = React.useContext(CellDisplayAndEditContext);
  var column = contextVallues.column,
      columns = contextVallues.columns;
  var cellKey = props.cellKey,
      columnKey = props.columnKey;

  if (columns && columnKey) {
    var selectedColumn = columns.find(function (col) {
      return col.accessor === columnKey;
    });

    if (checkInnerCells(selectedColumn, cellKey)) {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: "CellDisplayAndEditFragment"
      }, props.children);
    }
  } else if (cellKey) {
    if (checkInnerCells(column, cellKey)) {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: "CellDisplayAndEditFragment"
      }, props.children);
    }
  }

  return null;
};

CellDisplayAndEditTag.propTypes = {
  cellKey: propTypes.any,
  columnKey: propTypes.any,
  children: propTypes.any
};

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}

var _ref = /*#__PURE__*/React.createElement("path", {
  d: "M1.69 9.155h.706l.6-.6-1.55-1.552-.601.601v.706h.845v.845zm4.112-6.013a.153.153 0 00.046-.112c0-.097-.048-.146-.145-.146a.153.153 0 00-.112.047L2.013 6.508a.153.153 0 00-.046.112c0 .097.048.146.145.146a.153.153 0 00.112-.047l3.578-3.577zM0 7.254l5.492-5.492 2.746 2.746L2.746 10H0V7.254zm9.756-5.459a.845.845 0 01.244.601.809.809 0 01-.244.594L8.66 4.086 5.914 1.34 7.01.25A.784.784 0 017.604 0a.82.82 0 01.6.25l1.552 1.545z",
  fill: "#80a0a2"
});

function SvgIconPencil(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    width: 10,
    height: 10
  }, props), _ref);
}

function _extends$2() {
  _extends$2 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$2.apply(this, arguments);
}

var _ref$1 = /*#__PURE__*/React.createElement("path", {
  d: "M13.747 1.519a.868.868 0 01.253.63.868.868 0 01-.253.629L7.207 9.48l-1.228 1.26a.826.826 0 01-.614.259.826.826 0 01-.614-.26L3.523 9.482.253 6.13A.868.868 0 010 5.5c0-.247.084-.457.253-.63L1.48 3.611a.826.826 0 01.614-.26c.241 0 .446.087.615.26l2.655 2.732L11.29.259A.826.826 0 0111.905 0c.24 0 .445.086.614.26l1.228 1.259z",
  fill: "#fff",
  fillOpacity: 0.996
});

function SvgIconTick(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$2({
    width: 14,
    height: 11
  }, props), _ref$1);
}

function _extends$3() {
  _extends$3 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$3.apply(this, arguments);
}

var _ref$2 = /*#__PURE__*/React.createElement("path", {
  d: "M10.74 8.222c.174.173.26.383.26.63a.857.857 0 01-.26.63L9.482 10.74a.857.857 0 01-.63.259.857.857 0 01-.629-.26L5.5 8.02 2.778 10.74a.857.857 0 01-.63.259.857.857 0 01-.63-.26L.26 9.482A.857.857 0 010 8.851c0-.246.086-.456.26-.629L2.98 5.5.26 2.778A.857.857 0 010 2.148c0-.247.086-.457.26-.63L1.518.26A.857.857 0 012.149 0c.246 0 .456.086.629.26L5.5 2.98 8.222.26A.857.857 0 018.852 0c.247 0 .457.086.63.26l1.259 1.259c.173.172.259.382.259.63a.857.857 0 01-.26.629L8.02 5.5l2.722 2.722z",
  fill: "gray",
  fillOpacity: 0.349
});

function SvgIconCancel(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    width: 11,
    height: 11
  }, props), _ref$2);
}

var CellDisplayAndEdit = React.memo(function (_ref) {
  var row = _ref.row,
      columns = _ref.columns,
      updateRowInGrid = _ref.updateRowInGrid;
  var column = row.column;

  if (column && row.row) {
    var _useState = React.useState(false),
        isEditOpen = _useState[0],
        setIsEditOpen = _useState[1];

    var _useState2 = React.useState(null),
        editedRowValue = _useState2[0],
        setEditedRowValue = _useState2[1];

    var id = column.id;

    var closeEdit = function closeEdit() {
      setIsEditOpen(false);
    };

    var openEdit = function openEdit() {
      setIsEditOpen(true);
    };

    var getUpdatedRowValue = function getUpdatedRowValue(value) {
      if (value) {
        setEditedRowValue(value);
      }
    };

    var saveEdit = function saveEdit() {
      if (editedRowValue) {
        updateRowInGrid(row.row.original, editedRowValue);
      }

      closeEdit();
    };

    var originalRowValue = _extends({}, row.row.original);

    var cellDisplayContent = column.displayCell(originalRowValue, CellDisplayAndEditTag);
    var cellEditContent = column.editCell ? column.editCell(originalRowValue, CellDisplayAndEditTag, getUpdatedRowValue) : null;
    var columnsToPass = columns;
    var columnToPass = column;
    return /*#__PURE__*/React__default.createElement(CellDisplayAndEditContext.Provider, {
      value: {
        columns: columnsToPass,
        column: columnToPass
      }
    }, /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: closeEdit
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "table-cell--content table-cell--content__" + id
    }, cellEditContent ? /*#__PURE__*/React__default.createElement("div", {
      className: "cell-edit",
      role: "presentation",
      onClick: openEdit
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconPencil, null))) : null, cellDisplayContent, isEditOpen ? /*#__PURE__*/React__default.createElement("div", {
      className: "table-cell--content-edit"
    }, cellEditContent, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      "aria-label": "Cell Edit Save Button",
      className: "ok",
      "data-testid": "ok",
      onClick: saveEdit
    }, /*#__PURE__*/React__default.createElement(SvgIconTick, null)), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      "aria-label": "Cell Edit Cancel Button",
      className: "cancel",
      "data-testid": "cancel",
      onClick: closeEdit
    }, /*#__PURE__*/React__default.createElement(SvgIconCancel, null))) : null)));
  }

  return null;
});
CellDisplayAndEdit.propTypes = {
  row: propTypes.any,
  columns: propTypes.any,
  updateRowInGrid: propTypes.any
};

var extractColumns = function extractColumns(columns, searchColumn, isDesktop, updateRowInGrid) {
  var filteredColumns = columns.filter(function (column) {
    return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
  });
  var modifiedColumns = [];
  filteredColumns.forEach(function (column, index) {
    var originalInnerCells = column.originalInnerCells,
        innerCells = column.innerCells,
        accessor = column.accessor,
        sortValue = column.sortValue;
    var isInnerCellsPresent = innerCells && innerCells.length > 0;
    var isOriginalInnerCellsPresent = originalInnerCells && originalInnerCells.length > 0;
    var elem = column;
    elem.columnId = "column_" + index;
    elem.displayInExpandedRegion = false;

    if (!isOriginalInnerCellsPresent && isInnerCellsPresent) {
      elem.originalInnerCells = innerCells;
    }

    if (!elem.Cell && elem.displayCell) {
      elem.Cell = function (row) {
        return /*#__PURE__*/React__default.createElement(CellDisplayAndEdit, {
          row: row,
          columns: columns,
          updateRowInGrid: updateRowInGrid
        });
      };
    }

    if (!elem.disableSortBy) {
      if (isInnerCellsPresent) {
        if (sortValue) {
          elem.sortType = function (rowA, rowB) {
            return rowA.original[accessor][sortValue] > rowB.original[accessor][sortValue] ? -1 : 1;
          };
        } else {
          elem.disableSortBy = true;
        }
      } else if (!innerCells) {
        elem.sortType = function (rowA, rowB) {
          return rowA.original[accessor] > rowB.original[accessor] ? -1 : 1;
        };
      }
    }

    if (!elem.disableFilters) {
      elem.filter = function (rows, id, filterValue) {
        var searchText = filterValue ? filterValue.toLowerCase() : "";
        return rows.filter(function (row) {
          var original = row.original;
          return searchColumn(column, original, searchText);
        });
      };
    }

    modifiedColumns.push(column);
  });
  return modifiedColumns;
};
var extractAdditionalColumn = function extractAdditionalColumn(additionalColumn, isDesktop) {
  var originalInnerCells = additionalColumn.originalInnerCells,
      innerCells = additionalColumn.innerCells;
  var isInnerCellsPresent = innerCells && innerCells.length > 0;
  var isOriginalInnerCellsPresent = originalInnerCells && originalInnerCells.length > 0;
  var element = additionalColumn;
  element.columnId = "ExpandColumn";
  element.displayInExpandedRegion = true;

  if (isInnerCellsPresent) {
    var filteredInnerCells = innerCells.filter(function (cell) {
      return isDesktop ? !cell.onlyInTablet : !cell.onlyInDesktop;
    });
    element.innerCells = filteredInnerCells;

    if (!isOriginalInnerCellsPresent) {
      element.originalInnerCells = filteredInnerCells;
    }
  }

  return additionalColumn;
};

var AdditionalColumnTag = function AdditionalColumnTag(props) {
  var contextVallues = React.useContext(AdditionalColumnContext);
  var additionalColumn = contextVallues.additionalColumn;
  var cellKey = props.cellKey;

  if (additionalColumn && cellKey) {
    if (checkInnerCells(additionalColumn, cellKey)) {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: "AdditionalColumnFragment"
      }, props.children);
    }
  }

  return null;
};

AdditionalColumnTag.propTypes = {
  cellKey: propTypes.any,
  children: propTypes.any
};

var RowSelector = React.memo(React.forwardRef(function (_ref, ref) {
  var indeterminate = _ref.indeterminate,
      rest = _objectWithoutPropertiesLoose(_ref, ["indeterminate"]);

  var _useState = React.useState(indeterminate),
      checkValue = _useState[0],
      setCheckValue = _useState[1];

  var defaultRef = React.useRef();
  var resolvedRef = ref || defaultRef;

  var onChange = function onChange() {
    setCheckValue(!indeterminate);
  };

  React.useEffect(function () {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "check-wrap"
  }, /*#__PURE__*/React__default.createElement("input", _extends({
    type: "checkbox",
    checked: checkValue,
    onChange: onChange,
    ref: resolvedRef
  }, rest)));
}));
RowSelector.propTypes = {
  indeterminate: propTypes.any
};

var DefaultColumnFilter = React.memo(function (_ref) {
  var _ref$column = _ref.column,
      filterValue = _ref$column.filterValue,
      setFilter = _ref$column.setFilter;
  return /*#__PURE__*/React__default.createElement("input", {
    className: "txt",
    value: filterValue || "",
    onChange: function onChange(e) {
      setFilter(e.target.value || undefined);
    },
    placeholder: "Search"
  });
});
DefaultColumnFilter.propTypes = {
  column: propTypes.any
};

function _extends$4() {
  _extends$4 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$4.apply(this, arguments);
}

var _ref$3 = /*#__PURE__*/React.createElement("path", {
  d: "M6.746 6.746c.58-.58.87-1.277.87-2.092 0-.815-.29-1.513-.87-2.092a2.852 2.852 0 00-2.092-.87c-.815 0-1.513.29-2.092.87-.58.58-.87 1.277-.87 2.092 0 .815.29 1.513.87 2.092.58.58 1.277.87 2.092.87.815 0 1.513-.29 2.092-.87zm4.01 2.813a.81.81 0 01.244.595c0 .229-.084.427-.251.595a.813.813 0 01-.595.251.786.786 0 01-.595-.251L7.29 8.488a4.527 4.527 0 01-2.637.82c-.63 0-1.233-.123-1.808-.367a4.653 4.653 0 01-1.488-.992 4.653 4.653 0 01-.991-1.487A4.573 4.573 0 010 4.654c0-.63.122-1.233.367-1.808.244-.575.575-1.071.991-1.488A4.653 4.653 0 012.846.367 4.573 4.573 0 014.654 0c.63 0 1.233.122 1.808.367.575.244 1.07.575 1.487.991.417.417.747.913.992 1.488.244.575.367 1.178.367 1.808 0 .97-.274 1.849-.82 2.637l2.267 2.268z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconSearch(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    width: 11,
    height: 11
  }, props), _ref$3);
}

var GlobalFilter = React.memo(function (_ref) {
  var globalFilter = _ref.globalFilter,
      setGlobalFilter = _ref.setGlobalFilter;

  var _useState = React.useState(globalFilter),
      value = _useState[0],
      setValue = _useState[1];

  var _onChange = reactTable.useAsyncDebounce(function (changedValue) {
    setGlobalFilter(changedValue || undefined);
  }, 200);

  return /*#__PURE__*/React__default.createElement("div", {
    className: "txt-wrap"
  }, /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    value: value || "",
    onChange: function onChange(e) {
      setValue(e.target.value);

      _onChange(e.target.value);
    },
    className: "txt",
    placeholder: "Search"
  }), /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconSearch, null)));
});
GlobalFilter.propTypes = {
  globalFilter: propTypes.any,
  setGlobalFilter: propTypes.any
};

function _extends$5() {
  _extends$5 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$5.apply(this, arguments);
}

var _ref$4 = /*#__PURE__*/React.createElement("path", {
  d: "M3.93 4.57c.047.047.07.107.07.18v4.5a.243.243 0 01-.07.18.243.243 0 01-.18.07h-.5a.243.243 0 01-.18-.07.243.243 0 01-.07-.18v-4.5c0-.073.023-.133.07-.18a.243.243 0 01.18-.07h.5c.073 0 .133.023.18.07zm2 0c.047.047.07.107.07.18v4.5a.243.243 0 01-.07.18.243.243 0 01-.18.07h-.5a.243.243 0 01-.18-.07.243.243 0 01-.07-.18v-4.5c0-.073.023-.133.07-.18a.243.243 0 01.18-.07h.5c.073 0 .133.023.18.07zm2 0c.047.047.07.107.07.18v4.5a.243.243 0 01-.07.18.243.243 0 01-.18.07h-.5a.243.243 0 01-.18-.07.243.243 0 01-.07-.18v-4.5c0-.073.023-.133.07-.18a.243.243 0 01.18-.07h.5c.073 0 .133.023.18.07zm1.015 6.153A.887.887 0 009 10.406V3H2v7.406a.887.887 0 00.168.528c.039.044.066.066.082.066h6.5c.016 0 .043-.022.082-.066a.7.7 0 00.113-.211zM4.133 1.086L3.75 2h3.5l-.375-.914A.22.22 0 006.742 1H4.266a.22.22 0 00-.133.086zm6.797.984c.047.047.07.107.07.18v.5a.243.243 0 01-.07.18.243.243 0 01-.18.07H10v7.406c0 .433-.122.806-.367 1.121-.245.315-.54.473-.883.473h-6.5c-.344 0-.638-.152-.883-.457C1.122 11.238 1 10.87 1 10.438V3H.25a.243.243 0 01-.18-.07.243.243 0 01-.07-.18v-.5c0-.073.023-.133.07-.18A.243.243 0 01.25 2h2.414L3.211.695c.078-.192.219-.356.422-.492C3.836.068 4.042 0 4.25 0h2.5c.208 0 .414.068.617.203.203.136.344.3.422.492L8.336 2h2.414c.073 0 .133.023.18.07z",
  fill: "#636c8c"
});

function SvgRowDelete(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$5({
    width: 11,
    height: 12
  }, props), _ref$4);
}

function _extends$6() {
  _extends$6 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$6.apply(this, arguments);
}

var _ref$5 = /*#__PURE__*/React.createElement("path", {
  d: "M1.69 9.155h.706l.6-.6-1.55-1.552-.601.601v.706h.845v.845zm4.112-6.013a.153.153 0 00.046-.112c0-.097-.048-.146-.145-.146a.153.153 0 00-.112.047L2.013 6.508a.153.153 0 00-.046.112c0 .097.048.146.145.146a.153.153 0 00.112-.047l3.578-3.577zM0 7.254l5.492-5.492 2.746 2.746L2.746 10H0V7.254zm9.756-5.459a.845.845 0 01.244.601.809.809 0 01-.244.594L8.66 4.086 5.914 1.34 7.01.25A.784.784 0 017.604 0a.82.82 0 01.6.25l1.552 1.545z",
  fill: "#636c8c"
});

function SvgRowEdit(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$6({
    width: 10,
    height: 10
  }, props), _ref$5);
}

var RowOptions = React.memo(function (_ref) {
  var row = _ref.row,
      rowActions = _ref.rowActions,
      rowActionCallback = _ref.rowActionCallback,
      bindRowEditOverlay = _ref.bindRowEditOverlay,
      bindRowDeleteOverlay = _ref.bindRowDeleteOverlay;
  var original = row.original;
  var isAdditionalRowOptionsPresent = rowActions && rowActions.length > 0 && typeof rowActionCallback === "function";

  var _useState = React.useState(false),
      isRowOptionsOpen = _useState[0],
      setRowOptionsOpen = _useState[1];

  var openRowOptionsOverlay = function openRowOptionsOverlay() {
    setRowOptionsOpen(true);
  };

  var closeRowOptionsOverlay = function closeRowOptionsOverlay() {
    setRowOptionsOpen(false);
  };

  var openRowEditOverlay = function openRowEditOverlay() {
    bindRowEditOverlay(original);
    closeRowOptionsOverlay();
  };

  var openDeleteOverlay = function openDeleteOverlay() {
    bindRowDeleteOverlay(original);
    closeRowOptionsOverlay();
  };

  var additionalActionClicked = function additionalActionClicked(actionValue) {
    return rowActionCallback(original, actionValue);
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "row-options-wrap"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "icon-row-options",
    role: "presentation",
    onClick: openRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("i", null), /*#__PURE__*/React__default.createElement("i", null), /*#__PURE__*/React__default.createElement("i", null)), isRowOptionsOpen ? /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    onClickAway: closeRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "row-options-overlay"
  }, /*#__PURE__*/React__default.createElement("ul", null, /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("span", {
    role: "presentation",
    onClick: openRowEditOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgRowEdit, null)), /*#__PURE__*/React__default.createElement("span", null, "Edit"))), /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("span", {
    role: "presentation",
    onClick: openDeleteOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgRowDelete, null)), /*#__PURE__*/React__default.createElement("span", null, "Delete"))), isAdditionalRowOptionsPresent ? rowActions.map(function (action) {
    var value = action.value,
        label = action.label;
    return /*#__PURE__*/React__default.createElement("li", {
      key: value
    }, /*#__PURE__*/React__default.createElement("span", {
      role: "presentation",
      onClick: function onClick() {
        return additionalActionClicked(value);
      }
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "default"
    }), /*#__PURE__*/React__default.createElement("span", null, label)));
  }) : null), /*#__PURE__*/React__default.createElement("span", {
    role: "presentation",
    className: "close",
    onClick: closeRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconCancel, null))))) : null));
});
RowOptions.propTypes = {
  row: propTypes.any,
  rowActions: propTypes.any,
  rowActionCallback: propTypes.any,
  bindRowEditOverlay: propTypes.any,
  bindRowDeleteOverlay: propTypes.any
};

var RowEditTag = function RowEditTag(props) {
  var contextVallues = React.useContext(RowEditContext);
  var columns = contextVallues.columns,
      additionalColumn = contextVallues.additionalColumn,
      isRowExpandEnabled = contextVallues.isRowExpandEnabled;
  var cellKey = props.cellKey,
      columnKey = props.columnKey;

  if (columns && columnKey) {
    var selectedColumn = columns.find(function (col) {
      return col.accessor === columnKey;
    });

    if (selectedColumn && cellKey) {
      if (checkInnerCells(selectedColumn, cellKey)) {
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
          key: "RowEditFragment"
        }, props.children);
      }
    } else if (!selectedColumn && isRowExpandEnabled && additionalColumn) {
      if (checkInnerCells(additionalColumn, columnKey)) {
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
          key: "RowEditFragment"
        }, props.children);
      }
    }
  }

  return null;
};

RowEditTag.propTypes = {
  cellKey: propTypes.any,
  columnKey: propTypes.any,
  children: propTypes.any
};

var RowEditOverLay = React.memo(function (_ref) {
  var row = _ref.row,
      columns = _ref.columns,
      isRowExpandEnabled = _ref.isRowExpandEnabled,
      additionalColumn = _ref.additionalColumn,
      getRowEditOverlay = _ref.getRowEditOverlay,
      closeRowEditOverlay = _ref.closeRowEditOverlay,
      updateRowInGrid = _ref.updateRowInGrid;

  var _useState = React.useState(null),
      editedRowValue = _useState[0],
      setEditedRowValue = _useState[1];

  var getUpdatedRowValue = function getUpdatedRowValue(value) {
    if (value) {
      setEditedRowValue(value);
    }
  };

  var saveRowEdit = function saveRowEdit() {
    if (editedRowValue) {
      updateRowInGrid(row, editedRowValue);
    }

    closeRowEditOverlay();
  };

  var originalRowValue = _extends({}, row);

  var rowEditContent = getRowEditOverlay(originalRowValue, RowEditTag, getUpdatedRowValue);
  return /*#__PURE__*/React__default.createElement(RowEditContext.Provider, {
    value: {
      columns: columns,
      additionalColumn: additionalColumn,
      isRowExpandEnabled: isRowExpandEnabled
    }
  }, /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    className: "row-option-action-overlay",
    onClickAway: closeRowEditOverlay
  }, rowEditContent, /*#__PURE__*/React__default.createElement("div", {
    className: "cancel-save-buttons"
  }, /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "save-Button",
    onClick: saveRowEdit
  }, "Save"), /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "cancel-Button",
    onClick: closeRowEditOverlay
  }, "Cancel"))));
});
RowEditOverLay.propTypes = {
  row: propTypes.any,
  columns: propTypes.any,
  isRowExpandEnabled: propTypes.any,
  additionalColumn: propTypes.any,
  getRowEditOverlay: propTypes.any,
  closeRowEditOverlay: propTypes.any,
  updateRowInGrid: propTypes.any
};

var RowDeleteOverLay = React.memo(function (_ref) {
  var row = _ref.row,
      closeRowDeleteOverlay = _ref.closeRowDeleteOverlay,
      deleteRowFromGrid = _ref.deleteRowFromGrid;

  var deleteRow = function deleteRow() {
    if (row) {
      deleteRowFromGrid(row);
    }

    closeRowDeleteOverlay();
  };

  return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    className: "row-option-action-overlay delete",
    onClickAway: closeRowDeleteOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "cancel-save-buttons-delete"
  }, /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "delete-Button",
    onClick: deleteRow
  }, "Delete"), /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "cancel-Button",
    onClick: closeRowDeleteOverlay
  }, "Cancel")));
});
RowDeleteOverLay.propTypes = {
  row: propTypes.any,
  closeRowDeleteOverlay: propTypes.any,
  deleteRowFromGrid: propTypes.any
};

var ItemTypes = {
  COLUMN: "column"
};

function _extends$7() {
  _extends$7 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$7.apply(this, arguments);
}

var _ref$6 = /*#__PURE__*/React.createElement("path", {
  d: "M9.876 7.334A.45.45 0 0110 7.65v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 8.55v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 4.05v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 4.95v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 .45v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 1.35v-.9A.45.45 0 01.124.134.386.386 0 01.417 0h9.166c.113 0 .21.045.293.134z",
  fill: "#1a4769",
  fillOpacity: 0.498
});

function SvgIconAlignJustify(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$7({
    width: 10,
    height: 9
  }, props), _ref$6);
}

var ColumnItem = function ColumnItem(_ref) {
  var id = _ref.id,
      Header = _ref.Header,
      moveColumn = _ref.moveColumn,
      findColumn = _ref.findColumn,
      originalInnerCells = _ref.originalInnerCells,
      isInnerCellSelected = _ref.isInnerCellSelected,
      selectInnerCells = _ref.selectInnerCells;
  var originalIndex = findColumn(id).index;

  var _useDrag = reactDnd.useDrag({
    item: {
      type: ItemTypes.COLUMN,
      id: id,
      originalIndex: originalIndex
    },
    collect: function collect(monitor) {
      return {
        isDragging: monitor.isDragging()
      };
    },
    end: function end(dropResult, monitor) {
      var monitorGetItemValue = monitor.getItem();
      var droppedId = monitorGetItemValue.id;
      var newOriginalIndex = monitorGetItemValue.originalIndex;
      var didDrop = monitor.didDrop();

      if (!didDrop) {
        moveColumn(droppedId, newOriginalIndex);
      }
    }
  }),
      isDragging = _useDrag[0].isDragging,
      drag = _useDrag[1];

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes.COLUMN,
    canDrop: function canDrop() {
      return false;
    },
    hover: function hover(_ref2) {
      var draggedId = _ref2.id;

      if (draggedId !== id) {
        var _findColumn = findColumn(id),
            overIndex = _findColumn.index;

        moveColumn(draggedId, overIndex);
      }
    }
  }),
      drop = _useDrop[1];

  var opacity = isDragging ? 0.1 : 1;
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      opacity: opacity
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "column__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    "data-testid": "columnItem",
    ref: function ref(node) {
      return drag(drop(node));
    },
    style: {
      cursor: "move"
    },
    className: "column_drag"
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconAlignJustify, null))), /*#__PURE__*/React__default.createElement("div", null, Header), /*#__PURE__*/React__default.createElement("div", {
    className: "column__innerCells__wrap"
  }, originalInnerCells && originalInnerCells.length > 0 ? originalInnerCells.map(function (cell) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "column__wrap",
      key: cell.Header + "_" + cell.accessor
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      "data-columnheader": Header,
      value: cell.Header,
      checked: isInnerCellSelected(Header, cell.Header),
      onChange: selectInnerCells
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__txt"
    }, cell.Header));
  }) : null)));
};

ColumnItem.propTypes = {
  id: propTypes.any,
  Header: propTypes.any,
  moveColumn: propTypes.any,
  findColumn: propTypes.any,
  originalInnerCells: propTypes.any,
  isInnerCellSelected: propTypes.any,
  selectInnerCells: propTypes.any
};

var ColumnsList = function ColumnsList(props) {
  var updateColumnsInState = props.updateColumnsInState,
      columnsToManage = props.columnsToManage,
      isInnerCellSelected = props.isInnerCellSelected,
      selectInnerCells = props.selectInnerCells;

  var findColumn = function findColumn(columnId) {
    var column = columnsToManage.filter(function (c) {
      return "" + c.columnId === columnId;
    })[0];
    return {
      column: column,
      index: columnsToManage.indexOf(column)
    };
  };

  var moveColumn = function moveColumn(columnId, atIndex) {
    var _findColumn = findColumn(columnId),
        column = _findColumn.column,
        index = _findColumn.index;

    updateColumnsInState(update(columnsToManage, {
      $splice: [[index, 1], [atIndex, 0, column]]
    }));
  };

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes.COLUMN
  }),
      drop = _useDrop[1];

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
    key: "ColumnManageFragment"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, columnsToManage.map(function (column) {
    return /*#__PURE__*/React__default.createElement(ColumnItem, {
      key: column.columnId,
      id: "" + column.columnId,
      Header: "" + column.Header,
      moveColumn: moveColumn,
      findColumn: findColumn,
      originalInnerCells: column.originalInnerCells,
      isInnerCellSelected: isInnerCellSelected,
      selectInnerCells: selectInnerCells
    });
  })));
};

ColumnsList.propTypes = {
  updateColumnsInState: propTypes.any,
  columnsToManage: propTypes.any,
  isInnerCellSelected: propTypes.any,
  selectInnerCells: propTypes.any
};

function _extends$8() {
  _extends$8 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$8.apply(this, arguments);
}

var _ref$7 = /*#__PURE__*/React.createElement("path", {
  d: "M13.67 10.465c.22.22.33.487.33.801 0 .314-.11.581-.33.801l-1.603 1.603c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L7 10.205 3.535 13.67c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L.33 12.067c-.22-.22-.33-.487-.33-.801 0-.314.11-.581.33-.801L3.795 7 .33 3.535C.11 3.315 0 3.048 0 2.734c0-.314.11-.581.33-.801L1.933.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33L7 3.795 10.465.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33l1.603 1.603c.22.22.33.487.33.801 0 .314-.11.581-.33.801L10.205 7l3.465 3.465z",
  fill: "#3c476f",
  fillOpacity: 0.71
});

function SvgIconClose(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$8({
    width: 14,
    height: 14
  }, props), _ref$7);
}

var ColumnReordering = React.memo(function (props) {
  var isManageColumnOpen = props.isManageColumnOpen,
      toggleManageColumns = props.toggleManageColumns,
      originalColumns = props.originalColumns,
      isExpandContentAvailable = props.isExpandContentAvailable,
      additionalColumn = props.additionalColumn;
  var additionalColumnHeader = additionalColumn && additionalColumn.length ? additionalColumn[0].Header : "";

  var getRemarksColumnIfAvailable = function getRemarksColumnIfAvailable() {
    return isExpandContentAvailable ? additionalColumn : [];
  };

  var concatedOriginalColumns = originalColumns.concat(getRemarksColumnIfAvailable());

  var _useState = React.useState(originalColumns),
      managedColumns = _useState[0],
      setManagedColumns = _useState[1];

  var _useState2 = React.useState(concatedOriginalColumns),
      searchedColumns = _useState2[0],
      setSearchedColumns = _useState2[1];

  var _useState3 = React.useState(getRemarksColumnIfAvailable),
      remarksColumnToManage = _useState3[0],
      setRemarksColumnToManage = _useState3[1];

  var _useState4 = React.useState(false),
      isErrorDisplayed = _useState4[0],
      setIsErrorDisplayed = _useState4[1];

  var HTML5toTouch = {
    backends: [{
      backend: reactDndHtml5Backend.HTML5Backend
    }, {
      backend: reactDndTouchBackend.TouchBackend,
      options: {
        enableMouseEvents: true
      },
      preview: true,
      transition: MultiBackend.TouchTransition
    }]
  };

  var filterColumnsList = function filterColumnsList(event) {
    var _ref = event ? event.target : "",
        value = _ref.value;

    value = value ? value.toLowerCase() : "";

    if (value !== "") {
      setSearchedColumns(originalColumns.filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      }).concat(getRemarksColumnIfAvailable().filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      })));
    } else {
      setSearchedColumns(concatedOriginalColumns);
    }
  };

  var updateColumnsInState = function updateColumnsInState(columns) {
    setManagedColumns(columns);
  };

  var findColumn = function findColumn(columnList, columnHeader) {
    return columnList.find(function (column) {
      return column.Header === columnHeader;
    });
  };

  var isItemPresentInList = function isItemPresentInList(list, headerValue) {
    var filteredList = list.filter(function (item) {
      return item.Header === headerValue;
    });
    return filteredList && filteredList.length > 0;
  };

  var isCheckboxSelected = function isCheckboxSelected(header) {
    if (header === additionalColumnHeader) {
      return remarksColumnToManage.length > 0;
    }

    if (header === "Select All") {
      return searchedColumns.length === managedColumns.length + remarksColumnToManage.length;
    }

    return isItemPresentInList(managedColumns, header);
  };

  var isInnerCellSelected = function isInnerCellSelected(columnHeader, header) {
    var columnListToSearch = columnHeader === additionalColumnHeader ? remarksColumnToManage : managedColumns;
    var selectedColumn = findColumn(columnListToSearch, columnHeader);
    return isItemPresentInList(selectedColumn.innerCells, header);
  };

  var findIndexOfItem = function findIndexOfItem(type, columnsList, indexOfColumnToAdd, columnHeader, originalInnerCells) {
    if (type === "column") {
      return columnsList.findIndex(function (column) {
        return column.Header === originalColumns[indexOfColumnToAdd].Header;
      });
    }

    return findColumn(columnsList, columnHeader).innerCells.findIndex(function (cell) {
      return cell.Header === originalInnerCells[indexOfColumnToAdd].Header;
    });
  };

  var selectAllColumns = function selectAllColumns(event) {
    if (event.currentTarget.checked) {
      setManagedColumns(originalColumns);
      setRemarksColumnToManage(getRemarksColumnIfAvailable());
    } else {
      setManagedColumns([]);
      setRemarksColumnToManage([]);
    }
  };

  var selectSingleColumn = function selectSingleColumn(event) {
    var currentTarget = event.currentTarget;
    var checked = currentTarget.checked,
        value = currentTarget.value;

    if (value === additionalColumnHeader) {
      if (checked) {
        setRemarksColumnToManage(additionalColumn);
      } else {
        setRemarksColumnToManage([]);
      }
    } else if (checked) {
      var indexOfColumnToAdd = originalColumns.findIndex(function (column) {
        return column.Header === value;
      });
      var itemToAdd = originalColumns[indexOfColumnToAdd];
      var prevItemIndex = -1;

      while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
        indexOfColumnToAdd -= 1;
        prevItemIndex = findIndexOfItem("column", managedColumns, indexOfColumnToAdd);
      }

      var newColumnsList = [].concat(managedColumns);
      newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
      setManagedColumns(newColumnsList);
    } else {
      setManagedColumns(managedColumns.filter(function (column) {
        return column.Header !== value;
      }));
    }
  };

  var findAndSelectInnerCells = function findAndSelectInnerCells(stateColumnList, setStateColumnList, event) {
    var currentTarget = event.currentTarget;
    var checked = currentTarget.checked,
        dataset = currentTarget.dataset,
        value = currentTarget.value;
    var columnheader = dataset.columnheader;
    var selectedColumn = findColumn(stateColumnList, columnheader);
    var originalInnerCells = selectedColumn.originalInnerCells;

    if (originalInnerCells && originalInnerCells.length > 0) {
      if (checked) {
        var indexOfColumnToAdd = originalInnerCells.findIndex(function (column) {
          return column.Header === value;
        });
        var itemToAdd = originalInnerCells[indexOfColumnToAdd];
        var prevItemIndex = -1;

        while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
          indexOfColumnToAdd -= 1;
          prevItemIndex = findIndexOfItem("innercell", stateColumnList, indexOfColumnToAdd, columnheader, originalInnerCells);
        }

        var newColumnsList = [].concat(stateColumnList);
        findColumn(newColumnsList, columnheader).innerCells.splice(prevItemIndex + 1, 0, itemToAdd);
        setStateColumnList(newColumnsList);
      } else {
        setStateColumnList(stateColumnList.map(function (column) {
          var updatedColumn = column;

          if (column.Header === columnheader) {
            updatedColumn.innerCells = column.innerCells.filter(function (cell) {
              return cell.Header !== value;
            });
          }

          return updatedColumn;
        }));
      }
    }
  };

  var selectInnerCells = function selectInnerCells(event) {
    findAndSelectInnerCells(managedColumns, setManagedColumns, event);
  };

  var selectRemarksInnerCells = function selectRemarksInnerCells(event) {
    findAndSelectInnerCells(remarksColumnToManage, setRemarksColumnToManage, event);
  };

  var doColumnUpdate = function doColumnUpdate() {
    setIsErrorDisplayed(false);

    if (managedColumns && managedColumns.length > 0) {
      setSearchedColumns(concatedOriginalColumns);
      props.updateColumnStructure(managedColumns, remarksColumnToManage);
      toggleManageColumns();
    } else {
      setIsErrorDisplayed(true);
    }
  };

  var resetInnerCells = function resetInnerCells(columnList) {
    if (columnList && columnList.length) {
      return columnList.map(function (column) {
        var newColumn = column;
        newColumn.innerCells = column.originalInnerCells;
        return column;
      });
    }

    return columnList;
  };

  var resetColumnUpdate = function resetColumnUpdate() {
    setManagedColumns(resetInnerCells(originalColumns));
    setSearchedColumns(originalColumns.concat(getRemarksColumnIfAvailable()));
    setRemarksColumnToManage(resetInnerCells(getRemarksColumnIfAvailable()));
    setIsErrorDisplayed(false);
    props.updateColumnStructure(originalColumns, getRemarksColumnIfAvailable());
  };

  if (isManageColumnOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleManageColumns
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover neo-popover--column columns--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__column column__grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__chooser"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("strong", null, "Column Chooser"))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      placeholder: "Search column",
      className: "custom__ctrl",
      onChange: filterColumnsList
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__selectAll"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      value: "Select All",
      checked: isCheckboxSelected("Select All"),
      onChange: selectAllColumns
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__selectTxt"
    }, "Select All")), searchedColumns.map(function (column) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "column__wrap",
        key: column.columnId
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        value: column.Header,
        checked: isCheckboxSelected(column.Header),
        onChange: selectSingleColumn
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "column__txt"
      }, column.Header));
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React__default.createElement("strong", null, "Column Settings"), isErrorDisplayed ? /*#__PURE__*/React__default.createElement("strong", {
      style: {
        marginLeft: "10px",
        color: "red"
      }
    }, "Select at least one column (other than ", additionalColumnHeader, ")") : null), /*#__PURE__*/React__default.createElement("div", {
      className: "column__close",
      role: "presentation",
      onClick: toggleManageColumns
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement(reactDnd.DndProvider, {
      backend: MultiBackend__default,
      options: HTML5toTouch
    }, /*#__PURE__*/React__default.createElement(ColumnsList, {
      columnsToManage: managedColumns,
      updateColumnsInState: updateColumnsInState,
      isInnerCellSelected: isInnerCellSelected,
      selectInnerCells: selectInnerCells
    })), remarksColumnToManage && remarksColumnToManage.length > 0 ? /*#__PURE__*/React__default.createElement("div", {
      className: "column__reorder full-width"
    }, /*#__PURE__*/React__default.createElement("div", null, remarksColumnToManage[0].Header), /*#__PURE__*/React__default.createElement("div", {
      className: "column__innerCells__wrap"
    }, remarksColumnToManage[0].originalInnerCells && remarksColumnToManage[0].originalInnerCells.length > 0 ? remarksColumnToManage[0].originalInnerCells.map(function (cell) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "column__wrap",
        key: cell.Header + "_" + cell.accessor
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        "data-columnheader": remarksColumnToManage[0].Header,
        value: cell.Header,
        checked: isInnerCellSelected(remarksColumnToManage[0].Header, cell.Header),
        onChange: selectRemarksInnerCells
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "column__txt"
      }, cell.Header));
    }) : null)) : null), /*#__PURE__*/React__default.createElement("div", {
      className: "column__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: resetColumnUpdate
    }, "Reset"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: toggleManageColumns
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: doColumnUpdate
    }, "Save")))))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
});
ColumnReordering.propTypes = {
  isManageColumnOpen: propTypes.any,
  toggleManageColumns: propTypes.any,
  originalColumns: propTypes.any,
  isExpandContentAvailable: propTypes.any,
  additionalColumn: propTypes.any,
  updateColumnStructure: propTypes.any
};

var ItemTypes$1 = {
  SORT_ITEM: "SORT_ITEM"
};

function _extends$9() {
  _extends$9 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$9.apply(this, arguments);
}

var _ref$8 = /*#__PURE__*/React.createElement("path", {
  d: "M12.84 8.963c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 10.45v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 8.8h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 6.05v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 4.4h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 1.65V.55C0 .401.054.272.16.163A.517.517 0 01.543 0h11.916c.147 0 .274.054.381.163z",
  fillOpacity: 0.11
});

function SvgIconNav(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$9({
    width: 13,
    height: 11
  }, props), _ref$8);
}

function _extends$a() {
  _extends$a = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$a.apply(this, arguments);
}

var _ref$9 = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  gradientUnits: "userSpaceOnUse",
  x1: 442.5,
  y1: 6,
  x2: 442.5,
  y2: 22,
  id: "SortCopy_svg__a"
}, /*#__PURE__*/React.createElement("stop", {
  stopColor: "#246290",
  stopOpacity: 0.6,
  offset: 0
}), /*#__PURE__*/React.createElement("stop", {
  stopColor: "#f2f2f2",
  offset: 0
}), /*#__PURE__*/React.createElement("stop", {
  stopColor: "#e4e4e4",
  offset: 1
}), /*#__PURE__*/React.createElement("stop", {
  stopColor: "#fff",
  offset: 1
})));

var _ref2 = /*#__PURE__*/React.createElement("path", {
  d: "M439.6 21h8.4v-8.8L442.8 7H437v11.4h1.3v1.3h1.3V21z",
  fill: "url(#SortCopy_svg__a)",
  transform: "translate(-436 -6)"
});

var _ref3 = /*#__PURE__*/React.createElement("path", {
  d: "M3.1 15.5h9.4V5.7L7.3.5H.5v12.4h1.3v1.3h1.3v1.3z",
  stroke: "#1a4769",
  fill: "none",
  strokeOpacity: 0.6
});

var _ref4 = /*#__PURE__*/React.createElement("path", {
  d: "M9.9 4.4l1.3.5v9.3H3.6M7.3 1v2.1h2.6v9.8H2.3M12 5.7h-.8",
  stroke: "#1a4769",
  fill: "none",
  strokeOpacity: 0.6
});

function SvgSortCopy(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$a({
    width: 13,
    height: 16
  }, props), _ref$9, _ref2, _ref3, _ref4);
}

function _extends$b() {
  _extends$b = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$b.apply(this, arguments);
}

var _ref$a = /*#__PURE__*/React.createElement("path", {
  d: "M5.359 6.094a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 014.432 6h.682c.1 0 .18.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 017.16 6h.682c.1 0 .181.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 019.886 6h.682c.1 0 .181.031.245.094zm1.385 8.203c.05-.129.075-.27.075-.422V4H2.727v9.875a1.16 1.16 0 00.23.703c.053.06.09.089.111.089h8.864c.021 0 .058-.03.112-.089a.928.928 0 00.154-.281zM5.636 1.447l-.522 1.22h4.772l-.511-1.22a.301.301 0 00-.181-.114H5.817a.301.301 0 00-.181.115zm9.268 1.313A.32.32 0 0115 3v.667a.32.32 0 01-.096.24.336.336 0 01-.245.093h-1.023v9.875c0 .576-.167 1.075-.5 1.495-.334.42-.735.63-1.204.63H3.068c-.469 0-.87-.203-1.204-.61-.333-.406-.5-.897-.5-1.473V4H.34a.336.336 0 01-.245-.094.32.32 0 01-.096-.24V3a.32.32 0 01.096-.24.336.336 0 01.245-.093h3.292l.746-1.74c.106-.257.298-.476.575-.656C5.23.09 5.51 0 5.795 0h3.41c.284 0 .564.09.841.27.277.181.469.4.575.657l.746 1.74h3.292c.1 0 .181.03.245.093z",
  fill: "#1a4769",
  fillOpacity: 0.6
});

function SvgSortDelete(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$b({
    width: 15,
    height: 16
  }, props), _ref$a);
}

var SortItem = function SortItem(_ref) {
  var id = _ref.id,
      sortOption = _ref.sortOption,
      originalColumns = _ref.originalColumns,
      moveSort = _ref.moveSort,
      findSort = _ref.findSort,
      updateSingleSortingOption = _ref.updateSingleSortingOption,
      copySortOption = _ref.copySortOption,
      deleteSortOption = _ref.deleteSortOption;
  var originalIndex = findSort(id).index;

  var _useDrag = reactDnd.useDrag({
    item: {
      type: ItemTypes$1.SORT_ITEM,
      id: id,
      originalIndex: originalIndex
    },
    collect: function collect(monitor) {
      return {
        isDragging: monitor.isDragging()
      };
    },
    end: function end(dropResult, monitor) {
      var monitorGetItemValue = monitor.getItem();
      var droppedId = monitorGetItemValue.id;
      var newOriginalIndex = monitorGetItemValue.originalIndex;
      var didDrop = monitor.didDrop();

      if (!didDrop) {
        moveSort(droppedId, newOriginalIndex);
      }
    }
  }),
      isDragging = _useDrag[0].isDragging,
      drag = _useDrag[1];

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes$1.SORT_ITEM,
    canDrop: function canDrop() {
      return false;
    },
    hover: function hover(_ref2) {
      var draggedId = _ref2.id;

      if (draggedId !== id) {
        var _findSort = findSort(id),
            overIndex = _findSort.index;

        moveSort(draggedId, overIndex);
      }
    }
  }),
      drop = _useDrop[1];

  var getInncerCellsOfColumn = function getInncerCellsOfColumn(columnAccessor) {
    return originalColumns.find(function (column) {
      return column.accessor === columnAccessor;
    }).innerCells;
  };

  var changeSortByOptions = function changeSortByOptions(event) {
    var newSortByValue = event.target.value;
    var innerCellsList = getInncerCellsOfColumn(newSortByValue);
    updateSingleSortingOption(id, newSortByValue, innerCellsList && innerCellsList.length > 0 ? innerCellsList[0].accessor : "value", sortOption.order);
  };

  var changeSortOnOptions = function changeSortOnOptions(event) {
    var newSortOnValue = event.target.value;
    updateSingleSortingOption(id, sortOption.sortBy, newSortOnValue, sortOption.order);
  };

  var changeSortOrderOptions = function changeSortOrderOptions(event) {
    var newSortOrderValue = event.target.value;
    updateSingleSortingOption(id, sortOption.sortBy, sortOption.sortOn, newSortOrderValue);
  };

  var copySort = function copySort() {
    copySortOption(id);
  };

  var deleteSort = function deleteSort() {
    deleteSortOption(id);
  };

  var opacity = isDragging ? 0.5 : 1;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sort__bodyContent",
    style: {
      opacity: opacity
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: function ref(node) {
      return drag(drop(node));
    },
    style: {
      cursor: "move"
    }
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconNav, null)))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    onChange: changeSortByOptions,
    value: sortOption.sortBy
  }, originalColumns.map(function (orgItem) {
    return /*#__PURE__*/React__default.createElement("option", {
      key: orgItem.columnId,
      value: orgItem.accessor
    }, orgItem.Header);
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    onChange: changeSortOnOptions,
    value: sortOption.sortOn
  }, getInncerCellsOfColumn(sortOption.sortBy) && getInncerCellsOfColumn(sortOption.sortBy).length > 0 ? getInncerCellsOfColumn(sortOption.sortBy).map(function (innerCellItem) {
    return /*#__PURE__*/React__default.createElement("option", {
      key: innerCellItem.Header + "_" + innerCellItem.accessor,
      value: innerCellItem.accessor
    }, innerCellItem.Header);
  }) : /*#__PURE__*/React__default.createElement("option", {
    key: 0,
    value: "value"
  }, "Value")))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    value: sortOption.order,
    onChange: changeSortOrderOptions
  }, /*#__PURE__*/React__default.createElement("option", null, "Ascending"), /*#__PURE__*/React__default.createElement("option", null, "Descending")))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__icon",
    role: "presentation",
    onClick: copySort
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgSortCopy, null)))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__icon",
    role: "presentation",
    onClick: deleteSort
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgSortDelete, null)))));
};

SortItem.propTypes = {
  id: propTypes.any,
  sortOption: propTypes.any,
  originalColumns: propTypes.any,
  moveSort: propTypes.any,
  findSort: propTypes.any,
  updateSingleSortingOption: propTypes.any,
  copySortOption: propTypes.any,
  deleteSortOption: propTypes.any
};

var SortingList = function SortingList(props) {
  var updateSortingOptions = props.updateSortingOptions,
      sortOptions = props.sortOptions;

  var findSort = function findSort(sortId) {
    var sort = sortOptions.filter(function (c, index) {
      return index === sortId;
    })[0];
    return {
      sort: sort,
      index: sortOptions.indexOf(sort)
    };
  };

  var moveSort = function moveSort(sortId, atIndex) {
    var _findSort = findSort(sortId),
        sort = _findSort.sort,
        index = _findSort.index;

    updateSortingOptions(update(sortOptions, {
      $splice: [[index, 1], [atIndex, 0, sort]]
    }));
  };

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes$1.SORT_ITEM
  }),
      drop = _useDrop[1];

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
    key: "SortingListFragment"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, sortOptions && sortOptions.length > 0 ? /*#__PURE__*/React__default.createElement("ul", null, /*#__PURE__*/React__default.createElement("li", null, "Sort By"), /*#__PURE__*/React__default.createElement("li", null, "Sort On"), /*#__PURE__*/React__default.createElement("li", null, "Order")) : null, sortOptions.map(function (sortOption, index) {
    return /*#__PURE__*/React__default.createElement(SortItem, {
      id: index,
      key: index,
      sortOption: sortOption,
      originalColumns: props.originalColumns,
      moveSort: moveSort,
      findSort: findSort,
      updateSingleSortingOption: props.updateSingleSortingOption,
      copySortOption: props.copySortOption,
      deleteSortOption: props.deleteSortOption
    });
  })));
};

SortingList.propTypes = {
  updateSortingOptions: propTypes.any,
  sortOptions: propTypes.any,
  originalColumns: propTypes.any,
  copySortOption: propTypes.any,
  deleteSortOption: propTypes.any,
  updateSingleSortingOption: propTypes.any
};

var GroupSort = React.memo(function (props) {
  var isGroupSortOverLayOpen = props.isGroupSortOverLayOpen,
      toggleGroupSortOverLay = props.toggleGroupSortOverLay,
      applyGroupSort = props.applyGroupSort,
      originalColumns = props.originalColumns;
  var sortingOrders = ["Ascending", "Descending"];
  var defaultSortingOption = [{
    sortBy: originalColumns[0].accessor,
    sortOn: originalColumns[0].innerCells ? originalColumns[0].innerCells[0].accessor : "value",
    order: sortingOrders[0]
  }];

  var _useState = React.useState([]),
      sortOptions = _useState[0],
      setSortOptions = _useState[1];

  var _useState2 = React.useState(false),
      isErrorDisplayed = _useState2[0],
      setIsErrorDisplayed = _useState2[1];

  var HTML5toTouch = {
    backends: [{
      backend: reactDndHtml5Backend.HTML5Backend
    }, {
      backend: reactDndTouchBackend.TouchBackend,
      options: {
        enableMouseEvents: true
      },
      preview: true,
      transition: MultiBackend.TouchTransition
    }]
  };

  var updateSortingOptions = function updateSortingOptions(sortingOptions) {
    setSortOptions(sortingOptions);
  };

  var addSortingOptions = function addSortingOptions() {
    setSortOptions([].concat(sortOptions, defaultSortingOption));
  };

  var clearSortingOptions = function clearSortingOptions() {
    setSortOptions([]);
    applyGroupSort([]);
  };

  var updateSingleSortingOption = function updateSingleSortingOption(sortIndex, sortByValue, sortOnValue, sortOrder) {
    var newOptionsList = sortOptions.slice(0);
    var newSortingOption = {
      sortBy: sortByValue,
      sortOn: sortOnValue,
      order: sortOrder
    };
    var updatedSortOptions = newOptionsList.map(function (option, index) {
      return index === sortIndex ? newSortingOption : option;
    });
    updateSortingOptions(updatedSortOptions);
  };

  var copySortOption = function copySortOption(sortIndex) {
    var newOption = sortOptions.slice(0)[sortIndex];
    setSortOptions(sortOptions.concat(newOption));
  };

  var deleteSortOption = function deleteSortOption(sortIndex) {
    setSortOptions(sortOptions.filter(function (option, index) {
      return index !== sortIndex;
    }));
  };

  var applySort = function applySort() {
    var isError = false;
    sortOptions.map(function (option, index) {
      var sortBy = option.sortBy,
          sortOn = option.sortOn;
      var optionIndex = index;
      var duplicateSort = sortOptions.find(function (opt, optIndex) {
        return sortBy === opt.sortBy && sortOn === opt.sortOn && optionIndex !== optIndex;
      });

      if (duplicateSort) {
        isError = true;
      }

      return null;
    });

    if (!isError) {
      applyGroupSort(sortOptions);
      toggleGroupSortOverLay();
    }

    setIsErrorDisplayed(isError);
  };

  if (isGroupSortOverLayOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleGroupSortOverLay
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__sort"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__title"
    }, /*#__PURE__*/React__default.createElement("h2", null, "Sort"), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      "aria-hidden": "true",
      onClick: toggleGroupSortOverLay
    }, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__content"
    }, /*#__PURE__*/React__default.createElement(reactDnd.DndProvider, {
      backend: MultiBackend__default,
      options: HTML5toTouch
    }, /*#__PURE__*/React__default.createElement(SortingList, {
      sortOptions: sortOptions,
      originalColumns: originalColumns,
      updateSortingOptions: updateSortingOptions,
      updateSingleSortingOption: updateSingleSortingOption,
      copySortOption: copySortOption,
      deleteSortOption: deleteSortOption
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort-warning"
    }, isErrorDisplayed ? /*#__PURE__*/React__default.createElement("span", null, "Duplicate sort options found.") : null), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__new"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__section",
      role: "presentation",
      onClick: addSortingOptions
    }, /*#__PURE__*/React__default.createElement("span", null, "+"), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__txt"
    }, "New Sort"))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: clearSortingOptions
    }, "Clear All"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: applySort
    }, "Ok"))))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
});
GroupSort.propTypes = {
  isGroupSortOverLayOpen: propTypes.any,
  toggleGroupSortOverLay: propTypes.any,
  originalColumns: propTypes.any,
  applyGroupSort: propTypes.any
};

function _extends$c() {
  _extends$c = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$c.apply(this, arguments);
}

var _ref$b = /*#__PURE__*/React.createElement("path", {
  d: "M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm3.75-11.982v-.964a.47.47 0 01.135-.347c.09-.09.204-.136.344.293h10.542c.14-.429.254-.383.344-.293a.47.47 0 01.135.347v.964a.47.47 0 01-.135.346c-.09.09-.204.136-.344-.364H6.229c-.14.5-.254.455-.344.364a.47.47 0 01-.135-.346zM6.23 15h10.54c.14.429.255.474.345.564a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.222H6.229c-.14.357-.254.312-.344.222a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.564zm0 4h10.54c.14.286.255.33.345.421a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.079H6.229c-.14.214-.254.17-.344.079a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.421z",
  fill: "#1a4869"
});

function SvgIconCsv(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$c({
    width: 23,
    height: 27
  }, props), _ref$b);
}

function _extends$d() {
  _extends$d = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$d.apply(this, arguments);
}

var _ref$c = /*#__PURE__*/React.createElement("path", {
  d: "M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm5.442-3.454H6.424v1.597h4.208v-1.597H9.508l1.543-2.426c.05-.07.1-.153.15-.249.05-.095.087-.163.112-.203.025-.04.042-.06.052-.06h.03c.01.04.035.09.075.15.02.04.042.078.067.113.025.036.055.076.09.12l.098.129 1.602 2.426h-1.138v1.597h4.357v-1.597h-1.018l-2.875-4.114 2.92-4.248h1.003V11.57h-4.178v1.613h1.109l-1.543 2.395a6.727 6.727 0 01-.284.452l-.03.045h-.03a.52.52 0 00-.075-.15 1.797 1.797 0 00-.255-.347l-1.587-2.395h1.138V11.57H6.5v1.613h1.018l2.83 4.098-2.905 4.264z",
  fill: "#3da751"
});

function SvgIconExcel(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$d({
    width: 23,
    height: 27
  }, props), _ref$c);
}

function _extends$e() {
  _extends$e = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$e.apply(this, arguments);
}

var _ref$d = /*#__PURE__*/React.createElement("path", {
  d: "M18.063 1.063l4.875 4.875c.291.291.541.687.75 1.187.208.5.312.958.312 1.375v18c0 .417-.146.77-.438 1.063A1.447 1.447 0 0122.5 28h-21c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 010 26.5v-25C0 1.083.146.73.438.437A1.447 1.447 0 011.5 0h14c.417 0 .875.104 1.375.313.5.208.896.458 1.188.75zM16.64 2.468c-.125-.125-.339-.24-.641-.344V8h5.875c-.104-.302-.219-.516-.344-.64l-4.89-4.891zM2 26h20V10h-6.5c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 0114 8.5V2H2v24zm9.688-12.984c.572 1.708 1.333 2.948 2.28 3.718.345.271.782.563 1.313.875.615-.073 1.224-.109 1.828-.109 1.532 0 2.453.255 2.766.766.167.229.177.5.031.812 0 .01-.005.021-.015.031l-.032.032v.015c-.062.396-.432.594-1.109.594-.5 0-1.099-.104-1.797-.313a11.391 11.391 0 01-2.031-.828c-2.302.25-4.344.683-6.125 1.297C7.203 22.636 5.943 24 5.016 24a.909.909 0 01-.438-.11l-.375-.187a1.671 1.671 0 00-.094-.078c-.104-.104-.135-.292-.093-.563.093-.416.385-.893.875-1.43.49-.536 1.177-1.038 2.062-1.507.146-.094.266-.063.36.094.02.02.03.041.03.062a38.204 38.204 0 001.673-3.078c.708-1.417 1.25-2.781 1.625-4.094a12.63 12.63 0 01-.477-2.492c-.068-.807-.034-1.471.102-1.992.114-.417.333-.625.656-.625H11.266c.24 0 .421.078.546.234.188.22.235.573.141 1.063a.34.34 0 01-.062.125c.01.031.015.073.015.125v.469c-.02 1.28-.094 2.28-.219 3zM5.742 22c-.38.458-.638.844-.773 1.156.541-.25 1.255-1.073 2.14-2.468A8.908 8.908 0 005.742 22zm5.446-13.25v.031c-.157.438-.167 1.125-.032 2.063.01-.073.047-.302.11-.688 0-.031.036-.255.109-.672a.352.352 0 01.063-.125c-.01-.01-.016-.02-.016-.03a.12.12 0 01-.016-.048.9.9 0 00-.203-.562c0 .01-.005.02-.015.031zm-1.235 9.063a106.31 106.31 0 01-.703 1.296 22.918 22.918 0 014.438-1.265c-.021-.01-.089-.06-.204-.149a2.793 2.793 0 01-.25-.21c-.791-.699-1.453-1.615-1.984-2.75-.281.895-.714 1.921-1.297 3.078zm9.422 1.093c0-.01-.01-.026-.031-.047-.25-.25-.98-.375-2.188-.375.792.292 1.438.438 1.938.438.146 0 .24-.005.281-.016z",
  fill: "#ff4a4a"
});

function SvgIconPdf(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$e({
    width: 24,
    height: 28
  }, props), _ref$d);
}

var ExportData = React.memo(function (props) {
  var isExportOverlayOpen = props.isExportOverlayOpen,
      toggleExportDataOverlay = props.toggleExportDataOverlay,
      rows = props.rows,
      originalColumns = props.originalColumns,
      columns = props.columns,
      isRowExpandEnabled = props.isRowExpandEnabled,
      isExpandContentAvailable = props.isExpandContentAvailable,
      additionalColumn = props.additionalColumn;

  var getRemarksColumnIfAvailable = function getRemarksColumnIfAvailable() {
    return isExpandContentAvailable ? additionalColumn : [];
  };

  var getRemarksColumnIfSelectedByUser = function getRemarksColumnIfSelectedByUser() {
    return isRowExpandEnabled ? additionalColumn : [];
  };

  var updatedColumns = [].concat(originalColumns).concat(getRemarksColumnIfAvailable());
  var updatedColumnsPerUserSelection = [].concat(columns).concat(getRemarksColumnIfSelectedByUser());

  var _useState = React.useState(updatedColumnsPerUserSelection),
      managedColumns = _useState[0],
      setManagedColumns = _useState[1];

  var _useState2 = React.useState(updatedColumns),
      searchedColumns = _useState2[0],
      setSearchedColumns = _useState2[1];

  var _useState3 = React.useState([]),
      downloadTypes = _useState3[0],
      setDownloadTypes = _useState3[1];

  var _useState4 = React.useState(""),
      warning = _useState4[0],
      setWarning = _useState4[1];

  var isDownload = false;

  var downloadPDF = function downloadPDF(rowFilteredValues, rowFilteredHeader) {
    var unit = "pt";
    var size = "A4";
    var orientation = "landscape";
    var doc = new JsPdf(orientation, unit, size);
    doc.setFontSize(12);
    var title = "iCargo Neo Report";
    var content = {
      startY: 50,
      head: rowFilteredHeader,
      body: rowFilteredValues,
      tableWidth: "wrap",
      headStyles: {
        fillColor: [102, 102, 255]
      },
      theme: "grid",
      margin: {
        top: 30,
        right: 30,
        bottom: 10,
        left: 30
      }
    };
    doc.text(title, 30, 40);
    doc.autoTable(content);
    doc.save("iCargo Neo Report.pdf");
    isDownload = false;
  };

  var downloadCSVFile = function downloadCSVFile(filteredRowValue) {
    var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var fileExtension = ".csv";
    var fileName = "iCargo Neo Report";
    var ws = XLSX.utils.json_to_sheet(filteredRowValue);
    var wb = {
      Sheets: {
        data: ws
      },
      SheetNames: ["data"]
    };
    var excelBuffer = XLSX.write(wb, {
      bookType: "csv",
      type: "array"
    });
    var data = new Blob([excelBuffer], {
      type: fileType
    });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  var downloadXLSFile = function downloadXLSFile(filteredRowValue) {
    var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var fileExtension = ".xlsx";
    var fileName = "iCargo Neo Report";
    var ws = XLSX.utils.json_to_sheet(filteredRowValue);
    var wb = {
      Sheets: {
        data: ws
      },
      SheetNames: ["data"]
    };
    var excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });
    var data = new Blob([excelBuffer], {
      type: fileType
    });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  var exportRowData = function exportRowData() {
    isDownload = true;
    var filteredRow = [];
    var filteredRowValues = [];
    var filteredRowHeader = [];
    setWarning("");

    if (managedColumns.length > 0 && downloadTypes.length > 0) {
      var rowLength = rows && rows.length > 0 ? rows.length : 0;
      rows.forEach(function (rowDetails, index) {
        var row = rowDetails.original;
        var filteredColumnVal = {};
        var rowFilteredValues = [];
        var rowFilteredHeader = [];
        managedColumns.forEach(function (columnName) {
          var Header = columnName.Header,
              accessor = columnName.accessor,
              originalInnerCells = columnName.originalInnerCells,
              displayInExpandedRegion = columnName.displayInExpandedRegion;
          var isInnerCellsPresent = originalInnerCells && originalInnerCells.length > 0;
          var accessorRowValue = row[accessor];
          var columnValue = "";
          var columnHeader = "";

          if (accessor) {
            if (isInnerCellsPresent && typeof accessorRowValue === "object") {
              originalInnerCells.forEach(function (cell) {
                var innerCellAccessor = cell.accessor;
                var innerCellHeader = cell.Header;
                var innerCellAccessorValue = accessorRowValue[innerCellAccessor];

                if (accessorRowValue.length > 0) {
                  accessorRowValue.forEach(function (item, itemIndex) {
                    columnValue = item[innerCellAccessor].toString();
                    columnHeader = Header + " - " + innerCellHeader + "_" + itemIndex;
                    filteredColumnVal[columnHeader] = columnValue;
                    rowFilteredValues.push(columnValue);
                    rowFilteredHeader.push(columnHeader);
                  });
                } else if (innerCellAccessorValue) {
                  columnValue = innerCellAccessorValue;
                  columnHeader = Header + " - " + innerCellHeader;
                  filteredColumnVal[columnHeader] = columnValue;
                  rowFilteredValues.push(columnValue);
                  rowFilteredHeader.push(columnHeader);
                }
              });
            } else {
              columnValue = accessorRowValue;
              columnHeader = Header;
              filteredColumnVal[columnHeader] = columnValue;
              rowFilteredValues.push(columnValue);
              rowFilteredHeader.push(columnHeader);
            }
          } else if (displayInExpandedRegion && isInnerCellsPresent) {
            originalInnerCells.forEach(function (expandedCell) {
              var expandedCellAccessor = expandedCell.accessor;
              var expandedCellHeader = expandedCell.Header;
              var expandedCellValue = row[expandedCellAccessor];
              var formattedValue = expandedCellValue;

              if (typeof expandedCellValue === "object") {
                if (expandedCellValue.length > 0) {
                  var newValues = [];
                  expandedCellValue.forEach(function (cellValue) {
                    newValues.push(Object.values(cellValue).join("--"));
                  });
                  formattedValue = newValues.join("||");
                } else {
                  formattedValue = Object.values(expandedCellValue).join("||");
                }
              }

              columnValue = formattedValue;
              columnHeader = expandedCellHeader;
              filteredColumnVal[columnHeader] = columnValue;
              rowFilteredValues.push(columnValue);
              rowFilteredHeader.push(columnHeader);
            });
          }
        });
        filteredRow.push(filteredColumnVal);
        filteredRowValues.push(rowFilteredValues);
        if (rowLength === index + 1) filteredRowHeader.push(rowFilteredHeader);
      });
      downloadTypes.forEach(function (item) {
        if (item === "pdf") {
          downloadPDF(filteredRowValues, filteredRowHeader);
        } else if (item === "excel") {
          downloadXLSFile(filteredRow);
        } else {
          downloadCSVFile(filteredRow);
        }
      });
    } else if (managedColumns.length === 0 && downloadTypes.length === 0) {
      setWarning("Select at least one column and a file type");
    } else if (managedColumns.length === 0) {
      setWarning("Select at least one column");
    } else if (downloadTypes.length === 0) {
      setWarning("Select at least one file type");
    }
  };

  var filterColumnsList = function filterColumnsList(event) {
    var _ref = event ? event.target : "",
        value = _ref.value;

    value = value ? value.toLowerCase() : "";

    if (value !== "") {
      setSearchedColumns(originalColumns.filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      }).concat(getRemarksColumnIfAvailable().filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      })));
    } else {
      setSearchedColumns(updatedColumns);
    }
  };

  var isCheckboxSelected = function isCheckboxSelected(header) {
    if (header === "Select All") {
      return managedColumns.length === searchedColumns.length;
    }

    var selectedColumn = managedColumns.filter(function (column) {
      return column.Header === header;
    });
    return selectedColumn && selectedColumn.length > 0;
  };

  var selectAllColumns = function selectAllColumns(event) {
    if (event.target.checked) {
      setManagedColumns(updatedColumns);
    } else {
      setManagedColumns([]);
    }
  };

  var selectSingleColumn = function selectSingleColumn(event) {
    var currentTarget = event.currentTarget;
    var checked = currentTarget.checked,
        value = currentTarget.value;

    if (checked) {
      (function () {
        var indexOfColumnToAdd = updatedColumns.findIndex(function (column) {
          return column.Header === value;
        });
        var itemToAdd = updatedColumns[indexOfColumnToAdd];
        var prevItemIndex = -1;

        for (var i = indexOfColumnToAdd; i > 0; i--) {
          if (prevItemIndex === -1) {
            prevItemIndex = managedColumns.findIndex(function (column) {
              return column.Header === updatedColumns[indexOfColumnToAdd - 1].Header;
            });
          }
        }

        var newColumnsList = managedColumns.slice(0);
        newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
        setManagedColumns(newColumnsList);
      })();
    } else {
      setManagedColumns(managedColumns.filter(function (column) {
        return column.Header !== value;
      }));
    }
  };

  var changeDownloadType = function changeDownloadType(event) {
    var _ref2 = event ? event.currentTarget : "",
        value = _ref2.value,
        checked = _ref2.checked;

    if (checked) {
      setDownloadTypes(downloadTypes.concat([value]));
    } else {
      setDownloadTypes(downloadTypes.filter(function (type) {
        return type !== value;
      }));
    }
  };

  React.useEffect(function () {
    setManagedColumns(updatedColumnsPerUserSelection);
  }, [columns, isRowExpandEnabled]);

  if (isExportOverlayOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleExportDataOverlay
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover neo-popover--exports exports--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__export export__grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__chooser"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("strong", null, "Export Data"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      placeholder: "Search column",
      className: "custom__ctrl",
      onChange: filterColumnsList
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__wrap export__headertxt"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      value: "Select All",
      checked: isCheckboxSelected("Select All"),
      onChange: selectAllColumns
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__txt"
    }, "Select All")), searchedColumns.map(function (column) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "export__wrap",
        key: column.columnId
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "export__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        value: column.Header,
        checked: isCheckboxSelected(column.Header),
        onChange: selectSingleColumn
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "export__txt"
      }, column.Header));
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__headerTxt"
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "export__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      "aria-hidden": "true",
      onClick: toggleExportDataOverlay
    }, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__as"
    }, "Export As"), /*#__PURE__*/React__default.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "chk_pdf",
      value: "pdf",
      checked: downloadTypes.includes("pdf"),
      onChange: changeDownloadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconPdf, null)), /*#__PURE__*/React__default.createElement("strong", null, "PDF"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "chk_excel",
      value: "excel",
      checked: downloadTypes.includes("excel"),
      onChange: changeDownloadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconExcel, null)), /*#__PURE__*/React__default.createElement("strong", null, "Excel"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "chk_csv",
      value: "csv",
      checked: downloadTypes.includes("csv"),
      onChange: changeDownloadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconCsv, null)), /*#__PURE__*/React__default.createElement("strong", null, "CSV"))), /*#__PURE__*/React__default.createElement("div", {
      className: "exportWarning"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React__default.createElement("strong", null, warning))), /*#__PURE__*/React__default.createElement("div", null, isDownload ? /*#__PURE__*/React__default.createElement("h2", {
      style: {
        textAlign: "center"
      }
    }, "Loading...") : null)), /*#__PURE__*/React__default.createElement("div", {
      className: "export__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: toggleExportDataOverlay
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: exportRowData
    }, "Export")))))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
});
ExportData.propTypes = {
  isExportOverlayOpen: propTypes.any,
  toggleExportDataOverlay: propTypes.any,
  rows: propTypes.any,
  columns: propTypes.any,
  originalColumns: propTypes.any,
  isExpandContentAvailable: propTypes.any,
  additionalColumn: propTypes.any,
  isRowExpandEnabled: propTypes.any
};

function _extends$f() {
  _extends$f = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$f.apply(this, arguments);
}

var _ref$e = /*#__PURE__*/React.createElement("path", {
  d: "M.992 11.836c.045.054.1.08.162.08h4.384v-9.75H.923v9.48c0 .073.023.137.069.19zm10.016 0a.284.284 0 00.069-.19v-9.48H6.462v9.75h4.384a.207.207 0 00.162-.08zM11.661.398c.226.265.339.584.339.956v10.292c0 .372-.113.691-.339.956-.226.265-.498.398-.815.398H1.154c-.317 0-.59-.133-.815-.398A1.426 1.426 0 010 11.646V1.354C0 .982.113.663.339.398.565.133.837 0 1.154 0h9.692c.317 0 .59.133.815.398z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconColumns(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$f({
    width: 12,
    height: 13
  }, props), _ref$e);
}

function _extends$g() {
  _extends$g = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$g.apply(this, arguments);
}

var _ref$f = /*#__PURE__*/React.createElement("path", {
  d: "M11.88.722a.38.38 0 010 .553L6.277 6.88a.38.38 0 01-.554 0L.12 1.275a.38.38 0 010-.553L.721.12a.38.38 0 01.554 0L6 4.847 10.725.12a.38.38 0 01.554 0l.6.602z",
  fill: "#0e415e",
  fillOpacity: 0.4
});

function SvgIconAngle(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$g({
    width: 12,
    height: 7
  }, props), _ref$f);
}

function _extends$h() {
  _extends$h = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$h.apply(this, arguments);
}

var _ref$g = /*#__PURE__*/React.createElement("path", {
  d: "M10.486 0c.218 0 .371.102.46.305.088.213.051.396-.11.547l-3.84 3.851V10.5a.467.467 0 01-.304.46.54.54 0 01-.195.04.462.462 0 01-.35-.148l-1.995-2a.481.481 0 01-.148-.352V4.703L.164.852C.003.7-.034.518.054.305A.466.466 0 01.515 0h9.972z",
  fill: "#636c8c"
});

function SvgIconFilter(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$h({
    width: 11,
    height: 11
  }, props), _ref$g);
}

function _extends$i() {
  _extends$i = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$i.apply(this, arguments);
}

var _ref$h = /*#__PURE__*/React.createElement("path", {
  d: "M7.797 7.672A2.41 2.41 0 019.5 7a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 9.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 12a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 017 9.5c0-.063.005-.151.016-.266L4.203 7.828A2.41 2.41 0 012.5 8.5a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 010 6c0-.693.243-1.283.73-1.77A2.41 2.41 0 012.5 3.5a2.41 2.41 0 011.703.672l2.813-1.406A3.146 3.146 0 017 2.5c0-.693.243-1.283.73-1.77A2.41 2.41 0 019.5 0a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 2.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 5a2.41 2.41 0 01-1.703-.672L4.984 5.734C4.994 5.85 5 5.938 5 6c0 .063-.005.151-.016.266l2.813 1.406z",
  fill: "#636c8c"
});

function SvgIconShare(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$i({
    width: 12,
    height: 12
  }, props), _ref$h);
}

function _extends$j() {
  _extends$j = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$j.apply(this, arguments);
}

var _ref$i = /*#__PURE__*/React.createElement("path", {
  d: "M8.013 10.346c.041.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V10.5a.207.207 0 01.218-.214h1.744c.064 0 .116.02.157.06zm-3.271-.857c.04.04.061.091.061.154a.25.25 0 01-.068.16L2.561 11.94a.23.23 0 01-.157.06.247.247 0 01-.156-.06L.067 9.797c-.068-.072-.084-.15-.048-.235.036-.089.104-.133.204-.133h1.309V.214A.207.207 0 011.75 0h1.309a.207.207 0 01.218.214V9.43h1.308c.064 0 .116.02.157.06zm4.58-2.572c.04.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V7.071a.207.207 0 01.218-.214h3.053c.064 0 .116.02.157.06zM10.63 3.49c.041.04.061.091.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V3.643a.207.207 0 01.218-.214h4.361c.064 0 .116.02.157.06zM11.94.06c.04.04.061.092.061.154V1.5a.207.207 0 01-.218.214h-5.67a.207.207 0 01-.218-.214V.214A.207.207 0 016.112 0h5.67c.064 0 .116.02.157.06z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconGroupSort(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$j({
    width: 12,
    height: 12
  }, props), _ref$i);
}

function _extends$k() {
  _extends$k = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$k.apply(this, arguments);
}

var _ref$j = /*#__PURE__*/React.createElement("path", {
  d: "M0 0l4 5 4-5H0z",
  fill: "#4f6475"
});

function SvgIconSort(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$k({
    width: 8,
    height: 5
  }, props), _ref$j);
}

function _extends$l() {
  _extends$l = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$l.apply(this, arguments);
}

var _ref$k = /*#__PURE__*/React.createElement("path", {
  d: "M888 1184l116-116-152-152-116 116v56h96v96h56zm440-720q-16-16-33 1L945 815q-17 17-1 33t33-1l350-350q17-17 1-33zm80 594v190q0 119-84.5 203.5T1120 1536H288q-119 0-203.5-84.5T0 1248V416q0-119 84.5-203.5T288 128h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-14 14-32 8-23-6-45-6H288q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-126q0-13 9-22l64-64q15-15 35-7t20 29zm-96-738l288 288-672 672H640V992zm444 132l-92 92-288-288 92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68z"
});

function SvgIconEdit(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$l({
    height: 1792,
    width: 1792,
    style: {
      zoom: 0.007
    }
  }, props), _ref$k);
}

var listRef = React.createRef(null);
var Customgrid = React.memo(function (props) {
  var title = props.title,
      gridHeight = props.gridHeight,
      gridWidth = props.gridWidth,
      managableColumns = props.managableColumns,
      originalColumns = props.originalColumns,
      additionalColumn = props.additionalColumn,
      data = props.data,
      getRowEditOverlay = props.getRowEditOverlay,
      updateRowInGrid = props.updateRowInGrid,
      deleteRowFromGrid = props.deleteRowFromGrid,
      globalSearchLogic = props.globalSearchLogic,
      selectBulkData = props.selectBulkData,
      calculateRowHeight = props.calculateRowHeight,
      isExpandContentAvailable = props.isExpandContentAvailable,
      displayExpandedContent = props.displayExpandedContent,
      rowActions = props.rowActions,
      rowActionCallback = props.rowActionCallback,
      hasNextPage = props.hasNextPage,
      isNextPageLoading = props.isNextPageLoading,
      loadNextPage = props.loadNextPage,
      doGroupSort = props.doGroupSort;

  var _useState = React.useState(managableColumns),
      columns = _useState[0],
      setColumns = _useState[1];

  var _useState2 = React.useState(isExpandContentAvailable),
      isRowExpandEnabled = _useState2[0],
      setIsRowExpandEnabled = _useState2[1];

  var itemCount = hasNextPage ? data.length + 1 : data.length;
  var loadMoreItems = isNextPageLoading ? function () {} : loadNextPage || function () {};

  var isItemLoaded = function isItemLoaded(index) {
    return !hasNextPage || index < data.length;
  };

  var _useState3 = React.useState(false),
      isFilterOpen = _useState3[0],
      setFilterOpen = _useState3[1];

  var toggleColumnFilter = function toggleColumnFilter() {
    setFilterOpen(!isFilterOpen);
  };

  var _useState4 = React.useState(false),
      isRowEditOverlyOpen = _useState4[0],
      setIsRowEditOverlyOpen = _useState4[1];

  var _useState5 = React.useState(null),
      editedRowData = _useState5[0],
      setEditedRowData = _useState5[1];

  var bindRowEditOverlay = function bindRowEditOverlay(rowValue) {
    setEditedRowData(rowValue);
    setIsRowEditOverlyOpen(true);
  };

  var closeRowEditOverlay = function closeRowEditOverlay() {
    setEditedRowData(null);
    setIsRowEditOverlyOpen(false);
  };

  var _useState6 = React.useState(false),
      isRowDeleteOverlyOpen = _useState6[0],
      setIsRowDeleteOverlyOpen = _useState6[1];

  var _useState7 = React.useState(null),
      deletedRowData = _useState7[0],
      setDeletedRowData = _useState7[1];

  var bindRowDeleteOverlay = function bindRowDeleteOverlay(rowValue) {
    setDeletedRowData(rowValue);
    setIsRowDeleteOverlyOpen(true);
  };

  var closeRowDeleteOverlay = function closeRowDeleteOverlay() {
    setDeletedRowData(null);
    setIsRowDeleteOverlyOpen(false);
  };

  var _useState8 = React.useState(false),
      isGroupSortOverLayOpen = _useState8[0],
      setGroupSortOverLay = _useState8[1];

  var toggleGroupSortOverLay = function toggleGroupSortOverLay() {
    setGroupSortOverLay(!isGroupSortOverLayOpen);
  };

  var applyGroupSort = function applyGroupSort(sortOptions) {
    doGroupSort(sortOptions);
  };

  var _useState9 = React.useState(false),
      isManageColumnOpen = _useState9[0],
      setManageColumnOpen = _useState9[1];

  var toggleManageColumns = function toggleManageColumns() {
    setManageColumnOpen(!isManageColumnOpen);
  };

  var updateColumnStructure = function updateColumnStructure(newColumnStructure, remarksColumn) {
    setColumns([].concat(newColumnStructure));
    setIsRowExpandEnabled(!!(remarksColumn && remarksColumn.length > 0));
  };

  var _useState10 = React.useState(false),
      isExportOverlayOpen = _useState10[0],
      setIsExportOverlayOpen = _useState10[1];

  var toggleExportDataOverlay = function toggleExportDataOverlay() {
    setIsExportOverlayOpen(!isExportOverlayOpen);
  };

  var defaultColumn = React.useMemo(function () {
    return {
      Filter: DefaultColumnFilter
    };
  }, []);

  var _useTable = reactTable.useTable({
    columns: columns,
    data: data,
    defaultColumn: defaultColumn,
    globalFilter: function globalFilter(rowsToFilter, columnsToFilter, filterValue) {
      if (globalSearchLogic && typeof globalSearchLogic === "function") {
        return globalSearchLogic(rowsToFilter, filterValue);
      }

      return rowsToFilter;
    },
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    autoResetSortBy: false,
    autoResetExpanded: false,
    autoResetSelectedRows: false
  }, reactTable.useFilters, reactTable.useGlobalFilter, reactTable.useSortBy, reactTable.useExpanded, reactTable.useRowSelect, reactTable.useFlexLayout, reactTable.useResizeColumns, function (hooks) {
    hooks.allColumns.push(function (hookColumns) {
      return [{
        id: "selection",
        columnId: "column_custom_0",
        disableResizing: true,
        disableFilters: true,
        disableSortBy: true,
        minWidth: 35,
        width: 35,
        maxWidth: 35,
        Header: function Header(_ref) {
          var getToggleAllRowsSelectedProps = _ref.getToggleAllRowsSelectedProps;
          return /*#__PURE__*/React__default.createElement(RowSelector, getToggleAllRowsSelectedProps());
        },
        Cell: function Cell(_ref2) {
          var row = _ref2.row;
          return /*#__PURE__*/React__default.createElement(RowSelector, row.getToggleRowSelectedProps());
        }
      }].concat(hookColumns, [{
        id: "custom",
        columnId: "column_custom_1",
        disableResizing: true,
        disableFilters: true,
        disableSortBy: true,
        minWidth: 35,
        width: 35,
        maxWidth: 35,
        Cell: function Cell(_ref3) {
          var row = _ref3.row;
          return /*#__PURE__*/React__default.createElement("div", {
            className: "action"
          }, /*#__PURE__*/React__default.createElement(RowOptions, {
            row: row,
            rowActions: rowActions,
            rowActionCallback: rowActionCallback,
            bindRowEditOverlay: bindRowEditOverlay,
            bindRowDeleteOverlay: bindRowDeleteOverlay
          }), isRowExpandEnabled ? /*#__PURE__*/React__default.createElement("span", _extends({
            className: "expander"
          }, row.getToggleRowExpandedProps()), /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconAngle, {
            className: row.isExpanded ? "icon-arrow-up" : "icon-arrow-down"
          }))) : null);
        }
      }]);
    });
  }),
      getTableProps = _useTable.getTableProps,
      getTableBodyProps = _useTable.getTableBodyProps,
      headerGroups = _useTable.headerGroups,
      rows = _useTable.rows,
      prepareRow = _useTable.prepareRow,
      selectedFlatRows = _useTable.selectedFlatRows,
      state = _useTable.state,
      setGlobalFilter = _useTable.setGlobalFilter;

  var bulkSelector = function bulkSelector() {
    if (selectBulkData) {
      selectBulkData(selectedFlatRows);
    }
  };

  React.useEffect(function () {
    if (listRef && listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  });
  var RenderRow = React.useCallback(function (_ref4) {
    var index = _ref4.index,
        style = _ref4.style;

    if (isItemLoaded(index)) {
      var row = rows[index];
      prepareRow(row);
      return /*#__PURE__*/React__default.createElement("div", _extends({}, row.getRowProps({
        style: style
      }), {
        className: "table-row tr"
      }), /*#__PURE__*/React__default.createElement("div", {
        className: "table-row-wrap"
      }, row.cells.map(function (cell) {
        return /*#__PURE__*/React__default.createElement("div", _extends({}, cell.getCellProps(), {
          className: "table-cell td"
        }), cell.render("Cell"));
      })), isRowExpandEnabled && row.isExpanded ? /*#__PURE__*/React__default.createElement("div", {
        className: "expand"
      }, displayExpandedContent ? displayExpandedContent(row) : null) : null);
    }

    return null;
  }, [prepareRow, rows, displayExpandedContent]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "table-wrapper",
    style: {
      width: gridWidth || "100%"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "neo-grid-header"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "neo-grid-header__results"
  }, /*#__PURE__*/React__default.createElement("strong", null, rows.length), /*#__PURE__*/React__default.createElement("span", null, title || "Rows")), /*#__PURE__*/React__default.createElement("div", {
    className: "neo-grid-header__utilities"
  }, /*#__PURE__*/React__default.createElement(ColumnReordering, {
    isManageColumnOpen: isManageColumnOpen,
    toggleManageColumns: toggleManageColumns,
    originalColumns: originalColumns,
    isExpandContentAvailable: isExpandContentAvailable,
    additionalColumn: [additionalColumn],
    updateColumnStructure: updateColumnStructure
  }), /*#__PURE__*/React__default.createElement(GlobalFilter, {
    globalFilter: state.globalFilter,
    setGlobalFilter: setGlobalFilter
  }), /*#__PURE__*/React__default.createElement(GroupSort, {
    isGroupSortOverLayOpen: isGroupSortOverLayOpen,
    toggleGroupSortOverLay: toggleGroupSortOverLay,
    originalColumns: originalColumns,
    applyGroupSort: applyGroupSort
  }), /*#__PURE__*/React__default.createElement(ExportData, {
    isExportOverlayOpen: isExportOverlayOpen,
    toggleExportDataOverlay: toggleExportDataOverlay,
    rows: rows,
    originalColumns: originalColumns,
    columns: columns,
    isRowExpandEnabled: isRowExpandEnabled,
    isExpandContentAvailable: isExpandContentAvailable,
    additionalColumn: [additionalColumn]
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon keyword-search",
    role: "presentation",
    onClick: toggleColumnFilter
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconFilter, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon bulk-select",
    role: "presentation",
    onClick: bulkSelector
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconEdit, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon group-sort",
    role: "presentation",
    onClick: toggleGroupSortOverLay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconGroupSort, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon manage-columns",
    role: "presentation",
    onClick: toggleManageColumns
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconColumns, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon export-data",
    role: "presentation",
    onClick: toggleExportDataOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconShare, null))))), /*#__PURE__*/React__default.createElement("div", {
    className: "table-popus"
  }, isRowEditOverlyOpen ? /*#__PURE__*/React__default.createElement("div", {
    className: "overlay"
  }, /*#__PURE__*/React__default.createElement(RowEditOverLay, {
    row: editedRowData,
    columns: columns,
    isRowExpandEnabled: isRowExpandEnabled,
    additionalColumn: additionalColumn,
    getRowEditOverlay: getRowEditOverlay,
    closeRowEditOverlay: closeRowEditOverlay,
    updateRowInGrid: updateRowInGrid
  })) : null, isRowDeleteOverlyOpen ? /*#__PURE__*/React__default.createElement("div", {
    className: "overlay"
  }, /*#__PURE__*/React__default.createElement(RowDeleteOverLay, {
    row: deletedRowData,
    closeRowDeleteOverlay: closeRowDeleteOverlay,
    deleteRowFromGrid: deleteRowFromGrid
  })) : null), /*#__PURE__*/React__default.createElement("div", {
    className: "tableContainer table-outer neo-grid",
    style: {
      height: gridHeight || "50vh",
      overflowX: "auto",
      overflowY: "hidden"
    }
  }, /*#__PURE__*/React__default.createElement(AutoSizer, {
    disableWidth: true,
    disableResizing: true
  }, function (_ref5) {
    var height = _ref5.height;
    return /*#__PURE__*/React__default.createElement("div", _extends({}, getTableProps(), {
      className: "table"
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "thead table-row table-row--head"
    }, headerGroups.map(function (headerGroup) {
      return /*#__PURE__*/React__default.createElement("div", _extends({}, headerGroup.getHeaderGroupProps(), {
        className: "tr"
      }), headerGroup.headers.map(function (column) {
        return /*#__PURE__*/React__default.createElement("div", _extends({}, column.getHeaderProps(), {
          className: "table-cell column-heading th"
        }), /*#__PURE__*/React__default.createElement("div", column.getSortByToggleProps(), column.render("Header"), /*#__PURE__*/React__default.createElement("span", null, column.isSorted ? /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconSort, {
          className: column.isSortedDesc ? "sort-asc" : "sort-desc"
        })) : "")), /*#__PURE__*/React__default.createElement("div", {
          className: "txt-wrap column-filter " + (isFilterOpen ? "open" : "")
        }, !column.disableFilters ? column.render("Filter") : null), column.canResize && /*#__PURE__*/React__default.createElement("div", _extends({}, column.getResizerProps(), {
          className: "resizer"
        })));
      }));
    })), /*#__PURE__*/React__default.createElement("div", _extends({}, getTableBodyProps(), {
      className: "tbody"
    }), /*#__PURE__*/React__default.createElement(InfiniteLoader, {
      isItemLoaded: isItemLoaded,
      itemCount: itemCount,
      loadMoreItems: loadMoreItems
    }, function (_ref6) {
      var onItemsRendered = _ref6.onItemsRendered,
          _ref7 = _ref6.ref;
      return /*#__PURE__*/React__default.createElement(reactWindow.VariableSizeList, {
        ref: function ref(list) {
          _ref7(list);

          listRef.current = list;
        },
        style: {
          overflowX: "hidden"
        },
        height: height - 60,
        itemCount: rows.length,
        itemSize: function itemSize(index) {
          return calculateRowHeight(rows[index], headerGroups && headerGroups.length ? headerGroups[0].headers : []);
        },
        onItemsRendered: onItemsRendered,
        overscanCount: 20
      }, RenderRow);
    })));
  })));
});
Customgrid.propTypes = {
  title: propTypes.any,
  gridHeight: propTypes.any,
  gridWidth: propTypes.any,
  managableColumns: propTypes.any,
  originalColumns: propTypes.any,
  data: propTypes.any,
  getRowEditOverlay: propTypes.any,
  updateRowInGrid: propTypes.any,
  deleteRowFromGrid: propTypes.any,
  globalSearchLogic: propTypes.any,
  selectBulkData: propTypes.any,
  calculateRowHeight: propTypes.any,
  isExpandContentAvailable: propTypes.any,
  displayExpandedContent: propTypes.any,
  hasNextPage: propTypes.any,
  isNextPageLoading: propTypes.any,
  loadNextPage: propTypes.any,
  doGroupSort: propTypes.any,
  getToggleAllRowsSelectedProps: propTypes.any,
  row: propTypes.any,
  additionalColumn: propTypes.any,
  rowActions: propTypes.any,
  rowActionCallback: propTypes.any
};

var Grid = React.memo(function (props) {
  var title = props.title,
      gridHeight = props.gridHeight,
      gridWidth = props.gridWidth,
      loadData = props.loadData,
      columns = props.columns,
      columnToExpand = props.columnToExpand,
      rowActions = props.rowActions,
      rowActionCallback = props.rowActionCallback,
      getRowEditOverlay = props.getRowEditOverlay,
      updateRowData = props.updateRowData,
      deleteRowData = props.deleteRowData,
      selectBulkData = props.selectBulkData,
      calculateRowHeight = props.calculateRowHeight;
  var isDesktop = window.innerWidth > 1024;

  var _useState = React.useState(true),
      hasNextPage = _useState[0],
      setHasNextPage = _useState[1];

  var _useState2 = React.useState(false),
      isNextPageLoading = _useState2[0],
      setIsNextPageLoading = _useState2[1];

  var _useState3 = React.useState(false),
      isLoading = _useState3[0],
      setIsLoading = _useState3[1];

  var _useState4 = React.useState([]),
      items = _useState4[0],
      setItems = _useState4[1];

  var _useState5 = React.useState([]),
      groupSortOptions = _useState5[0],
      setGroupSortOptions = _useState5[1];

  var searchColumn = function searchColumn(column, original, searchText) {
    var isValuePresent = false;
    var accessor = column.accessor,
        innerCells = column.innerCells;
    var rowAccessorValue = original[accessor];
    var isInnerCellsPresent = innerCells && innerCells.length > 0;

    if (typeof rowAccessorValue === "object" && isInnerCellsPresent) {
      if (rowAccessorValue.length > 0) {
        rowAccessorValue.forEach(function (value) {
          innerCells.forEach(function (cell) {
            var dataAccessor = value[cell.accessor];

            if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
              isValuePresent = true;
            }
          });
        });
      } else {
        innerCells.forEach(function (cell) {
          var dataAccessor = original[accessor][cell.accessor];

          if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
            isValuePresent = true;
          }
        });
      }
    } else {
      var dataAccessor = original[accessor];

      if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
        isValuePresent = true;
      }
    }

    return isValuePresent;
  };

  var updateRowInGrid = function updateRowInGrid(original, updatedRow) {
    setItems(function (old) {
      return old.map(function (row) {
        var newRow = row;

        if (Object.entries(row).toString() === Object.entries(original).toString()) {
          newRow = updatedRow;
        }

        return newRow;
      });
    });

    if (updateRowData) {
      updateRowData(updatedRow);
    }
  };

  var deleteRowFromGrid = function deleteRowFromGrid(original) {
    setItems(function (old) {
      return old.filter(function (row) {
        return row !== original;
      });
    });

    if (deleteRowData) {
      deleteRowData(original);
    }
  };

  var processedColumns = extractColumns(columns, searchColumn, isDesktop, updateRowInGrid);
  var additionalColumn = extractAdditionalColumn(columnToExpand, isDesktop);
  var gridColumns = React.useMemo(function () {
    return processedColumns;
  }, []);
  var renderExpandedContent = additionalColumn ? additionalColumn.displayCell : null;

  var displayExpandedContent = function displayExpandedContent(row) {
    var original = row.original;
    var additionalColumnObj = additionalColumn;

    if (original) {
      return /*#__PURE__*/React__default.createElement(AdditionalColumnContext.Provider, {
        value: {
          additionalColumn: additionalColumnObj
        }
      }, renderExpandedContent(original, AdditionalColumnTag));
    }

    return null;
  };

  var globalSearchLogic = function globalSearchLogic(rows, filterValue) {
    if (filterValue && processedColumns.length > 0) {
      var searchText = filterValue.toLowerCase();
      return rows.filter(function (row) {
        var original = row.original;
        var returnValue = false;
        processedColumns.forEach(function (column) {
          returnValue = returnValue || searchColumn(column, original, searchText);
        });
        return returnValue;
      });
    }

    return rows;
  };

  var calculateDefaultRowHeight = function calculateDefaultRowHeight(row, columnsInGrid) {
    var rowHeight = 50;

    if (columnsInGrid && columnsInGrid.length > 0 && row) {
      var original = row.original,
          isExpanded = row.isExpanded;
      var columnWithMaxWidth = [].concat(columnsInGrid).sort(function (a, b) {
        return b.width - a.width;
      })[0];
      var id = columnWithMaxWidth.id,
          width = columnWithMaxWidth.width,
          totalFlexWidth = columnWithMaxWidth.totalFlexWidth;
      var rowValue = original[id];

      if (rowValue) {
        var textLength = Object.values(rowValue).join(",").length;
        rowHeight += Math.ceil(80 * textLength / totalFlexWidth);
        var widthVariable = totalFlexWidth > width ? totalFlexWidth - width : width - totalFlexWidth;
        rowHeight += widthVariable / 1000;
      }

      if (isExpanded && additionalColumn) {
        rowHeight += additionalColumn.innerCells && additionalColumn.innerCells.length > 0 ? additionalColumn.innerCells.length * 35 : 35;
      }
    }

    return rowHeight;
  };

  var compareValues = function compareValues(compareOrder, v1, v2) {
    var returnValue = 0;

    if (compareOrder === "Ascending") {
      if (v1 > v2) {
        returnValue = 1;
      } else if (v1 < v2) {
        returnValue = -1;
      }

      return returnValue;
    }

    if (v1 < v2) {
      returnValue = 1;
    } else if (v1 > v2) {
      returnValue = -1;
    }

    return returnValue;
  };

  var getSortedData = function getSortedData(originalData) {
    return originalData.sort(function (x, y) {
      var compareResult = 0;
      groupSortOptions.forEach(function (option) {
        var sortBy = option.sortBy,
            sortOn = option.sortOn,
            order = option.order;
        var newResult = sortOn === "value" ? compareValues(order, x[sortBy], y[sortBy]) : compareValues(order, x[sortBy][sortOn], y[sortBy][sortOn]);
        compareResult = compareResult || newResult;
      });
      return compareResult;
    });
  };

  var doGroupSort = function doGroupSort(sortOptions) {
    setGroupSortOptions(sortOptions);
  };

  var loadNextPage = function loadNextPage() {
    if (hasNextPage) {
      setIsLoading(true);
      setIsNextPageLoading(true);
      loadData().then(function (data) {
        setIsLoading(false);
        setHasNextPage(data && data.length > 0);
        setIsNextPageLoading(false);
        setItems(items.concat(data));
      });
    }
  };

  React.useEffect(function () {
    processedColumns.map(function (column) {
      var columnTpProcess = column;

      if (column.innerCells) {
        columnTpProcess.originalInnerCells = column.innerCells;
      }

      return columnTpProcess;
    });

    if (additionalColumn) {
      var innerCells = additionalColumn.innerCells;

      if (innerCells) {
        additionalColumn.originalInnerCells = innerCells;
      }
    }

    setIsLoading(true);
    loadData().then(function (data) {
      setIsLoading(false);
      setItems(data);
    });
  }, []);
  var data = getSortedData([].concat(items));
  return /*#__PURE__*/React__default.createElement("div", {
    className: "grid-component-container"
  }, data && data.length > 0 && processedColumns && processedColumns.length > 0 ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Customgrid, {
    title: title,
    gridHeight: gridHeight,
    gridWidth: gridWidth,
    managableColumns: gridColumns,
    originalColumns: gridColumns,
    additionalColumn: additionalColumn,
    data: data,
    getRowEditOverlay: getRowEditOverlay,
    updateRowInGrid: updateRowInGrid,
    deleteRowFromGrid: deleteRowFromGrid,
    globalSearchLogic: globalSearchLogic,
    selectBulkData: selectBulkData,
    calculateRowHeight: calculateRowHeight && typeof calculateRowHeight === "function" ? calculateRowHeight : calculateDefaultRowHeight,
    isExpandContentAvailable: typeof renderExpandedContent === "function",
    displayExpandedContent: displayExpandedContent,
    rowActions: rowActions,
    rowActionCallback: rowActionCallback,
    hasNextPage: hasNextPage,
    isNextPageLoading: isNextPageLoading,
    loadNextPage: loadNextPage,
    doGroupSort: doGroupSort
  }), isNextPageLoading ? /*#__PURE__*/React__default.createElement("div", {
    id: "loader",
    className: "background"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "dots container"
  }, /*#__PURE__*/React__default.createElement("span", null), /*#__PURE__*/React__default.createElement("span", null), /*#__PURE__*/React__default.createElement("span", null))) : null) : /*#__PURE__*/React__default.createElement("h2", {
    style: {
      textAlign: "center",
      marginTop: "70px"
    }
  }, isLoading ? "Initializing Grid..." : /*#__PURE__*/React__default.createElement("span", {
    className: "error"
  }, "Invalid Data or Column Configurations")));
});
Grid.propTypes = {
  title: propTypes.any,
  gridHeight: propTypes.any,
  gridWidth: propTypes.any,
  columns: propTypes.any,
  columnToExpand: propTypes.any,
  loadData: propTypes.any,
  getRowEditOverlay: propTypes.any,
  updateRowData: propTypes.any,
  deleteRowData: propTypes.any,
  selectBulkData: propTypes.any,
  calculateRowHeight: propTypes.any,
  rowActions: propTypes.any,
  rowActionCallback: propTypes.any
};

module.exports = Grid;
//# sourceMappingURL=index.js.map
