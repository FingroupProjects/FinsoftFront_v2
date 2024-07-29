export function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15);
}

export function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
