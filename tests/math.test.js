// Its very important to create test cases
const {
  add,
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
  expect(total).toBe(12.5);
});

test('Should convert 32 F to 0 C ', function() {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test('Should convert 0C to 32 F', function() {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});

// test('Async test demo ', done => {
//   setTimeout(() => {
//     expect(1).toBe(1);
//     done();
//   }, 2000);
// });

test('Promise tests ', done => {
  add(2, 3).then(sum => {
    expect(sum).toBe(5);
    done();
  });
});

test('should add two numbers async/await', async () => {
  const sum = await add(10, 22);
  expect(sum).toBe(32);
});
