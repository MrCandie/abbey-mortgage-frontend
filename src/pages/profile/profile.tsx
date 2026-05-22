import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/dashboard-layout";
import { useGet } from "../../hooks/useGet";
import { API_URL } from "../../hooks/http";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const { data, isPending, isError, refetch }: any = useGet({
    url: `${API_URL}/v1/user/profile`,
    queryKey: "profile",
  });

  const profile = data?.data;

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        username: profile.username || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (isPending) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-[#E2E8F0] rounded-lg" />
            <div className="h-4 w-72 bg-[#E2E8F0] rounded-lg" />
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
            <div className="h-32 bg-[#E2E8F0]" />
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6 gap-4">
                <div className="h-28 w-28 rounded-2xl bg-[#CBD5E1] border-4 border-white shadow-md shrink-0" />
              </div>
              <div className="space-y-3">
                <div className="h-6 w-36 bg-[#E2E8F0] rounded-lg" />
                <div className="h-4 w-24 bg-[#E2E8F0] rounded-lg" />
                <div className="h-4 w-full bg-[#E2E8F0] rounded-lg" />
              </div>
            </div>
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
            Failed to load profile
          </h3>
          <p className="mt-2 text-sm text-[#64748B]">
            An unexpected connection failure occurred while fetching your
            information.
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
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage your digital footprint and application settings.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#0F172A] to-[#1E293B]" />

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6 gap-4">
              <div className="h-28 w-28 uppercase rounded-2xl bg-[#2563EB] text-white border-4 border-white flex items-center justify-center font-bold text-4xl shadow-md shrink-0">
                {profile?.fullName?.charAt(0)}
              </div>

              {!isEditing && (
                <button
                  onClick={() => {
                    setFormData({
                      fullName: profile?.fullName || "",
                      username: profile?.username || "",
                      bio: profile?.bio || "",
                    });
                    setIsEditing(true);
                  }}
                  className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#334155] shadow-sm hover:bg-[#F8FAFC] transition-colors self-start sm:self-auto"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="space-y-4 border-t border-[#F1F5F9] pt-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-[#334155]"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-[#334155]"
                    >
                      Username
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8] text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-[#CBD5E1] bg-white py-2 pl-7 pr-3 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-[#334155]"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1E293B] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl capitalize font-bold text-[#0F172A]">
                    {profile?.fullName}
                  </h2>
                  <p className="text-sm text-[#64748B]">@{profile?.username}</p>
                </div>

                <p className="text-sm text-[#334155] leading-relaxed">
                  {profile?.bio || (
                    <span className="text-[#94A3B8] italic">
                      No bio provided yet.
                    </span>
                  )}
                </p>

                <div className="flex gap-6 border-t border-[#F1F5F9] pt-4 text-sm text-[#475569]">
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className="hover:text-[#2563EB] transition-colors"
                  >
                    <span className="font-bold text-[#0F172A]">
                      {profile?.followers || 0}
                    </span>{" "}
                    followers
                  </button>
                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className="hover:text-[#2563EB] transition-colors"
                  >
                    <span className="font-bold text-[#0F172A]">
                      {profile?.following || 0}
                    </span>{" "}
                    following
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#0F172A]">
            Account Information
          </h3>
          <div className="grid gap-4 border-t border-[#F1F5F9] pt-4 text-sm sm:grid-cols-2">
            <div>
              <span className="block font-medium text-[#64748B]">
                Registered Email
              </span>
              <span className="text-[#334155]">{profile?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-lg font-bold text-[#0F172A]">Followers</h3>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-[#94A3B8] hover:text-[#475569]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Sarah Connor</p>
                  <p className="text-xs text-[#64748B]">@sconnor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-lg font-bold text-[#0F172A]">Following</h3>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-[#94A3B8] hover:text-[#475569]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Alex Mercer</p>
                  <p className="text-xs text-[#64748B]">@amercer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
