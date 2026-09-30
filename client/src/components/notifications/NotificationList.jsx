import { NotificationItem } from "./NotificationItem";

export const NotificationList = ({ notifications, onRead }) => {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center sm:py-24">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-300">
                    <span className="text-2xl">&#10003;</span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">You&apos;re all caught up</h2>
                <p className="mt-1 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">
                    New activity from your community will show up here.
                </p>
            </div>
        );
    }

    return (
        <div>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={() => onRead(notification.id)}
                />
            ))}
        </div>
    );
};