import { TOKEN_STORAGE_KEY } from "./const";

export function formatResponseDate(inputDateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(inputDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    return date.toLocaleDateString('fr-FR', options);
};

export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getHeader() {
    return {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
    };
}