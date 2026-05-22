import { useState } from "react";
import DashboardLayout from "../../layout/dashboard-layout";
import useInfiniteGet from "../../hooks/useInfiniteGet";
import { API_URL } from "../../hooks/http";
import { useDebounce } from "use-debounce";
import { usePost } from "../../hooks/usePost";
import { Loader } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debSearch] = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteGet({
    url: `${API_URL}/v1/user?search=${debSearch}`,
    queryKey: "users" + debSearch,
    useHeaders: true,
  });

  const followHandler = usePost({
    url: `${API_URL}/v1/user/follow`,
    queryKey: "users" + debSearch,
    title: "successful",
    onSuccess: () => {},
  });

  const unfollowHandler = usePost({
    url: `${API_URL}/v1/user/unfollow`,
    queryKey: "users" + debSearch,
    title: "successful",
    onSuccess: () => {},
  });

  const followBackHandler = (username: string) => {
    followHandler.mutate({ username });
  };

  const unfollowBackHandler = (username: string) => {
    unfollowHandler.mutate({ username });
  };

  const users: any[] = data?.pages?.flatMap((page: any) => page.data) || [];

  console.log(users);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Explore Users
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Discover new connections and stay updated on their updates.
          </p>
        </div>

        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="block w-full rounded-lg border border-[#CBD5E1] bg-white py-2 px-4 text-sm text-[#0F172A] placeholder-[#94A3B8] shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        {isLoading && (
          <div className="text-sm text-[#64748B]">Loading users...</div>
        )}

        {isError && (
          <div className="space-y-2">
            <p className="text-sm text-red-500">Failed to load users</p>
            <button
              onClick={() => refetch()}
              className="text-sm text-[#2563EB]"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center">
            <h3 className="text-sm font-semibold text-[#0F172A]">
              No users found
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Try adjusting your search terms or keywords.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {users?.map((user) => (
            <div
              key={user._id}
              className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 uppercase shrink-0 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-semibold text-lg">
                  {user.fullName.charAt(0)}
                </div>

                <div className="space-y-1 min-w-0">
                  <h3 className="font-semibold capitalize text-[#0F172A] truncate">
                    {user.fullName}
                  </h3>
                  <p className="text-sm text-[#64748B] truncate">
                    @{user.username}
                  </p>
                  <p className="text-xs font-medium text-[#2563EB]">
                    {user.followersCount} followers
                  </p>
                </div>
              </div>

              {user?.bio && (
                <p className="mt-3 text-sm text-[#334155] line-clamp-2">
                  {user.bio}
                </p>
              )}

              <div className="mt-5 pt-3 border-t border-[#F1F5F9]">
                <button
                  disabled={
                    followHandler.isPending || unfollowHandler.isPending
                  }
                  onClick={() => {
                    if (user?.following) {
                      unfollowBackHandler(user?.username);
                    } else {
                      followBackHandler(user?.username);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-[#0F172A] text-white hover:bg-[#1E293B]"
                >
                  {user?.following ? "UnFollow" : "Follow"}{" "}
                  {(followHandler.isPending || unfollowHandler.isPending) && (
                    <Loader className="animate-spin" color="white" size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-sm text-[#2563EB]"
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
