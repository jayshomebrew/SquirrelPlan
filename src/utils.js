/**
 * Utility Functions Module
 * Formatting, parsing, and helper functions
 */

// Formatting rules for different input types
const formattingRules = {
    '#inflation': { decimals: 2, thousands: true },
    '#estimated-pension': { decimals: 0, thousands: true },
    '#withdrawal-rate': { decimals: 2, thousands: false },
    '#current-age': { decimals: 0, thousands: false },
    '#pension-age': { decimals: 0, thousands: false },
    '#early-retirement-age': { decimals: 0, thousands: false },
    '.category-value': { decimals: 0, thousands: true },
    '.category-return': { decimals: 2, thousands: true },
    '.category-tax': { decimals: 2, thousands: false },
    '.category-interest-rate': { decimals: 2, thousands: false },
    '.category-start-year': { decimals: 0, thousands: false },
    '.category-end-year': { decimals: 0, thousands: false },
    '.category-withdrawal-order': { decimals: 0, thousands: false },
    '.allocation-start-year': { decimals: 0, thousands: false },
    '.allocation-asset': { decimals: 0, thousands: false },
};

function parseFormattedNumber(value) {
    if (typeof value !== 'string' || value.trim() === '') {
        return NaN;
    }
    const sanitizedValue = value.replace(/,/g, '');
    return parseFloat(sanitizedValue);
}

function formatNumberForDisplay(value, { decimals = 0, thousands = false } = {}) {
    const num = parseFormattedNumber(String(value));
    if (isNaN(num)) return '';

    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: thousands
    });
}

function onFocusNumber(event) {
    const input = event.target;
    if (input.value) {
        input.value = String(parseFormattedNumber(input.value));
        input.select();
    }
}

function onBlurNumber(event, rules) {
    const input = event.target;
    if (input.value) {
        input.value = formatNumberForDisplay(input.value, rules);
    }
}

function applyNumberFormatting(container) {
    for (const selector in formattingRules) {
        const rules = formattingRules[selector];
        container.querySelectorAll(selector).forEach(input => {
            if (input.dataset.formattingAttached) return;
            input.dataset.formattingAttached = 'true';

            input.addEventListener('focus', onFocusNumber);
            input.addEventListener('blur', (e) => onBlurNumber(e, rules));
        });
    }
}

function getFormattingRules() {
    return formattingRules;
}

// Export for use in other modules
window.SquirrelPlanUtils = {
    formattingRules,
    parseFormattedNumber,
    formatNumberForDisplay,
    onFocusNumber,
    onBlurNumber,
    applyNumberFormatting,
    getFormattingRules
};
