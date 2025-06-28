import { UIEvent } from 'react';

const stopPropogation =
  <E extends UIEvent = UIEvent, T = void>(fn: (event: E) => T) =>
  (event: E) => {
    event.stopPropagation();
    return fn(event);
  };

export default stopPropogation;
