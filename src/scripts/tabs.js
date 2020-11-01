import { KEY_CODE } from './utils/keys';

const SELECTOR_TAB = '[role="tab"]';
const SELECTOR_TABS_CONTAINER = '.tabs';
const SELECTOR_TAB_PANEL = '[role="tabpanel"]';
const SELECTOR_TAB_LIST = '[role="tablist"]';
const CLASS_TAB_ACTIVE = 'active';

const Tabs = (tabContainer) => {
    let tablist = tabContainer.querySelectorAll(SELECTOR_TAB_LIST)[0];
    let tabs = tabContainer.querySelectorAll(SELECTOR_TAB);
    let panels = tabContainer.querySelectorAll(SELECTOR_TAB_PANEL);
    let isVerticalOrientation = tablist.getAttribute('aria-orientation') === 'vertical';

    // Bind listeners
    for (let i = 0; i < tabs.length; ++i) {
        addListeners(i);
    }

    function addListeners(index) {
        tabs[index].addEventListener('click', clickEventListener);
        tabs[index].addEventListener('keydown', keydownEventListener);
        tabs[index].addEventListener('keyup', keyupEventListener);
        tabs[index].index = index;
    }

    // When a tab is clicked, activateTab is fired to activate it
    function clickEventListener(event) {
        let tab = event.target;
        activateTab(tab, false);
    }

    // Handle keydown on tabs
    function keydownEventListener(event) {
        switch (event.keyCode) {
            case KEY_CODE.END:
                event.preventDefault();
                activateTab(tabs[tabs.length - 1]);
                break;
            case KEY_CODE.HOME:
                event.preventDefault();
                activateTab(tabs[0]);
                break;

            // Up and down are in keydown
            // because we need to prevent page scroll >:)
            case KEY_CODE.UP:
            case KEY_CODE.DOWN:
                determineOrientation(event);
                break;
        }
    }

    // Handle keyup on tabs
    function keyupEventListener(event) {
        switch (event.keyCode) {
            case KEY_CODE.LEFT:
            case KEY_CODE.RIGHT:
                determineOrientation(event);
                break;
        }
    }

    // When a tablistâ€™s aria-orientation is set to vertical,
    // only up and down arrow should function.
    // In all other cases only left and right arrow function.
    function determineOrientation(event) {
        let key = event.keyCode;

        if (isVerticalOrientation && (key === KEY_CODE.UP || key === KEY_CODE.DOWN)) {
            event.preventDefault();
            switchTabOnArrowPress(event);
        } else if (!isVerticalOrientation && (key === KEY_CODE.LEFT || key === KEY_CODE.RIGHT)) {
            switchTabOnArrowPress(event);
        }
    }

    // Either focus the next, previous, first, or last tab
    // depening on key pressed
    function switchTabOnArrowPress(event) {
        const pressed = event.keyCode;
        const target = event.target;

        for (let x = 0; x < tabs.length; x++) {
            tabs[x].addEventListener('focus', focusEventHandler);
        }

        const direction =
            pressed === KEY_CODE.UP || pressed === KEY_CODE.LEFT
                ? -1
                : pressed === KEY_CODE.DOWN || pressed === KEY_CODE.RIGHT
                ? 1
                : 0;

        if (direction !== 0 && target.index !== undefined) {
            const newIndex = target.index + direction;
            const activeIndex = newIndex < 0 ? tabs.length - 1 : newIndex < tabs.length ? newIndex : 0;
            tabs[activeIndex].focus();
        }
    }

    // Activates any given tab panel
    function activateTab(tab, setFocus) {
        setFocus = setFocus || true;
        // Deactivate all other tabs
        deactivateTabs();

        tab.removeAttribute('tabindex');
        tab.setAttribute('aria-selected', 'true');
        tab.classList.add(CLASS_TAB_ACTIVE);

        const panelId = tab.getAttribute('aria-controls');
        document.getElementById(panelId).removeAttribute('hidden');

        // Set focus when required
        if (setFocus) {
            tab.focus();
        }
    }

    // Deactivate all tabs and tab panels
    function deactivateTabs() {
        [...tabs].forEach((tab) => {
            tab.setAttribute('tabindex', '-1');
            tab.setAttribute('aria-selected', 'false');
            tab.classList.remove(CLASS_TAB_ACTIVE);
            tab.removeEventListener('focus', focusEventHandler);
        });

        [...panels].forEach((panel) => {
            panel.setAttribute('hidden', 'hidden');
        });
    }

    function focusEventHandler(event) {
        let target = event.target;
        activateTab(target, false);
    }
};

export const initTabs = () => {
    const tabs = document.querySelectorAll(SELECTOR_TABS_CONTAINER);
    [...tabs].forEach((tabConatiner) => {
        Tabs(tabConatiner);
    });
};
