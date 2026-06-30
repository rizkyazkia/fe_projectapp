import useSWR from "swr";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import { getHealthcareDashboardSummary } from "../../../lib/healthcare/dashboardAPI";

const SCORE_COLORS = [
  { bg: "from-blue-500 to-blue-600" },
  { bg: "from-violet-500 to-violet-600" },
  { bg: "from-emerald-500 to-emerald-600" },
  { bg: "from-amber-500 to-amber-600" },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Index = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  const getActiveToken = async () => {
    const currentTime = new Date().getTime();
    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
      return response.data.accessToken;
    }
    return accessToken;
  };

  const fetchSummary = async () => {
    const t = await getActiveToken();
    const res = await getHealthcareDashboardSummary(t);
    return res.data;
  };

  const { data, isLoading } = useSWR(
    "healthcareDashboardSummary",
    fetchSummary
  );

  const cards = [
    {
      label: "Rekomendasi Baru",
      value: data?.totalPending ?? 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      label: "Sedang Diproses",
      value: data?.totalProcessed ?? 0,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      label: "Selesai Ditangani",
      value: data?.totalCompleted ?? 0,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Sekolah Mitra",
      value: data?.totalPartnerSchools ?? 0,
      icon: "M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M17 9a4 4 0 11-8 0 4 4 0 018 0z",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl p-10 h-52" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-28 shadow-sm" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 h-72 shadow-sm" />
          <div className="bg-white rounded-2xl p-6 h-72 shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${SCORE_COLORS[i].bg.replace("from-", "").split(" ")[0]}, ${SCORE_COLORS[i].bg.replace("to-", "").split(" ")[0]})`,
              }}
            />
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${SCORE_COLORS[i].bg} shadow-sm`}
              >
                <svg
                  className="size-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={card.icon}
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
            <svg
              className="size-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Rekomendasi Terbaru
          </h2>
          {data?.recentRecommendations?.length > 0 ? (
            <div className="space-y-3">
              {data.recentRecommendations.slice(0, 5).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {rec.student?.familyMember?.fullName || "-"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {rec.student?.institution?.name || "-"}
                      {rec.student?.class?.name ? ` - ${rec.student.class.name}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs font-medium text-gray-500">
                      {formatDate(rec.createdAt)}
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      Baru
                    </span>
                  </div>
                </div>
              ))}
              <a
                href="/healthcare/list-of-recommendations"
                className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-800 py-2 mt-2"
              >
                Lihat Semua Rekomendasi
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <svg
                className="size-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">Belum ada rekomendasi masuk</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
            <svg
              className="size-5 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
            </svg>
            Status Rekomendasi
          </h2>
          {data?.recommendationsByStatus?.length > 0 ? (
            <div className="space-y-4">
              {data.recommendationsByStatus.map((item) => {
                const total =
                  (data.totalPending || 0) +
                  (data.totalProcessed || 0) +
                  (data.totalCompleted || 0);
                const percentage = total > 0 ? Math.round((item.total / total) * 100) : 0;
                return (
                  <div key={item.status} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.status === "PENDING"
                          ? "Menunggu"
                          : item.status === "PROCESSED"
                          ? "Diproses"
                          : "Selesai"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-700">
                          {item.total}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            STATUS_COLORS[item.status]
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.status === "PENDING"
                            ? "bg-yellow-500"
                            : item.status === "PROCESSED"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <svg
                className="size-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
              </svg>
              <p className="text-sm">Belum ada data rekomendasi</p>
            </div>
          )}

          {data?.totalPartnerSchools > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <svg
                    className="size-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M17 9a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Sekolah Mitra
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.totalPartnerSchools} sekolah bermitra dengan puskesmas Anda
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
