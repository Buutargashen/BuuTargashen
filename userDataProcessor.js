/**
 * BEFORE REFACTORING: Complex function with multiple responsibilities
 * This function processes user data, validates it, formats it, and calculates statistics
 * Issues:
 * - Multiple responsibilities (validation, formatting, calculation)
 * - Deep nesting
 * - Unclear variable names
 * - Hard to test
 * - Difficult to maintain
 */

function processUserData(data) {
    let result = { valid: [], invalid: [], stats: {} };
    let tc = 0, ta = 0, ac = 0;

    if (data && Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            let u = data[i];
            if (u && typeof u === 'object') {
                if (u.name && typeof u.name === 'string' && u.name.length > 0) {
                    if (u.age && typeof u.age === 'number' && u.age >= 0 && u.age <= 150) {
                        if (u.email && typeof u.email === 'string') {
                            let em = u.email.toLowerCase().trim();
                            if (em.includes('@') && em.includes('.')) {
                                let parts = em.split('@');
                                if (parts.length === 2 && parts[0].length > 0 && parts[1].length > 0) {
                                    let formatted = {
                                        id: tc + 1,
                                        fullName: u.name.trim().split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' '),
                                        userAge: u.age,
                                        contact: em,
                                        status: u.age >= 18 ? 'adult' : 'minor',
                                        category: u.age < 13 ? 'child' : (u.age < 18 ? 'teen' : (u.age < 65 ? 'adult' : 'senior'))
                                    };
                                    result.valid.push(formatted);
                                    tc++;
                                    ta += u.age;
                                    if (u.age >= 18) ac++;
                                } else {
                                    result.invalid.push({ data: u, reason: 'Invalid email format' });
                                }
                            } else {
                                result.invalid.push({ data: u, reason: 'Email missing @ or .' });
                            }
                        } else {
                            result.invalid.push({ data: u, reason: 'Invalid or missing email' });
                        }
                    } else {
                        result.invalid.push({ data: u, reason: 'Invalid or missing age' });
                    }
                } else {
                    result.invalid.push({ data: u, reason: 'Invalid or missing name' });
                }
            } else {
                result.invalid.push({ data: u, reason: 'Invalid user object' });
            }
        }

        result.stats = {
            total: tc,
            averageAge: tc > 0 ? Math.round((ta / tc) * 100) / 100 : 0,
            adults: ac,
            minors: tc - ac,
            adultPercentage: tc > 0 ? Math.round((ac / tc) * 10000) / 100 : 0
        };
    } else {
        throw new Error('Input must be an array');
    }

    return result;
}

module.exports = { processUserData };
