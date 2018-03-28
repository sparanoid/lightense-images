const Lightense = () => {
  'use strict';

  // Save some bytes
  const w = window;
  const d = document;

  // default options
  const defaults = {
    time: 300,
    padding: 40,
    offset: 40,
    keyboard: true,
    cubicBezier: 'cubic-bezier(.2, 0, .1, 1)',
    background: 'rgba(255, 255, 255, .98)',
    backgroundSafari: 'rgba(255, 255, 255, .6)',
    zIndex: 2147483647
  };

  // Init user options
  var config = {};

  // Init target elements
  var elements;

  function getElements (elements) {
    switch (typeof elements) {
      case 'undefined':
        throw 'You need to pass an element!';

      case 'string':
        return document.querySelectorAll(elements);

      case 'object':
        return elements;
    }
  }

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
    if (element.src) {
      element.classList.add('lightense-target');
      element.addEventListener('click', function (event) {
        if (config.keyboard) {
          // If Command (macOS) or Ctrl (Windows) key pressed, stop processing
          // and open the image in a new tab
          if (event.metaKey || event.ctrlKey) {
            return w.open(element.src, '_blank');
          }
        }

        // Init instance
        init(this);
      }, false);
    }
  }

  function insertCss(styleId, styleContent) {
    var head = d.head || d.getElementsByTagName('head')[0];

    // Remove existing instance
    if(d.getElementById(styleId)){
      d.getElementById(styleId).remove();
    }

    // Create new instance
    var styleEl = d.createElement('style');
    styleEl.id = styleId;

    // Check if content exists
    if (styleEl.styleSheet) {
      styleEl.styleSheet.cssText = styleContent;
    } else {
      styleEl.appendChild(d.createTextNode(styleContent));
    }
    head.appendChild(styleEl);
  }

  function createDefaultCss () {
    var css = `
.lightense-backdrop {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: ${config.zIndex - 1};
  padding: 0;
  margin: 0;
  transition: opacity ${config.time}ms ease;
  cursor: zoom-out;
  opacity: 0;
  background-color: ${config.background};
  visibility: hidden;
}

@supports (-webkit-backdrop-filter: blur(30px)) {
  .lightense-backdrop {
    background-color: ${config.backgroundSafari};
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
  }
}

.lightense-wrap {
  position: relative;
  transition: transform ${config.time}ms ${config.cubicBezier};
  z-index: ${config.zIndex};
  pointer-events: none;
}

.lightense-target {
  cursor: zoom-in;
  transition: transform ${config.time}ms ${config.cubicBezier};
  pointer-events: auto;
}

.lightense-open {
  cursor: zoom-out;
}

.lightense-transitioning {
  pointer-events: none;
}`;
    insertCss('lightense-images-css', css);
  }

  function createBackdrop () {
    config.container = d.createElement('div');
    config.container.className = 'lightense-backdrop';
    d.body.appendChild(config.container);
  }

  function createTransform (img) {
    // Get original image size
    var naturalWidth = img.width;
    var naturalHeight = img.height;

    // Calc zoom ratio
    var scrollTop = w.pageYOffset || d.documentElement.scrollTop || 0;
    var scrollLeft = w.pageXOffset || d.documentElement.scrollLeft || 0;
    var targetImage = config.target.getBoundingClientRect();
    var maxScaleFactor = naturalWidth / targetImage.width;
    var viewportWidth  = w.innerWidth || d.documentElement.clientWidth || 0;
    var viewportHeight = w.innerHeight || d.documentElement.clientHeight || 0;
    var viewportPadding = config.target.getAttribute('data-padding') || config.padding;
    var viewportWidthOffset = viewportWidth > viewportPadding ? viewportWidth - viewportPadding : viewportWidth - defaults.padding;
    var viewportHeightOffset = viewportHeight > viewportPadding ? viewportHeight - viewportPadding : viewportHeight - defaults.padding;
    var imageRatio = naturalWidth / naturalHeight;
    var viewportRatio = viewportWidthOffset / viewportHeightOffset;

    if (naturalWidth < viewportWidthOffset && naturalHeight < viewportHeightOffset) {
      config.scaleFactor = maxScaleFactor;
    } else if (imageRatio < viewportRatio) {
      config.scaleFactor = (viewportHeightOffset / naturalHeight) * maxScaleFactor;
    } else {
      config.scaleFactor = (viewportWidthOffset / naturalWidth) * maxScaleFactor;
    }

    // Calc animation
    var viewportX = (viewportWidth / 2);
    var viewportY = scrollTop + (viewportHeight / 2);
    var imageCenterX = targetImage.left + scrollLeft + (targetImage.width / 2);
    var imageCenterY = targetImage.top + scrollTop + (targetImage.height / 2);

    config.translateX = viewportX - imageCenterX;
    config.translateY = viewportY - imageCenterY;
  }

  function createViewer () {
    config.target.classList.add('lightense-open');

    // Create wrapper element
    config.wrap = d.createElement('div');
    config.wrap.className = 'lightense-wrap';

    // Apply zoom ratio to target image
    setTimeout(function () {
      config.target.style.transform = 'scale(' + config.scaleFactor + ')';
    }, 20);

    // Apply animation to outer wrapper
    config.target.parentNode.insertBefore(config.wrap, config.target);
    config.wrap.appendChild(config.target);
    setTimeout(function () {
      config.wrap.style.transform = 'translate3d(' + config.translateX + 'px, ' + config.translateY + 'px, 0)';
    }, 20);

    // Show backdrop
    var item_options = {
      cubicBezier: config.target.getAttribute('data-lightense-cubic-bezier') || config.cubicBezier,
      background: config.target.getAttribute('data-lightense-background') || config.target.getAttribute('data-background') || config.background,
      backgroundSafari: config.target.getAttribute('data-lightense-background-safari') || config.backgroundSafari,
      zIndex: config.target.getAttribute('data-lightense-z-index') || config.zIndex
    };

    // Create new config for item-specified styles
    var config_computed = Object.assign({}, config, item_options);

    var css = `
    .lightense-backdrop {
      z-index: ${config_computed.zIndex - 1};
      transition: opacity ${config_computed.time}ms ease;
      background-color: ${config_computed.background};
    }

    @supports (-webkit-backdrop-filter: blur(30px)) {
      .lightense-backdrop {
        background-color: ${config_computed.backgroundSafari};
      }
    }

    .lightense-wrap {
      transition: transform ${config_computed.time}ms ${config_computed.cubicBezier};
      z-index: ${config_computed.zIndex};
    }

    .lightense-target {
      transition: transform ${config_computed.time}ms ${config_computed.cubicBezier};
    }`;
    insertCss('lightense-images-css-computed', css);

    config.container.style.visibility = 'visible';
    setTimeout(function () {
      config.container.style.opacity = '1';
    }, 20);
  }

  function removeViewer () {
    unbindEvents();

    config.target.classList.remove('lightense-open');

    // Remove transform styles
    config.wrap.style.transform = '';
    config.target.style.transform = '';
    config.target.classList.add('lightense-transitioning');

    // Fadeout backdrop
    config.container.style.opacity = '';

    // Hide backdrop and remove target element wrapper
    setTimeout(function () {
      config.container.style.visibility = '';
      config.container.style.backgroundColor = '';
      config.wrap.parentNode.replaceChild(config.target, config.wrap);
      config.target.classList.remove('lightense-transitioning');
    }, config.time);
  }

  function checkViewer () {
    var scrollOffset = Math.abs(config.scrollY - w.scrollY);
    if (scrollOffset >= config.offset) {
      removeViewer();
    }
  }

  function init (element) {
    config.target = element;

    // TODO: need refine
    // If element already openned, close it
    if (config.target.classList.contains('lightense-open')) {
      return removeViewer();
    }

    // Save current window scroll position for later use
    config.scrollY = w.scrollY;

    var img = new Image();
    img.onload = function () {
      createTransform(this);
      createViewer();
      bindEvents();
    };
    img.src = config.target.src;
  }

  function bindEvents () {
    w.addEventListener('keyup', onKeyUp, false);
    w.addEventListener('scroll', checkViewer, false);
    config.container.addEventListener('click', removeViewer, false);
  }

  function unbindEvents () {
    w.removeEventListener('keyup', onKeyUp, false);
    w.removeEventListener('scroll', checkViewer, false);
    config.container.removeEventListener('click', removeViewer, false);
  }

  // Exit on excape (esc) key pressed
  function onKeyUp (event) {
    event.preventDefault();
    if (event.keyCode === 27) {
      removeViewer();
    }
  }

  function main (target, options = {}) {
    // Parse elements
    elements = getElements(target);

    // Parse user options
    config = Object.assign({}, defaults, options);

    // Prepare stylesheets
    createDefaultCss();

    // Prepare backdrop element
    createBackdrop();

    // Pass and prepare elements
    startTracking(elements);
  }

  return main;
};

const singleton = Lightense();

module.exports = singleton;
