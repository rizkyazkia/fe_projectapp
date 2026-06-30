import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import ProgressCircle from "./parent/chart/ProgressCircle";

const WelcomeHero = ({
  percentage = 67,
  description = "Yuk isi kuisioner terlebih dahulu agar bisa memantau perkembangan gizi dan kesehatan anak Anda.",
  buttonLink = "/parent/quesioner",
  buttonText = "Isi Kuisioner Sekarang",
  completedQuisioner = false,
  completedButtonText = "Selesai Mengisi Kuisioner",
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-10 items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Halo, {user?.username} 👋
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        {completedQuisioner ? (
          <button
            disabled
            className="px-6 py-3 rounded-xl bg-gray-300 text-white font-semibold cursor-not-allowed"
          >
            {completedButtonText}
          </button>
        ) : (
          <button
            onClick={() => navigate(buttonLink)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition duration-300"
          >
            {buttonText}
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center">
        <ProgressCircle percentage={percentage} />
      </div>
    </section>
  );
};

export default WelcomeHero;
