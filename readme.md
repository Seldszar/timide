# timide

> Yet another resumable timer

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Author](#author)
- [License](#license)

# Install

```bash
$ npm install timide
```

# Usage

```javascript
const {Timer} = require('timide');

const timer = new Timer({
  // The initial state (default: `[false, 0, 0]`)
  state: [false, 1598126121368, -20000],

  // The tick interval (default: `100`)
  interval: 100,
});

timer.on('state', (value) => {
  // Emitted when the state changes
});

timer.on('time', (value) => {
  // Emitted when the interval ticks or the state changes
});

// Starts the timer
timer.start();

// Stops the timer
timer.stop();

// Starts the timer including the missed time if stopped
timer.start(true);

// Updates the timer time
timer.seek(20000);

// Resets the timer
timer.reset();
```

## API

See the [declaration file](./index.d.ts).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
