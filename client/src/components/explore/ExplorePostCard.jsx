import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ExplorePostCard = ({ post, isSaved, isLiked, onSave, onLike }) => (
    <article className={`group overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-lg dark:bg-gray-900 ${post.featured ? "border-gray-900 dark:border-gray-300" : "border-gray-200 dark:border-gray-800"}`}>
        <div className="relative aspect-16/10 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
                src={post.image}
                alt={post.imageAlt}
                className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                {post.featured ? (
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-900 shadow-sm backdrop-blur-sm">
                        Editor&apos;s pick
                    </span>
                ) : <span />}
                <button
                    type="button"
                    aria-label="More post options"
                    className="flex size-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/50"
                >
                    <MoreHorizontal className="size-4" />
                </button>
            </div>
        </div>

        <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar size="sm">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback className="bg-red-100 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-200">
                            {post.author.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                        <p className="truncate text-[11px] text-gray-400">{post.author.handle} · {post.time}</p>
                    </div>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {post.category}
                </span>
            </div>

            <h2 className="mt-4 line-clamp-2 text-lg font-semibold leading-6 tracking-tight text-gray-950 dark:text-white">
                {post.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{post.excerpt}</p>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                    <button type="button" onClick={onLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-red-500" : "hover:text-red-500"}`}>
                        <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} /> {post.likes + (isLiked ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1.5"><MessageCircle className="size-4" /> {post.comments}</span>
                </div>
                <button type="button" onClick={onSave} aria-label={isSaved ? "Remove bookmark" : "Save post"} className={`transition-colors ${isSaved ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
                    <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
            </div>
        </div>
    </article>
);