import { TrendingTopics } from "../sidebar/TrendingTopics";
import { WhoToFollow } from "../sidebar/whoToFollow";

export const RightSidebar = () => (
  <aside className="hidden shrink-0 xl:block xl:w-80">
    <div className="sticky top-20 flex flex-col gap-4">
      <TrendingTopics />
      <WhoToFollow />
    </div>
  </aside>
);