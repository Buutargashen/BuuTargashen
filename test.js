/**
 * Test suite to verify that refactored code maintains the same behavior
 */

const { processUserData: processUserDataOriginal } = require('./userDataProcessor');
const { processUserData: processUserDataRefactored } = require('./userDataProcessor.refactored');

// Test utilities
function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.error(`❌ FAILED: ${message}`);
        console.error('Expected:', JSON.stringify(expected, null, 2));
        console.error('Actual:', JSON.stringify(actual, null, 2));
        return false;
    }
    console.log(`✅ PASSED: ${message}`);
    return true;
}

function runTest(name, testFn) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TEST: ${name}`);
    console.log('='.repeat(60));
    try {
        testFn();
    } catch (error) {
        console.error(`❌ ERROR: ${error.message}`);
    }
}

// Test data
const testData = {
    valid: [
        { name: 'john doe', age: 25, email: 'JOHN@EXAMPLE.COM' },
        { name: 'jane smith', age: 17, email: 'jane@test.com' },
        { name: 'bob jones', age: 65, email: 'bob@email.org' }
    ],
    mixed: [
        { name: 'alice', age: 30, email: 'alice@test.com' },
        { name: '', age: 25, email: 'invalid@test.com' },
        { name: 'charlie', age: -5, email: 'charlie@test.com' },
        { name: 'david', age: 20, email: 'invalidemail' },
        { name: 'eve', age: 15, email: 'eve@example.com' }
    ],
    edgeCases: [
        { name: 'a', age: 0, email: 'a@b.c' },
        { name: 'senior citizen', age: 150, email: 'senior@test.com' },
        { name: 'UPPERCASE NAME', age: 40, email: 'CAPS@TEST.COM' }
    ]
};

// Run tests
runTest('Valid users - Original vs Refactored', () => {
    const original = processUserDataOriginal(testData.valid);
    const refactored = processUserDataRefactored(testData.valid);
    assertEqual(original, refactored, 'Both versions produce identical results for valid users');
});

runTest('Mixed valid/invalid users - Original vs Refactored', () => {
    const original = processUserDataOriginal(testData.mixed);
    const refactored = processUserDataRefactored(testData.mixed);
    assertEqual(original, refactored, 'Both versions produce identical results for mixed users');
});

runTest('Edge cases - Original vs Refactored', () => {
    const original = processUserDataOriginal(testData.edgeCases);
    const refactored = processUserDataRefactored(testData.edgeCases);
    assertEqual(original, refactored, 'Both versions handle edge cases identically');
});

runTest('Empty array - Original vs Refactored', () => {
    const original = processUserDataOriginal([]);
    const refactored = processUserDataRefactored([]);
    assertEqual(original, refactored, 'Both versions handle empty arrays identically');
});

runTest('Statistics calculation', () => {
    const result = processUserDataRefactored(testData.valid);

    assertEqual(result.stats.total, 3, 'Total count is correct');
    assertEqual(result.stats.adults, 2, 'Adult count is correct');
    assertEqual(result.stats.minors, 1, 'Minor count is correct');

    const expectedAverage = Math.round(((25 + 17 + 65) / 3) * 100) / 100;
    assertEqual(result.stats.averageAge, expectedAverage, 'Average age is calculated correctly');
});

runTest('User formatting', () => {
    const result = processUserDataRefactored([
        { name: 'john doe', age: 25, email: 'JOHN@EXAMPLE.COM' }
    ]);

    assertEqual(result.valid[0].fullName, 'John Doe', 'Name is properly capitalized');
    assertEqual(result.valid[0].contact, 'john@example.com', 'Email is normalized to lowercase');
    assertEqual(result.valid[0].status, 'adult', 'Adult status is correct');
    assertEqual(result.valid[0].category, 'adult', 'Age category is correct');
});

runTest('Age categories', () => {
    const testCases = [
        { name: 'child', age: 10, email: 'child@test.com', expectedCategory: 'child' },
        { name: 'teen', age: 15, email: 'teen@test.com', expectedCategory: 'teen' },
        { name: 'adult', age: 30, email: 'adult@test.com', expectedCategory: 'adult' },
        { name: 'senior', age: 70, email: 'senior@test.com', expectedCategory: 'senior' }
    ];

    const result = processUserDataRefactored(testCases);

    testCases.forEach((testCase, index) => {
        assertEqual(
            result.valid[index].category,
            testCase.expectedCategory,
            `${testCase.expectedCategory} category is correct`
        );
    });
});

runTest('Invalid data handling', () => {
    const invalidData = [
        { name: '', age: 25, email: 'test@test.com' },
        { name: 'test', age: 200, email: 'test@test.com' },
        { name: 'test', age: 25, email: 'notanemail' },
        null,
        { name: 123, age: 25, email: 'test@test.com' }
    ];

    const result = processUserDataRefactored(invalidData);

    assertEqual(result.valid.length, 0, 'No valid users in invalid data set');
    assertEqual(result.invalid.length, 5, 'All invalid users are caught');
});

console.log('\n' + '='.repeat(60));
console.log('TEST SUITE COMPLETED');
console.log('='.repeat(60));
