/**
 * Format currency value
 */
export const formatCurrency = (
    value: number,
    currency = 'VND',
    locale = 'vi-VN'
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(value);
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, locale = 'en-US'): string => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

/**
 * Truncate string with ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return `${str.slice(0, maxLength)}...`;
};

/**
 * Format product name for URL slug
 */
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Parse price range from query string
 */
export const parsePriceRange = (range: string): [number, number] | null => {
    const [min, max] = range.split('-').map(Number);
    if (Number.isNaN(min) || Number.isNaN(max)) return null;
    return [min, max];
};

/**
 * Generate discount percentage
 */
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Format number with thousand separators (no currency symbol)
 * Example: 1000000 -> "1,000,000"
 */
export const formatNumber = (
    value: number,
    locale = 'en-US'
): string => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
};

/**
 * Parse formatted number string to raw number
 * Example: "1,000,000" -> 1000000
 */
export const parseFormattedNumber = (value: string): number => {
    if (!value) return 0;

    const numeric = value.replace(/[^\d]/g, "");

    return numeric ? Number(numeric) : 0;
};

export const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatFullDateTime = (
    date: string | Date,
    locale = 'vi-VN'
): string => {
    if (!date) return '';

    return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

export const formatDateLabel = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Hôm nay";
    if (isSameDay(date, yesterday)) return "Hôm qua";

    return date.toLocaleDateString("vi-VN");
};