/**
 * Validation Module
 * Input validation and error handling functions
 */

function validateInputs() {
    const errors = [];
    
    const currentAgeInput = document.getElementById('current-age');
    const pensionAgeInput = document.getElementById('pension-age');
    const currentAge = parseFormattedNumber(currentAgeInput.value);
    const pensionAge = parseFormattedNumber(pensionAgeInput.value);

    if (!isNaN(currentAge) && !isNaN(pensionAge) && pensionAge < currentAge && pensionAge < 18) {
        errors.push(getTranslation('retirementAgeBeforeCurrentAgeError'));
        [currentAgeInput, pensionAgeInput].forEach(input => {
            input.classList.add('is-invalid');
            input.addEventListener('input', clearValidation, { once: true });
        });
    }

    const incomeCategoriesContainer = document.getElementById('income-categories-container');
    const expenseCategoriesContainer = document.getElementById('expense-categories-container');
    
    const startYearInputs = document.querySelectorAll('.allocation-start-year');
    startYearInputs.forEach(input => {
        const startYear = parseFormattedNumber(input.value);
        const endYearInput = input.closest('.allocation-row').querySelector('.allocation-end-year');
        const endYear = parseFormattedNumber(endYearInput?.value);
        
        if (!isNaN(startYear) && !isNaN(endYear) && endYear < startYear) {
            errors.push(getTranslation('endYearBeforeStartYearError'));
            input.classList.add('is-invalid');
            endYearInput.classList.add('is-invalid');
            [input, endYearInput].forEach(el => {
                el.addEventListener('input', clearValidation, { once: true });
            });
        }
    });

    return [...new Set(errors)];
}

function clearValidation(event) {
    event.target.classList.remove('is-invalid');
}

function validateAndHighlight(errorKey, inputs) {
    const errorMessage = getTranslation(errorKey);
    if (errorMessage) {
        inputs.forEach(input => {
            input.classList.add('is-invalid');
            input.setCustomValidity(errorMessage);
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                input.setCustomValidity('');
            }, { once: true });
        });
        return true;
    }
    return false;
}

// Export for use in other modules
window.SquirrelPlanValidation = {
    validateInputs,
    clearValidation,
    validateAndHighlight
};
