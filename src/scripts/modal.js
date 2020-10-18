import { createFocusTrap } from 'focus-trap';
import { setFocusOnFirstDescendant } from './utils/focus';
import { KEY_CODE } from './utils/keys';

const BODY_OPEN_CLASS = 'has-modal';
const MODAL_OPEN_CLASS = 'modal--open';
const DATA_MODAL_TOGGLE = 'data-toggle-modal';
const DATA_MODAL_CLOSE = 'data-close-modal';

const EVENT_CLOSE = 'modal.close';
const EVENT_OPEN = 'modal.open';

let activeModal = null;

// this.eventClose = new Event(EVENT_CLOSE);
// this.eventOpen = new Event(EVENT_OPEN);

export class Modal {
    constructor(modalID, toggles) {
        this.modal = document.getElementById(modalID);
        this.focusTrap = createFocusTrap(this.modal);

        if (toggles && toggles.length > 0) {
            this.initToggles(toggles);
        }

        this.eventClose = new Event(EVENT_CLOSE);
        this.eventOpen = new Event(EVENT_OPEN);
    }

    initToggles(toggles) {
        [...toggles].filter(Boolean).forEach((toggle) => {
            toggle.addEventListener('click', (event) => this.showModal(event));
        });
    }

    showModal(event) {
        activeModal = this;
        this.activeElement = document.activeElement;
        this.modal.classList.add(MODAL_OPEN_CLASS);
        document.body.classList.add(BODY_OPEN_CLASS);
        setFocusOnFirstDescendant(this.modal);
        this.focusTrap.activate();
        this.hideAllContentForScreenReaders();
        this.addEventListeners();
        this.modal.dispatchEvent(this.eventOpen);
    }

    closeModal(event) {
        activeModal.removeEventListeners();
        document.body.classList.remove(BODY_OPEN_CLASS);
        activeModal.modal.classList.remove(MODAL_OPEN_CLASS);
        activeModal.focusTrap.deactivate();
        this.showAllContentForScreenReaders();
        if (activeModal.activeElement && activeModal.activeElement.focus) {
            activeModal.activeElement.focus();
        }
        activeModal.modal.dispatchEvent(activeModal.eventClose);
        activeModal = null;
    }

    addEventListeners() {
        this.modal.addEventListener('touchstart', this.handleModalClick);
        this.modal.addEventListener('click', this.handleModalClick);
        document.addEventListener('keyup', this.handleDocumentKeyUpEvent);
    }

    removeEventListeners() {
        this.modal.removeEventListener('touchstart', this.handleModalClick);
        this.modal.removeEventListener('click', this.handleModalClick);
        document.removeEventListener('keydown', this.handleDocumentKeyUpEvent);
    }

    handleDocumentKeyUpEvent(event) {
        if (event.keyCode === KEY_CODE.ESC) {
            event.stopPropagation();
            activeModal.closeModal(event);
        }
    }

    handleModalClick(event) {
        const closeAttr = `[${DATA_MODAL_CLOSE}]`;
        if (event.target.hasAttribute(closeAttr) || event.target.closest(closeAttr)) {
            activeModal.closeModal(event);
        }
    }

    hideAllContentForScreenReaders() {
        [...document.body.children].forEach((child) => {
            if (child !== this.modal) {
                child.setAttribute('aria-hidden', true);
            }
        });
    }

    showAllContentForScreenReaders() {
        [...document.body.children].forEach((child) => {
            if (child !== this.modal) {
                child.removeAttribute('aria-hidden');
            }
        });
    }
}

const generateModalsTogglesMap = (toggles) => {
    const map = [];

    toggles.forEach((toggle) => {
        const modalID = toggle.getAttribute(DATA_MODAL_TOGGLE);
        if (map[modalID] === undefined) map[modalID] = [];
        map[modalID].push(toggle);
    });

    return map;
};

export const initModals = () => {
    const toggles = document.querySelectorAll(`[${DATA_MODAL_TOGGLE}]`);
    const modalsTogglesMap = generateModalsTogglesMap(toggles);

    Object.keys(modalsTogglesMap).forEach((modalID) => {
        const toggles = modalsTogglesMap[modalID];
        new Modal(modalID, toggles);
    });
};
