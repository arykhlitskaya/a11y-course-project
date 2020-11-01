import { initTabs } from './tabs';
import { initModals } from './modal';
import { initForms } from './forms';

class App {
    constructor() {}
    init() {
        initModals();
        initTabs();
        initForms();
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
