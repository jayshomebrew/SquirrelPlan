/**
 * UI Helper Functions Module
 * Basic UI manipulation and helper functions
 */

function showElement(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.style.display = '';
}

function hideElement(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.style.display = 'none';
}

function toggleElement(selector, show) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.style.display = show ? '' : 'none';
}

function setElementText(selector, text) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.textContent = text;
}

function setElementHTML(selector, html) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.innerHTML = html;
}

function addClass(selector, className) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.classList.add(className);
}

function removeClass(selector, className) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.classList.remove(className);
}

function toggleClass(selector, className, force) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.classList.toggle(className, force);
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    const section = document.getElementById(sectionId);
    if (section) section.style.display = '';
}

function updateSectionTitle(sectionId, title) {
    const section = document.querySelector(`#${sectionId} h3`);
    if (section) section.textContent = title;
}

// Theme management
function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
}

function getCurrentTheme() {
    return document.documentElement.getAttribute('data-bs-theme') || 'light';
}

// Export for use in other modules
window.SquirrelPlanUI = {
    showElement,
    hideElement,
    toggleElement,
    setElementText,
    setElementHTML,
    addClass,
    removeClass,
    toggleClass,
    showSection,
    updateSectionTitle,
    applyTheme,
    getCurrentTheme
};
