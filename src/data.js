/**
 * Data Management Module
 * Handles all data persistence and retrieval operations
 */

const APP_DATA_KEY = 'squirrelPlanData';

function getBlankPlanData() {
    return {
        currentAge: '30',
        inflation: '0.025',
        pensionAge: '67',
        earlyRetirementAge: '',
        estimatedPension: '1500',
        pensionFrequency: 'monthly',
        pensionType: 'social-security',
        withdrawalRate: '',
        incomes: [],
        expenses: [],
        assets: [],
        liabilities: [],
        allocationPeriods: [],
    };
}

function getInitialAppData() {
    let isNewUser = false;
    const appDataString = localStorage.getItem(APP_DATA_KEY);
    if (appDataString) {
        return { appData: JSON.parse(appDataString), isNewUser: false };
    }

    isNewUser = !localStorage.getItem('financialData') && !localStorage.getItem('hasVisited');

    const oldFinancialDataString = localStorage.getItem('financialData');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const oldTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');
    let oldLanguage = localStorage.getItem('preferredLanguage');
    const oldMonteCarloEnabled = localStorage.getItem('monteCarloEnabled') === 'true';

    if (!oldLanguage) {
        const userLang = (navigator.language || navigator.userLanguage).split('-')[0];
        const supportedLangs = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl'];
        if (supportedLangs.includes(userLang)) {
            oldLanguage = userLang;
        } else {
            oldLanguage = 'en';
        }
    }

    let plans = [];
    let activePlanName = null;

    if (oldFinancialDataString) {
        activePlanName = 'My First Plan';
        plans.push({
            name: activePlanName,
            data: JSON.parse(oldFinancialDataString),
            config: {
                monteCarloEnabled: oldMonteCarloEnabled
            }
        });
    }
    
    const newAppData = {
        settings: {
            theme: oldTheme,
            language: oldLanguage,
            activePlanName: activePlanName
        },
        plans: plans
    };

    saveAppData(newAppData);

    localStorage.removeItem('financialData');
    localStorage.removeItem('theme');
    localStorage.removeItem('preferredLanguage');
    localStorage.removeItem('monteCarloEnabled');
    localStorage.removeItem('hasVisited');
    localStorage.removeItem('autoSaveEnabled');

    return { appData: newAppData, isNewUser: isNewUser };
}

function getAppData() {
    return JSON.parse(localStorage.getItem(APP_DATA_KEY));
}

function saveAppData(data) {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}

function getActivePlan() {
    const appData = getAppData();
    if (!appData || !appData.plans) return null;
    return appData.plans.find(p => p.name === appData.settings.activePlanName);
}

// Export for use in other modules
window.SquirrelPlanData = {
    APP_DATA_KEY,
    getBlankPlanData,
    getInitialAppData,
    getAppData,
    saveAppData,
    getActivePlan
};
