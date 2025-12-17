/**
 * AFTER REFACTORING: Clear, maintainable code with single responsibilities
 *
 * Improvements:
 * - Separated concerns (validation, formatting, calculation)
 * - Clear function names and variable names
 * - Reduced nesting
 * - Easy to test each function independently
 * - Easy to maintain and extend
 */

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates a user's name
 * @param {string} name - The user's name
 * @returns {boolean} True if valid, false otherwise
 */
function isValidName(name) {
    return typeof name === 'string' && name.trim().length > 0;
}

/**
 * Validates a user's age
 * @param {number} age - The user's age
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAge(age) {
    return typeof age === 'number' && age > 0 && age <= 150;
}

/**
 * Validates an email address with detailed error checking
 * @param {string} email - The email address to validate
 * @returns {{isValid: boolean, reason?: string}} Validation result
 */
function validateEmail(email) {
    if (typeof email !== 'string') {
        return { isValid: false, reason: 'Invalid or missing email' };
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
        return { isValid: false, reason: 'Email missing @ or .' };
    }

    const parts = normalizedEmail.split('@');
    if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
        return { isValid: false, reason: 'Invalid email format' };
    }

    return { isValid: true };
}

/**
 * Validates all user fields and returns validation result
 * @param {Object} user - The user object to validate
 * @returns {{isValid: boolean, reason?: string}} Validation result
 */
function validateUser(user) {
    if (!user || typeof user !== 'object') {
        return { isValid: false, reason: 'Invalid user object' };
    }

    if (!isValidName(user.name)) {
        return { isValid: false, reason: 'Invalid or missing name' };
    }

    if (!isValidAge(user.age)) {
        return { isValid: false, reason: 'Invalid or missing age' };
    }

    const emailValidation = validateEmail(user.email);
    if (!emailValidation.isValid) {
        return emailValidation;
    }

    return { isValid: true };
}

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Capitalizes each word in a name
 * @param {string} name - The name to format
 * @returns {string} Formatted name
 */
function formatUserName(name) {
    return name
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Normalizes an email address
 * @param {string} email - The email to normalize
 * @returns {string} Normalized email
 */
function normalizeEmail(email) {
    return email.toLowerCase().trim();
}

/**
 * Determines age category for a user
 * @param {number} age - The user's age
 * @returns {string} Age category
 */
function getAgeCategory(age) {
    if (age < 13) return 'child';
    if (age < 18) return 'teen';
    if (age < 65) return 'adult';
    return 'senior';
}

/**
 * Determines if user is an adult
 * @param {number} age - The user's age
 * @returns {string} Status
 */
function getAgeStatus(age) {
    return age >= 18 ? 'adult' : 'minor';
}

/**
 * Formats a validated user object
 * @param {Object} user - The user to format
 * @param {number} id - The ID to assign
 * @returns {Object} Formatted user object
 */
function formatUser(user, id) {
    return {
        id,
        fullName: formatUserName(user.name),
        userAge: user.age,
        contact: normalizeEmail(user.email),
        status: getAgeStatus(user.age),
        category: getAgeCategory(user.age)
    };
}

// ============================================
// STATISTICS FUNCTIONS
// ============================================

/**
 * Calculates statistics from valid users
 * @param {Array} validUsers - Array of valid formatted users
 * @returns {Object} Statistics object
 */
function calculateStatistics(validUsers) {
    const totalUsers = validUsers.length;

    if (totalUsers === 0) {
        return {
            total: 0,
            averageAge: 0,
            adults: 0,
            minors: 0,
            adultPercentage: 0
        };
    }

    const totalAge = validUsers.reduce((sum, user) => sum + user.userAge, 0);
    const adultsCount = validUsers.filter(user => user.status === 'adult').length;
    const minorsCount = totalUsers - adultsCount;

    return {
        total: totalUsers,
        averageAge: Math.round((totalAge / totalUsers) * 100) / 100,
        adults: adultsCount,
        minors: minorsCount,
        adultPercentage: Math.round((adultsCount / totalUsers) * 10000) / 100
    };
}

// ============================================
// MAIN PROCESSING FUNCTION
// ============================================

/**
 * Processes user data array, validates, formats, and calculates statistics
 * @param {Array} data - Array of user objects to process
 * @returns {Object} Processing result with valid users, invalid users, and statistics
 */
function processUserData(data) {
    if (!Array.isArray(data)) {
        throw new Error('Input must be an array');
    }

    const validUsers = [];
    const invalidUsers = [];
    let idCounter = 1;

    for (const user of data) {
        const validation = validateUser(user);

        if (validation.isValid) {
            const formattedUser = formatUser(user, idCounter);
            validUsers.push(formattedUser);
            idCounter++;
        } else {
            invalidUsers.push({
                data: user,
                reason: validation.reason
            });
        }
    }

    const statistics = calculateStatistics(validUsers);

    return {
        valid: validUsers,
        invalid: invalidUsers,
        stats: statistics
    };
}

module.exports = {
    processUserData,
    // Export individual functions for testing
    isValidName,
    isValidAge,
    validateEmail,
    validateUser,
    formatUserName,
    normalizeEmail,
    getAgeCategory,
    getAgeStatus,
    formatUser,
    calculateStatistics
};
