import { useState } from "react";
import DashboardLayout from "../../layout/dashboard-layout";
import { useGet } from "../../hooks/useGet";
import { API_URL } from "../../hooks/http";
import { usePost } from "../../hooks/usePost";
import { Loader } from "lucide-react";

export default function Followers() {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const [loadingUsername, setLoadingUsername] = useState<string | null>(null);

  const { data, isPending, isError, refetch }: any = useGet({
    url: `${API_URL}/v1/user/following`,
    queryKey: "following",
  });

  const followHandler = usePost({
    url: `${API_URL}/v1/user/follow`,
    queryKey: "following",
    title: "successful",
    onSuccess: () => setLoadingUsername(null),
    onError: () => setLoadingUsername(null),
  });

  const unfollowHandler = usePost({
    url: `${API_URL}/v1/user/unfollow`,
    queryKey: "following",
    title: "successful",
    onSuccess: () => setLoadingUsername(null),
    onError: () => setLoadingUsername(null),
  });

  const following = data?.data?.following || [];
  const followers = data?.data?.followers || [];

  const handleFollow = (username: string) => {
    setLoadingUsername(username);
    followHandler.mutate({ username });
  };

  const handleUnfollow = (username: string) => {
    setLoadingUsername(username);
    unfollowHandler.mutate({ username });
  };

  const currentList = activeTab === "followers" ? followers : following;

  if (isPending) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-[#E2E8F0] rounded-lg" />
            <div className="h-4 w-72 bg-[#E2E8F0] rounded-lg" />
          </div>
          <div className="h-12 border-b border-[#E2E8F0]" />
          <div className="rounded-xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-full bg-[#E2E8F0]" />
                  <div className="space-y-2 w-1/3">
                    <div className="h-4 bg-[#E2E8F0] rounded w-3/4" />
                    <div className="h-3 bg-[#E2E8F0] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-[#E2E8F0] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-12 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
            Failed to load connections
          </h3>
          <p className="mt-2 text-sm text-[#64748B]">
            An error occurred while loading your connection network.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1E293B]"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            My Connections
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage your network relationships and track who you interact with.
          </p>
        </div>

        <div className="border-b border-[#E2E8F0]">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("followers")}
              className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${
                activeTab === "followers"
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:border-[#CBD5E1] hover:text-[#334155]"
              }`}
            >
              Followers ({followers.length})
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${
                activeTab === "following"
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:border-[#CBD5E1] hover:text-[#334155]"
              }`}
            >
              Following ({following.length})
            </button>
          </nav>
        </div>

        {currentList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-[#94A3B8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              No users here yet
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              {activeTab === "followers"
                ? "When other users follow you, they will appear here."
                : "Explore users around the platform to grow your pipeline."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9] shadow-sm">
            {currentList.map((user: any) => {
              const isActionPending = loadingUsername === user.username;

              return (
                <div
                  key={user.id || user.username}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 uppercase shrink-0 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm">
                      {user.fullName?.charAt(0)}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-semibold capitalize text-sm text-[#0F172A] truncate">
                        {user.fullName}
                      </h3>
                      <p className="text-xs text-[#64748B] truncate">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-sm text-[#334155] line-clamp-1 mt-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {activeTab === "following" ? (
                      <button
                        disabled={isActionPending}
                        onClick={() => handleUnfollow(user.username)}
                        className="rounded-lg flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold shadow-sm border transition-colors bg-[#F1F5F9] text-[#334155] border-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50"
                      >
                        Unfollow
                        {isActionPending && (
                          <Loader
                            className="animate-spin text-current"
                            size={14}
                          />
                        )}
                      </button>
                    ) : (
                      <>
                        {!user?.isFollowingBack && (
                          <button
                            disabled={isActionPending}
                            onClick={() =>
                              user.isFollowing
                                ? handleUnfollow(user.username)
                                : handleFollow(user.username)
                            }
                            className={`rounded-lg flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold shadow-sm border transition-colors disabled:opacity-50 ${
                              user.isFollowing
                                ? "bg-[#F1F5F9] text-[#334155] border-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                : "bg-[#0F172A] text-white border-transparent hover:bg-[#1E293B]"
                            }`}
                          >
                            {user.isFollowing ? "Following" : "Follow Back"}
                            {isActionPending && (
                              <Loader
                                className="animate-spin text-current"
                                size={14}
                              />
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
