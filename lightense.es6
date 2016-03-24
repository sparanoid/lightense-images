var Lightense = (function () {
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
      element.classList.add('lightense-target');
      element.addEventListener('click', function () {
        init(this);
      }, false);
    }
  }

  // Create stylesheets
  function createStyle () {
    var css = `
      .lightense-bg {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        z-index: 10000;
        padding: 0;
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
        .lightense-bg {
          background-color: rgba(255, 255, 255, .6);
          -webkit-backdrop-filter: blur(30px);
          backdrop-filter: blur(30px);
        }
      }

      .lightense-bg img {
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

      .lightense-wrap {
        position: relative;
        transition: transform .2s ease;
        z-index: 2147483647;
      }

      .lightense-target {
        transition: transform .2s ease;
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
    container.className = 'lightense-bg';
    // TODO: disable image clone
    // container.appendChild(target);
    if (background) container.style.backgroundColor = background;

    document.body.appendChild(container);
    setTimeout(function () {
      container.style.opacity = '1';
    }, 10);
  }

  function removeViewer () {
    unbindEvents();

    // TODO: need optimization
    var el = document.querySelectorAll('.lightense-open');
    el[0].style.transform = '';
    el[0].classList.remove("lightense-open");

    var wrap = document.querySelectorAll('.lightense-wrap');
    wrap[0].style.transform = '';

    container.style.opacity = '0';
    setTimeout(function () {
      wrap[0].parentNode.replaceChild(el[0], wrap[0]);
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

    // If element already openned, close it
    if (element.classList.contains('lightense-open')) {
      return removeViewer();
    }

    var background = element.getAttribute('data-background') || false;

    var img = new Image();
    img.onload = function () {
      // set essential variables
      var scaleFactor = 1;
      var naturalWidth = img.width;
      var naturalHeight = img.height;
      console.log('The image size is ' + naturalWidth + '*' + naturalHeight);
      target = this;

      // calc zoom ratio
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
      var targetImage = element.getBoundingClientRect();
      console.log(targetImage);
      var maxScaleFactor = naturalWidth / targetImage.width;
      console.log('target image width: ' + targetImage.width);
      console.log('naturalWidth: ' + naturalWidth);
      console.log(maxScaleFactor);
      var viewportWidth  = window.innerWidth || document.documentElement.clientWidth || 0;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      console.log('viewport: ' + viewportWidth + '*' + viewportHeight);
      var imageRatio = naturalWidth / naturalHeight;
      console.log('imageRatio: ' + imageRatio);
      var viewportRatio = viewportWidth / viewportHeight;
      console.log('viewportRatio: ' + viewportRatio);

      if (naturalWidth < viewportWidth && naturalHeight < viewportHeight) {
        scaleFactor = maxScaleFactor;
      } else if (imageRatio < viewportRatio) {
        scaleFactor = (viewportHeight / naturalHeight) * maxScaleFactor;
      } else {
        scaleFactor = (viewportWidth / naturalWidth) * maxScaleFactor;
      }

      // apply zoom ratio
      console.log(element);
      setTimeout(function () {
        element.style.transform = 'scale(' + scaleFactor + ')';
      }, 10);
      element.classList.add('lightense-open');
      console.log('scaleFactor: transform: scale(' + scaleFactor + ');');

      // calc animation
      var translateX, translateY;
      var viewportX = (viewportWidth / 2);
      var viewportY = scrollTop + (viewportHeight / 2);
      var imageCenterX = targetImage.left + scrollLeft + (targetImage.width / 2);
      var imageCenterY = targetImage.top + scrollTop + (targetImage.height / 2);

      translateX = viewportX - imageCenterX;
      translateY = viewportY - imageCenterY;

      // apply animation
      var wrap = document.createElement('div');
          wrap.className = 'lightense-wrap';

      element.parentNode.insertBefore(wrap, element);
      wrap.appendChild(element);
      setTimeout(function () {
        wrap.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';
      }, 10);

      console.log('transform: translate(' + translateX + 'px, ' + translateY + 'px);');

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

  function main (elements) {
    // Parse arguments
    if (!elements) {
      throw 'You need to pass an element!';
    }

    // Prepare stylesheets
    createStyle();

    // Pass and prepare elements
    startTracking(elements);
  }

  return main;
})();
