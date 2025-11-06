import '@testing-library/jest-dom';

// Polyfill for Radix UI components that use pointer capture
if (typeof Element.prototype.hasPointerCapture === 'undefined') {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}

if (typeof Element.prototype.setPointerCapture === 'undefined') {
  Element.prototype.setPointerCapture = function () {
    // no-op
  };
}

if (typeof Element.prototype.releasePointerCapture === 'undefined') {
  Element.prototype.releasePointerCapture = function () {
    // no-op
  };
}

// Polyfill for scrollIntoView used by Radix UI
if (typeof Element.prototype.scrollIntoView === 'undefined') {
  Element.prototype.scrollIntoView = function () {
    // no-op
  };
}
