/**
 * Event Handler Setup Module
 * Basic event handler registration utilities
 */

function delegateEvent(parentSelector, eventType, childSelector, handler) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    
    parent.addEventListener(eventType, function(e) {
        const target = e.target.closest(childSelector);
        if (target) {
            handler.call(target, e);
        }
    });
}

function onClick(selector, handler) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('click', handler);
    });
}

function onChange(selector, handler) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('change', handler);
    });
}

function onInput(selector, handler) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('input', handler);
    });
}

function onSubmit(selector, handler) {
    const form = document.querySelector(selector);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handler.call(this, e);
        });
    }
}

function once(selector, eventType, handler) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener(eventType, function(e) {
            el.removeEventListener(eventType, handler);
            handler.call(this, e);
        });
    });
}

// Export for use in other modules
window.SquirrelPlanEvents = {
    delegateEvent,
    onClick,
    onChange,
    onInput,
    onSubmit,
    once
};
