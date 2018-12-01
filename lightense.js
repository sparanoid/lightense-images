/*! lightense-images v1.0.5 | © Tunghsiao Liu | MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Lightense"] = factory();
	else
		root["Lightense"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Lightense = function Lightense() {
  'use strict'; // Save some bytes

  var w = window;
  var d = document; // default options

  var defaults = {
    time: 300,
    padding: 40,
    offset: 40,
    keyboard: true,
    cubicBezier: 'cubic-bezier(.2, 0, .1, 1)',
    background: 'rgba(255, 255, 255, .98)',
    zIndex: 2147483647
  }; // Init user options

  var config = {}; // Init target elements

  var elements;

  function getElements(elements) {
    switch (_typeof(elements)) {
      case 'undefined':
        throw 'You need to pass an element!';

      case 'string':
        return document.querySelectorAll(elements);

      case 'object':
        return elements;
    }
  }

  function startTracking(passedElements) {
    // If passed an array of elements, assign tracking to all
    var len = passedElements.length;

    if (len) {
      // Loop and assign
      for (var i = 0; i < len; i++) {
        track(passedElements[i]);
      }
    } else {
      track(passedElements);
    }
  }

  function track(element) {
    if (element.src) {
      element.classList.add('lightense-target');
      element.addEventListener('click', function (event) {
        if (config.keyboard) {
          // If Command (macOS) or Ctrl (Windows) key pressed, stop processing
          // and open the image in a new tab
          if (event.metaKey || event.ctrlKey) {
            return w.open(element.src, '_blank');
          }
        } // Init instance


        init(this);
      }, false);
    }
  }

  function ifHex(input) {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(input);
  } // https://regex101.com/r/wHoiD0/1


  function ifRgb(input) {
    return /(rgb\((?:\d{1,3}[,\)] ?){3}(?:\d?\.\d+\))?)/.test(input);
  }

  function ifRgba(input) {
    return /(rgba\((?:\d{1,3}[,\)] ?){3}(?:\d?\.\d+\))?)/.test(input);
  } // https://stackoverflow.com/a/21648508/412385


  function hexToRgbA(input) {
    var color;

    if (ifHex(input)) {
      color = input.substring(1).split('');

      if (color.length === 3) {
        color = [color[0], color[0], color[1], color[1], color[2], color[2]];
      }

      color = '0x' + color.join('');
      return 'rgba(' + [color >> 16 & 255, color >> 8 & 255, color & 255].join(', ') + ', 1)';
    }

    if (ifRgb(input)) {
      return input.replace(')', ', 1)');
    }

    if (ifRgba(input)) {
      return input;
    } // silent errors and return a general rgba color


    console.log('Invalid color: ' + input);
    return defaults.background;
  }

  function computeBackgroundSafari(color) {
    var background = hexToRgbA(color);
    var factor = 0.7;
    var regex = /([\d\.]+)\)$/g;
    var alpha = regex.exec(background)[1];
    return background.replace(regex, alpha * factor + ')');
  }

  function insertCss(styleId, styleContent) {
    var head = d.head || d.getElementsByTagName('head')[0]; // Remove existing instance

    if (d.getElementById(styleId)) {
      d.getElementById(styleId).remove();
    } // Create new instance


    var styleEl = d.createElement('style');
    styleEl.id = styleId; // Check if content exists

    if (styleEl.styleSheet) {
      styleEl.styleSheet.cssText = styleContent;
    } else {
      styleEl.appendChild(d.createTextNode(styleContent));
    }

    head.appendChild(styleEl);
  }

  function createDefaultCss() {
    var css = "\n.lightense-backdrop {\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  overflow: hidden;\n  z-index: ".concat(config.zIndex - 1, ";\n  padding: 0;\n  margin: 0;\n  transition: opacity ").concat(config.time, "ms ease;\n  cursor: zoom-out;\n  opacity: 0;\n  background-color: ").concat(config.background, ";\n  visibility: hidden;\n}\n\n@supports (-webkit-backdrop-filter: blur(30px)) {\n  .lightense-backdrop {\n    background-color: ").concat(computeBackgroundSafari(config.background), ";\n    -webkit-backdrop-filter: blur(30px);\n    backdrop-filter: blur(30px);\n  }\n}\n\n.lightense-wrap {\n  position: relative;\n  transition: transform ").concat(config.time, "ms ").concat(config.cubicBezier, ";\n  z-index: ").concat(config.zIndex, ";\n  pointer-events: none;\n}\n\n.lightense-target {\n  cursor: zoom-in;\n  transition: transform ").concat(config.time, "ms ").concat(config.cubicBezier, ";\n  pointer-events: auto;\n}\n\n.lightense-open {\n  cursor: zoom-out;\n}\n\n.lightense-transitioning {\n  pointer-events: none;\n}");
    insertCss('lightense-images-css', css);
  }

  function createBackdrop() {
    config.container = d.createElement('div');
    config.container.className = 'lightense-backdrop';
    d.body.appendChild(config.container);
  }

  function createTransform(img) {
    // Get original image size
    var naturalWidth = img.width;
    var naturalHeight = img.height; // Calc zoom ratio

    var scrollTop = w.pageYOffset || d.documentElement.scrollTop || 0;
    var scrollLeft = w.pageXOffset || d.documentElement.scrollLeft || 0;
    var targetImage = config.target.getBoundingClientRect();
    var maxScaleFactor = naturalWidth / targetImage.width;
    var viewportWidth = w.innerWidth || d.documentElement.clientWidth || 0;
    var viewportHeight = w.innerHeight || d.documentElement.clientHeight || 0;
    var viewportPadding = config.target.getAttribute('data-lightense-padding') || config.target.getAttribute('data-padding') || config.padding;
    var viewportWidthOffset = viewportWidth > viewportPadding ? viewportWidth - viewportPadding : viewportWidth - defaults.padding;
    var viewportHeightOffset = viewportHeight > viewportPadding ? viewportHeight - viewportPadding : viewportHeight - defaults.padding;
    var imageRatio = naturalWidth / naturalHeight;
    var viewportRatio = viewportWidthOffset / viewportHeightOffset;

    if (naturalWidth < viewportWidthOffset && naturalHeight < viewportHeightOffset) {
      config.scaleFactor = maxScaleFactor;
    } else if (imageRatio < viewportRatio) {
      config.scaleFactor = viewportHeightOffset / naturalHeight * maxScaleFactor;
    } else {
      config.scaleFactor = viewportWidthOffset / naturalWidth * maxScaleFactor;
    } // Calc animation


    var viewportX = viewportWidth / 2;
    var viewportY = scrollTop + viewportHeight / 2;
    var imageCenterX = targetImage.left + scrollLeft + targetImage.width / 2;
    var imageCenterY = targetImage.top + scrollTop + targetImage.height / 2;
    config.translateX = viewportX - imageCenterX;
    config.translateY = viewportY - imageCenterY;
  }

  function createViewer() {
    config.target.classList.add('lightense-open'); // Create wrapper element

    config.wrap = d.createElement('div');
    config.wrap.className = 'lightense-wrap'; // Apply zoom ratio to target image

    setTimeout(function () {
      config.target.style.transform = 'scale(' + config.scaleFactor + ')';
    }, 20); // Apply animation to outer wrapper

    config.target.parentNode.insertBefore(config.wrap, config.target);
    config.wrap.appendChild(config.target);
    setTimeout(function () {
      config.wrap.style.transform = 'translate3d(' + config.translateX + 'px, ' + config.translateY + 'px, 0)';
    }, 20); // Show backdrop

    var item_options = {
      cubicBezier: config.target.getAttribute('data-lightense-cubic-bezier') || config.cubicBezier,
      background: config.target.getAttribute('data-lightense-background') || config.target.getAttribute('data-background') || config.background,
      zIndex: config.target.getAttribute('data-lightense-z-index') || config.zIndex
    }; // Create new config for item-specified styles

    var config_computed = Object.assign({}, config, item_options);
    var css = "\n    .lightense-backdrop {\n      z-index: ".concat(config_computed.zIndex - 1, ";\n      transition: opacity ").concat(config_computed.time, "ms ease;\n      background-color: ").concat(config_computed.background, ";\n    }\n\n    @supports (-webkit-backdrop-filter: blur(30px)) {\n      .lightense-backdrop {\n        background-color: ").concat(computeBackgroundSafari(config_computed.background), ";\n      }\n    }\n\n    .lightense-wrap {\n      transition: transform ").concat(config_computed.time, "ms ").concat(config_computed.cubicBezier, ";\n      z-index: ").concat(config_computed.zIndex, ";\n    }\n\n    .lightense-target {\n      transition: transform ").concat(config_computed.time, "ms ").concat(config_computed.cubicBezier, ";\n    }");
    insertCss('lightense-images-css-computed', css);
    config.container.style.visibility = 'visible';
    setTimeout(function () {
      config.container.style.opacity = '1';
    }, 20);
  }

  function removeViewer() {
    unbindEvents();
    config.target.classList.remove('lightense-open'); // Remove transform styles

    config.wrap.style.transform = '';
    config.target.style.transform = '';
    config.target.classList.add('lightense-transitioning'); // Fadeout backdrop

    config.container.style.opacity = ''; // Hide backdrop and remove target element wrapper

    setTimeout(function () {
      config.container.style.visibility = '';
      config.container.style.backgroundColor = '';
      config.wrap.parentNode.replaceChild(config.target, config.wrap);
      config.target.classList.remove('lightense-transitioning');
    }, config.time);
  }

  function checkViewer() {
    var scrollOffset = Math.abs(config.scrollY - w.scrollY);

    if (scrollOffset >= config.offset) {
      removeViewer();
    }
  }

  function init(element) {
    config.target = element; // TODO: need refine
    // If element already openned, close it

    if (config.target.classList.contains('lightense-open')) {
      return removeViewer();
    } // Save current window scroll position for later use


    config.scrollY = w.scrollY;
    var img = new Image();

    img.onload = function () {
      createTransform(this);
      createViewer();
      bindEvents();
    };

    img.src = config.target.src;
  }

  function bindEvents() {
    w.addEventListener('keyup', onKeyUp, false);
    w.addEventListener('scroll', checkViewer, false);
    config.container.addEventListener('click', removeViewer, false);
  }

  function unbindEvents() {
    w.removeEventListener('keyup', onKeyUp, false);
    w.removeEventListener('scroll', checkViewer, false);
    config.container.removeEventListener('click', removeViewer, false);
  } // Exit on excape (esc) key pressed


  function onKeyUp(event) {
    event.preventDefault();

    if (event.keyCode === 27) {
      removeViewer();
    }
  }

  function main(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // Parse elements
    elements = getElements(target); // Parse user options

    config = Object.assign({}, defaults, options); // Prepare stylesheets

    createDefaultCss(); // Prepare backdrop element

    createBackdrop(); // Pass and prepare elements

    startTracking(elements);
  }

  return main;
};

var singleton = Lightense();
module.exports = singleton;

/***/ })
/******/ ]);
});