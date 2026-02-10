import { Separator } from "@/components/ui/separator";

export const ProfileTab = () => {
    return (
        <>
            <Separator className="my-6" />

            <div className="flex justify-center sm:justify-start gap-8 text-sm font-medium">
                <button className="pb-4 border-b-2 border-red-500 text-red-500">
                    Posts
                </button>
                <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Stories
                </button>
                <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Photos
                </button>
                <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Tagged
                </button>
            </div>
        </>
    )
}