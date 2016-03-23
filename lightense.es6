var Lightense = (function() {
  'use strict';

  var KEYCODE_ESC = 27;
  var target;
  var container;
  var date;
  var scrollY;

  function startTracking (passedElements) {
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

  function track (element) {
    // Element needs a src at minumun
    if (element.getAttribute('data-image') || element.src) {
      element.style.cursor = 'zoom-in';
      element.addEventListener('click', function () {
        init(this);
      }, false);
    }
  }

  // Create stylesheets
  function createStyle () {
    // Generate unique class name
    date = new Date().getTime();
    var css = `
      .lightense-${date} {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        z-index: 2147483647;
        padding: 2vw;
        margin: 0;
        transition: opacity 200ms ease;
        cursor: zoom-out;
        opacity: 0;
        background-color: rgba(255, 255, 255, .98);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      @supports (-webkit-backdrop-filter: blur(30px)) {
        .lightense-${date} {
          background-color: rgba(255, 255, 255, .6);
          -webkit-backdrop-filter: blur(30px);
          backdrop-filter: blur(30px);
        }
      }

      .lightense-${date} img {
        display: block;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        min-width: 0;
        min-height: 0;
        padding: 0;
        margin: 0 auto;
      }
    `;

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  function createViewer (background) {
    scrollY = window.scrollY;
    container = document.createElement('div');
    container.className = `lightense-wrap lightense-${date}`;
    container.appendChild(target);
    if (background) container.style.backgroundColor = background;

    document.body.appendChild(container);
    setTimeout(function () {
      container.style.opacity = '1';
    }, 10);
  }

  function removeViewer () {
    unbindEvents();

    container.style.opacity = '0';
    setTimeout(function () {
      document.body.removeChild(container);
    }, 200);
  }

  function checkViewer () {
    var scrollOffset = Math.abs(scrollY - window.scrollY);
    if (scrollOffset >= 50) {
      removeViewer();
    }
  }

  function init (element) {
    var imageSource = element.getAttribute('data-image') || element.src;

    // If Command (OS X) or Ctrl (Windows) key pressed, stop processing and
    // open the image in new tab
    if (event.metaKey || event.ctrlKey) {
      return window.open(imageSource, '_blank');
    }

    var background = element.getAttribute('data-background') || false;
    var img = new Image();
    img.onload = function () {
      target = this;
      createViewer(background);
      bindEvents();
    };
    img.src = imageSource;
  }

  function bindEvents () {
    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('scroll', checkViewer, false);
    container.addEventListener('click', removeViewer, false);
  }

  function unbindEvents () {
    window.removeEventListener('keyup', onKeyUp, false);
    window.removeEventListener('scroll', checkViewer, false);
    container.removeEventListener('click', removeViewer, false);
  }

  // Exit on excape key pressed
  function onKeyUp (event) {
    event.preventDefault();
    if (event.keyCode === KEYCODE_ESC) {
      removeViewer();
    }
  }

  function main (element) {
    // Parse arguments
    if (!element) {
      throw 'You need to pass an element!';
    }

    // Prepare stylesheets
    createStyle();

    // Pass and prepare elements
    startTracking(element);
  }

  return main;
})();
