import { useMemo, useState } from "react";
import { CheckCheck, ChevronDown, Settings2 } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import { NotificationList } from "../components/notifications/NotificationList";

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: "like",
        actor: { id: "maya", name: "Maya Rodriguez", initials: "MR" },
        message: "liked your photo",
        time: "12 minutes ago",
        isRead: false,
        preview: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=120&q=80",
    },
    {
        id: 2,
        type: "comment",
        actor: { id: "noah", name: "Noah Williams", initials: "NW" },
        message: "commented on your post: \"This is such a good reminder.\"",
        time: "38 minutes ago",
        isRead: false,
    },
    {
        id: 3,
        type: "follow",
        actor: { id: "sofia", name: "Sofia Chen", initials: "SC" },
        message: "started following you",
        time: "2 hours ago",
        isRead: false,
    },
    {
        id: 4,
        type: "mention",
        actor: { id: "oliver", name: "Oliver Brown", initials: "OB" },
        message: "mentioned you in a conversation",
        time: "Yesterday",
        isRead: true,
    },
    {
        id: 5,
        type: "like",
        actor: { id: "ava", name: "Ava Thompson", initials: "AT" },
        message: "and 4 others liked your post",
        time: "Yesterday",
        isRead: true,
        preview: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=120&q=80",
    },
    {
        id: 6,
        type: "follow",
        actor: { id: "liam", name: "Liam Wilson", initials: "LW" },
        message: "started following you",
        time: "2 days ago",
        isRead: true,
    },
];

const FILTERS = [
    { id: "all", label: "All activity" },
    { id: "unread", label: "Unread" },
    { id: "mentions", label: "Mentions" },
];

export const Notifications = () => {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState("all");

    const unreadCount = notifications.filter((notification) => !notification.isRead).length;
    const filteredNotifications = useMemo(() => {
        if (activeFilter === "unread") {
            return notifications.filter((notification) => !notification.isRead);
        }
        if (activeFilter === "mentions") {
            return notifications.filter((notification) => notification.type === "mention");
        }
        return notifications;
    }, [activeFilter, notifications]);

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id ? { ...notification, isRead: true } : notification,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
    };

    return (
        <AppLayout>
            <section className="mx-auto w-full max-w-3xl pb-4">
                <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 sm:py-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">Your activity</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">Notifications</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Stay close to what&apos;s happening around you.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Notification settings"
                            className="text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                            <Settings2 className="size-5" />
                        </Button>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                        <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${activeFilter === filter.id
                                            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        }`}
                                >
                                    {filter.label}
                                    {filter.id === "unread" && unreadCount > 0 && (
                                        <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-600 dark:bg-red-950 dark:text-red-300">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="shrink-0 px-2 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 sm:px-3 sm:text-sm dark:hover:bg-red-950/30"
                        >
                            <CheckCheck className="size-4" />
                            <span className="hidden sm:inline">Mark all read</span>
                        </Button>
                    </div>
                </header>

                <div className="mt-3 overflow-hidden border-y border-gray-200 bg-white shadow-sm sm:rounded-xl sm:border dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 dark:border-gray-800">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {activeFilter === "all" ? "Recent" : FILTERS.find((filter) => filter.id === activeFilter)?.label}
                        </p>
                        <button type="button" className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 dark:text-gray-400">
                            Newest <ChevronDown className="size-3.5" />
                        </button>
                    </div>
                    <NotificationList notifications={filteredNotifications} onRead={markAsRead} />
                </div>
            </section>
        </AppLayout>
    );
};