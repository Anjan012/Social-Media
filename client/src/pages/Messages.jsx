import { useMemo, useState } from "react";
import { Phone, Video } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ConversationList } from "../components/messages/ConversationList";
import { MessageThread } from "../components/messages/MessageThread";

const INITIAL_CONVERSATIONS = [
    { id: "maya", name: "Maya Rodriguez", initials: "MR", time: "9:42 AM", preview: "That interface feels so considered.", online: true, unread: true, avatar: "" },
    { id: "noah", name: "Noah Williams", initials: "NW", time: "Yesterday", preview: "Sent you a photo", online: false, unread: false, avatar: "" },
    { id: "sofia", name: "Sofia Chen", initials: "SC", time: "Mon", preview: "Let’s catch up this week.", online: true, unread: false, avatar: "" },
    { id: "studio", name: "The Studio", initials: "TS", time: "Sun", preview: "Oliver: The new draft is ready", online: false, unread: true, avatar: "" },
];

const INITIAL_MESSAGES = {
    maya: [
        { id: 1, text: "I keep coming back to your post about quiet interfaces.", time: "9:31 AM", fromMe: false },
        { id: 2, text: "Same. I think the best details are the ones you notice after using something for a while.", time: "9:36 AM", fromMe: true, read: true },
        { id: 3, text: "Exactly. That interface feels so considered. The spacing especially.", time: "9:42 AM", fromMe: false },
    ],
    noah: [
        { id: 1, text: "Here’s that photo from the weekend.", time: "Yesterday", fromMe: false },
        { id: 2, text: "This is beautiful. Adding it to my list for next time.", time: "Yesterday", fromMe: true, read: true },
    ],
    sofia: [{ id: 1, text: "Let’s catch up this week. I want to hear about the new project.", time: "Mon", fromMe: false }],
    studio: [{ id: 1, text: "The new draft is ready for a first pass when you have time.", time: "Sun", fromMe: false }],
};

export const Messages = () => {
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [selectedId, setSelectedId] = useState("maya");
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");
    const [callType, setCallType] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [mobileThreadOpen, setMobileThreadOpen] = useState(false);

    const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || conversations[0];
    const visibleConversations = useMemo(() => conversations.filter((conversation) => conversation.name.toLowerCase().includes(search.trim().toLowerCase())), [conversations, search]);

    const selectConversation = (id) => {
        setSelectedId(id);
        setMobileThreadOpen(true);
        setConversations((current) => current.map((conversation) => conversation.id === id ? { ...conversation, unread: false } : conversation));
    };

    const sendMessage = (event) => {
        event.preventDefault();
        const text = draft.trim();
        if (!text) return;
        setMessages((current) => ({ ...current, [selectedId]: [...(current[selectedId] || []), { id: Date.now(), text, time: "Just now", fromMe: true, read: false }] }));
        setDraft("");
    };

    return (
        <AppLayout showRightSidebar={false}>
            <section className="mx-auto flex h-[calc(100vh-7rem)] min-h-[560px] w-full max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className={`w-full md:flex md:w-auto ${mobileThreadOpen ? "hidden" : "flex"}`}>
                    <ConversationList conversations={visibleConversations} selectedId={selectedId} search={search} onSearch={setSearch} onSelect={selectConversation} />
                </div>
                <div className={`min-w-0 flex-1 ${mobileThreadOpen ? "flex" : "hidden md:flex"}`}>
                    {selectedConversation && <MessageThread conversation={selectedConversation} messages={messages[selectedId] || []} draft={draft} onDraftChange={setDraft} onSend={sendMessage} onBack={() => setMobileThreadOpen(false)} onCall={setCallType} onToggleDetails={() => setShowDetails((current) => !current)} showDetails={showDetails} />}
                </div>
                {showDetails && <aside className="hidden w-60 shrink-0 border-l border-gray-200 p-5 lg:block dark:border-gray-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Conversation</p>
                    <div className="mt-5 flex flex-col items-center text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-700 dark:bg-red-950 dark:text-red-200">{selectedConversation.initials}</div>
                        <h2 className="mt-3 font-semibold text-gray-900 dark:text-white">{selectedConversation.name}</h2>
                        <p className="mt-1 text-xs text-gray-500">{selectedConversation.online ? "Active now" : "Offline"}</p>
                    </div>
                    <div className="mt-8 grid gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCallType("audio")}><Phone /> Audio call</Button>
                        <Button variant="outline" size="sm" onClick={() => setCallType("video")}><Video /> Video call</Button>
                    </div>
                </aside>}
            </section>

            <Dialog open={Boolean(callType)} onOpenChange={(open) => !open && setCallType(null)}>
                <DialogContent className="max-w-sm text-center">
                    <DialogHeader className="items-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/50"><span className="animate-pulse">{callType === "video" ? <Video className="size-7" /> : <Phone className="size-7" />}</span></div>
                        <DialogTitle>{callType === "video" ? "Video call" : "Audio call"} with {selectedConversation.name}</DialogTitle>
                        <DialogDescription>This is ready to connect when calling is enabled on the server.</DialogDescription>
                    </DialogHeader>
                    <Button variant="destructive" onClick={() => setCallType(null)}>End call</Button>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};