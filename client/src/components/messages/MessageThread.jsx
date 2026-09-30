import { ArrowLeft, MoreHorizontal, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export const MessageThread = ({ conversation, messages, draft, onDraftChange, onSend, onBack, onCall, onToggleDetails, showDetails }) => (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white dark:bg-gray-900">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 dark:border-gray-800">
            <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={onBack} aria-label="Back to conversations" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800">
                    <ArrowLeft className="size-4" />
                </button>
                <button type="button" onClick={onToggleDetails} className="flex min-w-0 items-center gap-3 text-left">
                    <div className="relative shrink-0">
                        <Avatar className="size-10">
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback className="bg-red-100 font-semibold text-red-700 dark:bg-red-950 dark:text-red-200">{conversation.initials}</AvatarFallback>
                        </Avatar>
                        {conversation.online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-950 dark:text-white">{conversation.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.online ? "Active now" : "Last seen recently"}</p>
                    </div>
                </button>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => onCall("audio")} aria-label="Start audio call" className="text-gray-500 hover:bg-red-50 hover:text-red-500"><Phone className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onCall("video")} aria-label="Start video call" className="text-gray-500 hover:bg-red-50 hover:text-red-500"><Video className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onToggleDetails} aria-label="More conversation details" className={`hidden text-gray-500 hover:bg-red-50 hover:text-red-500 sm:inline-flex ${showDetails ? "bg-red-50 text-red-500 dark:bg-red-950/30" : ""}`}><MoreHorizontal className="size-4" /></Button>
            </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
                <div className="py-2 text-center text-[11px] font-medium uppercase tracking-wider text-gray-400">Today</div>
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[82%] sm:max-w-[70%] ${message.fromMe ? "items-end" : "items-start"} flex flex-col`}>
                            <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.fromMe ? "rounded-br-md bg-red-500 text-white" : "rounded-bl-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}>
                                {message.text}
                            </div>
                            <span className="mt-1 px-1 text-[10px] text-gray-400">{message.time}{message.fromMe && message.read ? " · Read" : ""}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <form onSubmit={onSend} className="shrink-0 border-t border-gray-200 p-3 sm:p-4 dark:border-gray-800">
            <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-500/10 dark:border-gray-700 dark:bg-gray-800">
                <input value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder={`Message ${conversation.name.split(" ")[0]}`} className="min-w-0 flex-1 bg-transparent px-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white" />
                <Button type="submit" size="sm" disabled={!draft.trim()} className="bg-red-500 text-white hover:bg-red-600">Send</Button>
            </div>
        </form>
    </section>
);