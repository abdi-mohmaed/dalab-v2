/**
 * Calculate remaining time for a countdown timer
 */
export interface CountdownTime {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
}

export function calculateCountdown(
    countdownHours: number,
    countdownMinutes: number = 0,
    startTime?: Date
): CountdownTime {
    const now = new Date();
    const start = startTime || now;
    const totalMinutes = (countdownHours * 60) + countdownMinutes;
    const endTime = new Date(start.getTime() + totalMinutes * 60 * 1000);

    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: true
        };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours,
        minutes,
        seconds,
        totalSeconds,
        isExpired: false
    };
}

/**
 * Format countdown time as a string
 */
export function formatCountdown(time: CountdownTime): string {
    if (time.isExpired) {
        return 'Expired';
    }

    if (time.hours > 0) {
        return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
    }

    if (time.minutes > 0) {
        return `${time.minutes}m ${time.seconds}s`;
    }

    return `${time.seconds}s`;
}

/**
 * Replace template variables in urgency message
 */
export function formatUrgencyMessage(template: string, time: CountdownTime): string {
    const timeStr = formatCountdown(time);
    return template.replace(/\{\{time\}\}/g, timeStr);
}
