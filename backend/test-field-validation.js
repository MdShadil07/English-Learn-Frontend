import { validateProfileUpdate } from './src/middleware/validation/validation.js';

// Test the field validation with different values
console.log('Testing field validation...');

// Test 1: Empty field (should pass)
const test1 = validateProfileUpdate[1]({ field: '' }, {}, () => {});
console.log('Test 1 - Empty field:', test1 ? 'FAILED' : 'PASSED');

// Test 2: Valid text field (should pass)
const test2 = validateProfileUpdate[1]({ field: 'Computer Science' }, {}, () => {});
console.log('Test 2 - Valid text field:', test2 ? 'FAILED' : 'PASSED');

// Test 3: Long field (should fail if over 100 chars)
const longField = 'a'.repeat(101);
const test3 = validateProfileUpdate[1]({ field: longField }, {}, () => {});
console.log('Test 3 - Long field (>100 chars):', test3 ? 'PASSED' : 'FAILED');

console.log('Validation tests completed!');
