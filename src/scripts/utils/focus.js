export const setFocusOnFirstDescendant = (element) => {
    for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (tryToSetFocus(child) || setFocusOnFirstDescendant(child)) {
            return true;
        }
    }
    return false;
};

export const setFocusOnLastDescendant = (element) => {
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
        let child = element.childNodes[i];
        if (tryToSetFocus(child) || setFocusOnLastDescendant(child)) {
            return true;
        }
    }
    return false;
};

export const tryToSetFocus = function (element) {
    if (!isFocusable(element)) {
        return false;
    }

    try {
        element.focus();
    } catch (e) {}
    return document.activeElement === element;
};

export const isFocusable = function (element) {
    if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }

    if (element.disabled) {
        return false;
    }

    switch (element.nodeName) {
        case 'A':
            return !!element.href && element.rel != 'ignore';
        case 'INPUT':
            return element.type != 'hidden' && element.type != 'file';
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
            return true;
        default:
            return false;
    }
};
