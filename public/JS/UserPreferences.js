const STORAGE_KEY = "wulirocks.userPreferences";

const defaultPreferences = {
    sheetAutoSave: false
};


export function loadUserPreferences() {

    const stored =
        localStorage.getItem(STORAGE_KEY);

    if (!stored) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultPreferences)
        );

        return { ...defaultPreferences };
    }

    try {

        const preferences =
            JSON.parse(stored);

        return {
            ...defaultPreferences,
            ...preferences
        };

    } catch (error) {

        console.warn(
            "Invalid user preferences. Resetting.",
            error
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultPreferences)
        );

        return { ...defaultPreferences };
    }
}


export function saveUserPreferences(preferences) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(preferences)
    );
}