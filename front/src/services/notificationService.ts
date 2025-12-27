class NotificationService {
    private notificationTime: string | null = null;
    private notificationInterval: number | null = null;

    constructor() {
        this.loadNotificationTime();
    }

    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('Ce navigateur ne supporte pas les notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    setNotificationTime(time: string): void {
        this.notificationTime = time;
        localStorage.setItem('notificationTime', time);
        this.scheduleNotification();
    }

    getNotificationTime(): string | null {
        return this.notificationTime;
    }

    clearNotification(): void {
        if (this.notificationInterval !== null) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
        this.notificationTime = null;
        localStorage.removeItem('notificationTime');
    }

    private loadNotificationTime(): void {
        const savedTime = localStorage.getItem('notificationTime');
        if (savedTime) {
            this.notificationTime = savedTime;
            this.scheduleNotification();
        }
    }

    private scheduleNotification(): void {
        if (this.notificationInterval !== null) {
            clearInterval(this.notificationInterval);
        }

        if (!this.notificationTime) {
            return;
        }

        if (Notification.permission !== 'granted') {
            return;
        }

        const scheduleNextNotification = () => {
            if (!this.notificationTime) return;

            const now = new Date();
            const [hours, minutes] = this.notificationTime.split(':').map(Number);
            const notificationDate = new Date();
            notificationDate.setHours(hours, minutes, 0, 0);

            if (notificationDate <= now) {
                notificationDate.setDate(notificationDate.getDate() + 1);
            }

            const timeUntilNotification = notificationDate.getTime() - now.getTime();

            setTimeout(() => {
                this.showNotification();
                scheduleNextNotification(); // Reprogrammer pour demain
            }, timeUntilNotification);
        };

        scheduleNextNotification();

        // Vérifier toutes les minutes pour reprogrammer si nécessaire
        this.notificationInterval = window.setInterval(() => {
            if (this.notificationTime) {
                scheduleNextNotification();
            }
        }, 60000);
    }

    private showNotification(): void {
        if (Notification.permission === 'granted') {
            new Notification('Learning Cards - Quiz du jour', {
                body: 'Il est temps de réviser vos cartes ! Cliquez pour commencer le quiz.',
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                tag: 'quiz-reminder',
                requireInteraction: false,
            });
        }
    }

    testNotification(): void {
        if (Notification.permission === 'granted') {
            this.showNotification();
        }
    }
}

export const notificationService = new NotificationService();

