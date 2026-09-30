import { Link } from "react-router-dom";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const TYPE_STYLES = {
    like: {
        icon: Heart,
        iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300",
    },
    comment: {
        icon: MessageCircle,
        iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300",
    },
    follow: {
        icon: UserPlus,
        iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
    },
    mention: {
        icon: Bell,
        iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300",
    },
};

export const NotificationItem = ({ notification, onRead }) => {
    const style = TYPE_STYLES[notification.type] || TYPE_STYLES.mention;
    const Icon = style.icon;

    return (
        <article
            className={`group relative flex gap-3 border-b border-gray-100 px-4 py-4 transition-colors last:border-b-0 sm:gap-4 sm:px-6 dark:border-gray-800/80 ${notification.isRead
                    ? "bg-white dark:bg-gray-900"
                    : "bg-red-50/45 dark:bg-red-950/10"
                }`}
        >
            {!notification.isRead && (
                <span className="absolute left-1.5 top-7 h-2 w-2 rounded-full bg-red-500 sm:left-2.5" />
            )}

            <Link
                to={`/profile/${notification.actor.id}`}
                onClick={onRead}
                className="relative shrink-0"
                aria-label={`View ${notification.actor.name}'s profile`}
            >
                <Avatar className="size-11 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                    <AvatarFallback className="bg-red-100 font-semibold text-red-700 dark:bg-red-950 dark:text-red-200">
                        {notification.actor.initials}
                    </AvatarFallback>
                </Avatar>
                <span className={`absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 ${style.iconClass}`}>
                    <Icon className="size-3.5" strokeWidth={2.5} />
                </span>
            </Link>

            <button
                type="button"
                onClick={onRead}
                className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
                <p className="pr-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-gray-950 dark:text-white">{notification.actor.name}</span>{" "}
                    {notification.message}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-400 dark:text-gray-500">{notification.time}</p>
            </button>

            {notification.preview && (
                <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block dark:bg-gray-800">
                    <img src={notification.preview} alt="Post preview" className="size-full object-cover" />
                </div>
            )}
        </article>
    );
};