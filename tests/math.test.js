// Its very important to create test cases
const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit
} = require('../src/math');

test('Should calculate total with tip', function() {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test('Should calculate total with default tip', function() {
  const total = calculateTip(10);
  expect(total).toBe(13);
});

test('Should convert 32 F to 0 C ', function() {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test('Should convert 0C to 32 F', function() {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});
