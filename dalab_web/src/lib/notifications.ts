import { prisma } from './prisma';
import { NotificationType } from '@prisma/client';

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.ORDER_STATUS
) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                read: false
            }
        });
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
}
