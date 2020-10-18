const SELECTOR_INPUT_WRAPPER = '.form-field';
const SELECTOR_INPUT = '.form-field__input';
const SELECTOR_ERROR = '.form-field__error';
const CLASS_LABEL_ABOVE = 'form-field__label--above';
const CLASS_INVALID = 'form-field--invalid';
const ID_ERROR_ALERT = 'loginFormErorr';

function handleInputChangeEvent(event) {
    const target = event.target;
    changeFloatLabelState(target);
}

function changeFloatLabelState(input) {
    const label = input.labels ? input.labels[0] : null;
    if (label) {
        const isLabelAbove = input.value || input === document.activeElement;
        isLabelAbove ? label.classList.add(CLASS_LABEL_ABOVE) : label.classList.remove(CLASS_LABEL_ABOVE);
    }
}

function validateRequiredInput(input) {
    if (!input.value) {
        setInvalidState(input);
        return false;
    }

    return true;
}

function setInvalidState(input) {
    const wrapper = input.closest(SELECTOR_INPUT_WRAPPER);
    const error = wrapper.querySelectorAll(SELECTOR_ERROR)[0];
    wrapper.classList.add(CLASS_INVALID);
    error.removeAttribute('hidden');
    input.setAttribute('aria-describedby', error.id);
    input.setAttribute('aria-invalid', true);
}

function resetInvalidState(input) {
    const wrapper = input.closest(SELECTOR_INPUT_WRAPPER);
    const error = wrapper.querySelectorAll(SELECTOR_ERROR)[0];
    wrapper.classList.remove(CLASS_INVALID);
    error.setAttribute('hidden', 'hidden');
    input.removeAttribute('aria-describedby');
    input.removeAttribute('aria-invalid');
}

function initInputs() {
    const inputs = document.querySelectorAll(SELECTOR_INPUT);
    [...inputs].forEach((input) => {
        input.addEventListener('change', handleInputChangeEvent);
    });
}

function initLoginForm() {
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const inputs = loginForm.querySelectorAll(SELECTOR_INPUT);

    function addEventListeners() {
        loginModal.addEventListener('modal.close', (e) => resetFormInvalidState());
        loginForm.addEventListener('submit', submitForm);

        [...inputs].forEach((input) => {
            input.addEventListener('keyup', (e) => {
                e.target.value && resetInvalidState(e.target);
            });
        });
    }

    function submitForm(event) {
        removeErrorAlert();
        const isFormValid = validateForm();

        if (isFormValid) {
            loginModal.querySelector('[data-close-modal]').click();
        } else {
            event.preventDefault();
            const invalidFields = loginForm.querySelectorAll('[aria-invalid]');
            createErrorAlert(invalidFields.length);
            // invalidFields[0].focus();
        }
    }

    function validateForm() {
        let isFormValid = true;
        [...inputs].forEach((input) => {
            const isValid = validateRequiredInput(input);
            !isValid && (isFormValid = false);
        });

        return isFormValid;
    }

    function createErrorAlert(numOfInvalidFields) {
        if (!document.getElementById(ID_ERROR_ALERT)) {
            const alert = document.createElement('div');
            alert.setAttribute('id', ID_ERROR_ALERT);
            alert.setAttribute('role', 'alert');
            alert.setAttribute('tabIndex', '-1');
            alert.classList.add('visually-hidden');
            alert.innerHTML = `Форма не была отправлена. Найдено ${numOfInvalidFields} ошибок.`;
            loginForm.appendChild(alert);
        }
    }

    function removeErrorAlert() {
        const alert = document.getElementById(ID_ERROR_ALERT);
        if (alert) {
            alert.remove();
        }
    }

    function resetFormInvalidState() {
        [...inputs].forEach((input) => {
            resetInvalidState(input);
        });
        removeErrorAlert();
    }

    addEventListeners();
}

export const initForms = () => {
    initInputs();
    initLoginForm();
};
