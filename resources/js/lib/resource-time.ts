export function formatRelativeTime(now: Date, targetDate: Date): string {
    const diffMs = now.getTime() - targetDate.getTime();

    if (diffMs <= 0) {
        return '刚刚';
    }

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diffMs < hour) {
        return `${Math.max(1, Math.floor(diffMs / minute))} 分钟前`;
    }

    if (diffMs < day) {
        return `${Math.floor(diffMs / hour)} 小时前`;
    }

    if (diffMs < month) {
        return `${Math.floor(diffMs / day)} 天前`;
    }

    if (diffMs < year) {
        return `${Math.floor(diffMs / month)} 个月前`;
    }

    return `${Math.floor(diffMs / year)} 年前`;
}

export function formatResourceRelativeTime(dateString: string): string {
    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return formatRelativeTime(new Date(), parsedDate);
}
