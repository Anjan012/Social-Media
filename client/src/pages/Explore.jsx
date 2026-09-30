import { useMemo, useState } from "react";
import { ArrowUpRight, Search, SlidersHorizontal, Users } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { ExplorePostCard } from "../components/explore/ExplorePostCard";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

const EXPLORE_POSTS = [
    {
        id: 1,
        featured: true,
        category: "Design",
        title: "The quiet power of a well-made interface",
        excerpt: "A small collection of thoughtful details that make digital spaces feel more human and easier to return to.",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=85",
        imageAlt: "A designer working at a desk",
        author: { name: "Maya Rodriguez", handle: "@maya", initials: "MR" },
        time: "2h",
        likes: 128,
        comments: 24,
    },
    {
        id: 2,
        category: "Travel",
        title: "A slower weekend in Lisbon",
        excerpt: "Three neighborhoods, one good book, and no reason to check the time.",
        image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=85",
        imageAlt: "Colorful buildings in Lisbon",
        author: { name: "Noah Williams", handle: "@noahw", initials: "NW" },
        time: "4h",
        likes: 86,
        comments: 12,
    },
    {
        id: 3,
        category: "Culture",
        title: "What we keep when we move cities",
        excerpt: "Notes on belonging, old photographs, and the objects that quietly follow us home.",
        image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900&q=85",
        imageAlt: "A warm, modern room with artwork",
        author: { name: "Sofia Chen", handle: "@sofiachen", initials: "SC" },
        time: "6h",
        likes: 64,
        comments: 18,
    },
    {
        id: 4,
        category: "Food",
        title: "Sunday sauce, made without a recipe",
        excerpt: "The best meals leave room for instinct. This one starts with tomatoes and ends whenever it feels right.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=85",
        imageAlt: "Fresh pasta in a bowl",
        author: { name: "Oliver Brown", handle: "@oliverb", initials: "OB" },
        time: "1d",
        likes: 42,
        comments: 9,
    },
    {
        id: 5,
        category: "Ideas",
        title: "Make room for the unfinished thought",
        excerpt: "A reminder that not every idea needs to arrive polished before it deserves attention.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=85",
        imageAlt: "Notebook and coffee on a desk",
        author: { name: "Ava Thompson", handle: "@avathinks", initials: "AT" },
        time: "1d",
        likes: 91,
        comments: 31,
    },
];

const TOPICS = ["For you", "Design", "Travel", "Culture", "Food", "Ideas"];

export const Explore = () => {
    const [query, setQuery] = useState("");
    const [activeTopic, setActiveTopic] = useState("For you");
    const [sortOrder, setSortOrder] = useState("Featured");
    const [savedPosts, setSavedPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const filteredPosts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchingPosts = EXPLORE_POSTS.filter((post) => {
            const matchesTopic = activeTopic === "For you" || post.category === activeTopic;
            const matchesQuery = !normalizedQuery || `${post.title} ${post.excerpt} ${post.author.name} ${post.category}`.toLowerCase().includes(normalizedQuery);
            return matchesTopic && matchesQuery;
        });

        if (sortOrder === "Popular") {
            return [...matchingPosts].sort((a, b) => b.likes - a.likes);
        }
        return matchingPosts;
    }, [activeTopic, query, sortOrder]);

    const toggleItem = (setter, id) => {
        setter((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
    };

    return (
        <AppLayout showRightSidebar={false}>
            <section className="mx-auto w-full max-w-5xl pb-6">
                <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                        <label className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search explore"
                                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-red-500 dark:focus:bg-gray-800"
                            />
                        </label>
                        <select
                            value={activeTopic}
                            onChange={(event) => setActiveTopic(event.target.value)}
                            aria-label="Filter by topic"
                            className="hidden h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 sm:block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                            {TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
                        </select>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" aria-label="Open explore filters" className="size-10 shrink-0">
                                    <SlidersHorizontal className="size-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Filter explore</DialogTitle>
                                    <DialogDescription>Choose what you want to see first.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-2">
                                    <label className="grid gap-2 text-sm font-medium">
                                        Topic
                                        <select value={activeTopic} onChange={(event) => setActiveTopic(event.target.value)} className="h-10 rounded-md border border-gray-200 bg-background px-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-gray-700">
                                            {TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
                                        </select>
                                    </label>
                                    <label className="grid gap-2 text-sm font-medium">
                                        Sort by
                                        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="h-10 rounded-md border border-gray-200 bg-background px-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-gray-700">
                                            <option>Featured</option>
                                            <option>Popular</option>
                                        </select>
                                    </label>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button>Apply filters</Button></DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="sticky top-14 z-20 mx-0 border-b border-gray-200 bg-gray-50/95 px-1 py-3 backdrop-blur sm:top-16 dark:border-gray-800 dark:bg-gray-950/95">
                    <div className="flex items-center justify-between gap-3">
                        <nav className="flex min-w-0 gap-1 overflow-x-auto" aria-label="Explore topics">
                            {TOPICS.map((topic) => (
                                <button key={topic} type="button" onClick={() => setActiveTopic(topic)} className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${activeTopic === topic ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "text-gray-500 hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"}`}>
                                    {topic}
                                </button>
                            ))}
                        </nav>
                        <span className="hidden shrink-0 text-xs font-medium text-gray-400 sm:block">{sortOrder}</span>
                    </div>
                </div>

                <div className="mb-5 mt-6 flex items-center justify-between px-1">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Curated for you</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{filteredPosts.length} stories to explore</p>
                    </div>
                    <button type="button" className="hidden items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 sm:flex">See people <Users className="size-4" /></button>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                        {filteredPosts.map((post) => (
                            <ExplorePostCard
                                key={post.id}
                                post={post}
                                isSaved={savedPosts.includes(post.id)}
                                isLiked={likedPosts.includes(post.id)}
                                onSave={() => toggleItem(setSavedPosts, post.id)}
                                onLike={() => toggleItem(setLikedPosts, post.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center dark:border-gray-700 dark:bg-gray-900">
                        <Search className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
                        <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">Nothing matched that search</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try a different word or browse another topic.</p>
                        <button type="button" onClick={() => { setQuery(""); setActiveTopic("For you"); }} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600">Clear filters <ArrowUpRight className="size-4" /></button>
                    </div>
                )}
            </section>
        </AppLayout>
    );
};