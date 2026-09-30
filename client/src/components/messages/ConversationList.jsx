import { Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";

export const ConversationList = ({ conversations, selectedId, search, onSearch, onSelect }) => (
    <aside className="flex min-h-0 w-full flex-col border-gray-200 bg-white md:w-[300px] md:shrink-0 md:border-r dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-4 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">Messages</h1>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Stay in the conversation.</p>
                </div>
                <button type="button" aria-label="Start a group message" className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30">
                    <Users className="size-4" />
                </button>
            </div>
            <label className="relative mt-4 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search messages" className="h-9 bg-gray-50 pl-9 text-sm dark:bg-gray-800" />
            </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No conversations found.</p>
            ) : conversations.map((conversation) => (
                <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selectedId === conversation.id ? "bg-red-50 dark:bg-red-950/25" : "hover:bg-gray-50 dark:hover:bg-gray-800/70"}`}
                >
                    <div className="relative shrink-0">
                        <Avatar className="size-11">
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback className="bg-red-100 font-semibold text-red-700 dark:bg-red-950 dark:text-red-200">{conversation.initials}</AvatarFallback>
                        </Avatar>
                        {conversation.online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className={`truncate text-sm ${conversation.unread ? "font-bold text-gray-950 dark:text-white" : "font-semibold text-gray-800 dark:text-gray-200"}`}>{conversation.name}</p>
                            <span className="shrink-0 text-[10px] text-gray-400">{conversation.time}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                            <p className={`truncate text-xs ${conversation.unread ? "font-medium text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>{conversation.preview}</p>
                            {conversation.unread && <span className="size-2 shrink-0 rounded-full bg-red-500" />}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </aside>
);