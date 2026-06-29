import React from "react";
import useSWR from "swr";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import { getSchoolDashboardSummary } from "../../../lib/school/dashboardAPI";
import WelcomeHero from "../../../components/dashboard/WelcomeHero";
import DoughnutChartComponent from "../../../components/dashboard/parent/chart/DoughnutChartComponent";
import BarChartComponent from "../../../components/dashboard/parent/chart/BarChartComponent";

const SCORE_COLORS = [
  { bg: "from-blue-500 to-blue-600" },
  { bg: "from-violet-500 to-violet-600" },
  { bg: "from-emerald-500 to-emerald-600" },
  { bg: "from-amber-500 to-amber-600" },
];

const CHART_COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"];

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
    const res = await getSchoolDashboardSummary(t);
    return res.data;
  };

  const { data, isLoading } = useSWR("schoolDashboardSummary", fetchSummary);

  const cards = [
    {
      label: "Total Murid",
      value: data?.totalStudents ?? 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      label: "Total Kelas",
      value: data?.totalClasses ?? 0,
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      label: "Total Guru",
      value: data?.totalTeachers ?? 0,
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      label: "Total Mitra",
      value: data?.totalPartners ?? 0,
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  const nutritionData =
    data?.nutritionDistribution?.map((item, index) => ({
      name: item.displayName,
      total: item.total,
      fill:
        item.displayName === "Tidak Terdata"
          ? "#9ca3af"
          : CHART_COLORS[index % CHART_COLORS.length],
    })) || [];

  const classData =
    data?.studentsPerClass?.map((item) => ({
      status: item.className,
      total: item.total,
    })) || [];

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
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 h-48 shadow-sm" />
            <div className="bg-white rounded-2xl p-6 h-48 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHero
        percentage={data?.questionnaireProgress || 0}
        description="Isi kuisioner untuk mengevaluasi pelayanan kesehatan di sekolah Anda."
        buttonLink="/school/quesioner"
        buttonText="Isi Kuisioner Sekarang"
        completedQuisioner={!!data?.questionnaireResult}
      />

      {/* KESIMPULAN & SARAN */}
      {data?.schoolConclusion && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
              <svg
                className="size-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Kesimpulan &amp; Saran
              </h2>
              <p className="text-sm text-gray-400">
                Berdasarkan hasil kuisioner pelayanan kesehatan sekolah
              </p>
            </div>
          </div>

          <div
            className={`bg-gradient-to-r ${data.schoolConclusion.color} rounded-2xl p-5 md:p-6 mb-6 shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl md:text-4xl">
                {data.schoolConclusion.icon}
              </span>
              <div>
                <h3 className="text-white text-xl md:text-2xl font-bold">
                  {data.schoolConclusion.kategori}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-5 md:p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">
                Saran untuk Sekolah
              </h3>
            </div>
            <ul className="space-y-2.5">
              {data.schoolConclusion.saran.map((saran, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="shrink-0 size-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                    <svg
                      className="size-3 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 leading-relaxed">
                    {saran}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
        {/* Left: Students per Class */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="size-5 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Distribusi per Kelas
          </h2>
          {classData.length > 0 ? (
            <BarChartComponent title="" data={classData} height={500} />
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-sm">Belum ada data kelas</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Nutrition Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="size-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Status Gizi Siswa
            </h2>
            {nutritionData.length > 0 ? (
              <DoughnutChartComponent
                title=""
                data={nutritionData}
                legend={true}
                height={240}
              />
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-sm">Belum ada data gizi siswa</p>
              </div>
            )}
          </div>

          {/* Questionnaire Results */}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Hasil Kuisioner
            </h2>
            {data?.questionnaireResult ? (
              <div className="space-y-3">
                <div className="relative p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {data.questionnaireResult.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Skor: {data.questionnaireResult.totalScore}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        data.questionnaireResult.interpretation === "Tinggi"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {data.questionnaireResult.interpretation}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        data.questionnaireResult.interpretation === "Tinggi"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (data.questionnaireResult.totalScore / 40) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
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
                <p className="text-sm">Belum mengisi kuisioner</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
