import { useEffect, useState } from "react";
import {
  FcConferenceCall,
  FcElectricalSensor,
  FcPortraitMode,
  FcSurvey,
} from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import girl from "../../../../public/images/girl.png";
import BarChartComponent from "../../../components/dashboard/parent/chart/BarChartComponent";
import { default as DoughnutChartComponent } from "../../../components/dashboard/parent/chart/DoughnutChartComponent";
import LineChartComponent from "../../../components/dashboard/parent/chart/LineChartComponent";
import ProgressCircle from "../../../components/dashboard/parent/chart/ProgressCircle";
import { useAuth } from "../../../hooks/auth/useAuth";
import {
  getDashboardSummary,
  getNutritionDistribution,
  getNutritionDistributionByRegion,
} from "../../../lib/parent/dashboardApi";
import { getCurrrentDate } from "../../../lib/utility";

const Index = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [dataSummary, setDataSummary] = useState(null);
  const [children, setChildren] = useState(null);
  const [childNutritionGrowth, setChildNutritionGrowth] = useState([]);
  const [nutritionDistribution, setNutritionDistribution] = useState([]);
  const [nutritionDistributionByRegion, setNutritionDistributionByRegion] =
    useState([]);
  const COLORS = ["#A5D8FF", "#D3F9D8", "#FFD6A5"];
  const [status, setStatus] = useState("NORMAL");

  useEffect(() => {
    Promise.all([
      (async () => {
        try {
          const { data } = await getDashboardSummary(accessToken);
          console.log({ sumary: data });
          if (!!data?.summary?.childrens.length) {
            setChildren(data?.summary?.childrens[0]);
          }
          setDataSummary(data);
        } catch (err) {
          console.log({ err });
        }
      })(),

      (async () => {
        try {
          const { data } = await getNutritionDistribution();
          setNutritionDistribution(
            data.map((val, i) => ({ ...val, fill: COLORS[i] }))
          );
        } catch (err) {
          console.log({ err });
        }
      })(),

      (async () => {
        try {
          const { data } = await getNutritionDistributionByRegion();

          setNutritionDistributionByRegion(
            data.map((val, i) => ({
              ...val,
              fill: COLORS[i],
            }))
          );
        } catch (err) {
          console.log({ err });
        }
      })(),
    ]);
  }, []);

  useEffect(() => {
    if (!!dataSummary) {
      const filteredChildren = dataSummary.summary.childNutritionGrowth.find(
        (child) => child.id === children.id
      );
      setChildNutritionGrowth(
        filteredChildren.nutrition.map((nutrition) => ({
          ...nutrition,
          date: getCurrrentDate(new Date(nutrition.createdAt), {
            month: "long",
            day: "2-digit",
          }),
        }))
      );
    }
  }, [children]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getNutritionDistributionByRegion(status);

        setNutritionDistributionByRegion(
          data.map((val, i) => ({
            ...val,
            fill: COLORS[i],
          }))
        );
      } catch (err) {
        console.log({ err });
      }
    })();
  }, [status]);

  console.log({ dataSummary });

  return (
    <article className="space-y-8">
      {!!dataSummary && dataSummary?.quisionerProgress < 100 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-10 items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Halo, {user?.username} 👋
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Yuk isi kuisioner terlebih dahulu agar bisa memantau perkembangan
              gizi dan kesehatan anak Anda.
            </p>
            <button
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition duration-300"
              onClick={() => navigate("/parent/quesioner")}
            >
              Isi Kuisioner Sekarang
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <ProgressCircle percentage={dataSummary?.quisionerProgress ?? 0} />
          </div>
        </section>
      )}

      <section className="px-4 bg-white flex items-center justify-end  gap-6 rounded-2xl shadow-sm ">
        {dataSummary?.summary?.childrens &&
          dataSummary?.summary?.childrens.map((val) => (
            <>
              <div className="relative p-4 cursor-pointer">
                <h1>{val.fullName}</h1>
                {children.id === val.id && (
                  <div className="absolute w-full  bottom-0 left-0 right-0 h-1.5 bg-[#1F5CB1] rounded-full"></div>
                )}
              </div>
            </>
          ))}
      </section>

      <section className="flex gap-5  flex-wrap">
        <div className="flex items-center justify-around pb-2 bg-white rounded-2xl shadow-sm flex-1 flex-wrap">
          <div className="flex items-center justify-center relative overflow-hidden flex-1">
            <div className="size-24 absolute bg-[#FFEBC2] -top-1/2  rounded-full"></div>
            <div className="flex flex-col gap-5 items-center z-10">
              <FcConferenceCall className="size-8" />
              <div className="flex flex-col gap-1 items-center">
                <h1 className="font-semibold">Keluarga</h1>
                <p>{dataSummary?.summary?.familyCount ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center relative overflow-hidden flex-1">
            <div className="size-24 absolute bg-[#FFEBC2] -top-1/2  rounded-full "></div>
            <div className="flex flex-col gap-5 items-center z-10">
              <FcPortraitMode className="size-8" />
              <div className="flex flex-col gap-1 items-center">
                <h1 className="font-semibold">Anak</h1>
                <p>{dataSummary?.summary?.childCount ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center relative overflow-hidden flex-1">
            <div className="size-24 absolute bg-[#FFEBC2] -top-1/2  rounded-full"></div>
            <div className="flex flex-col gap-5 items-center z-10">
              <FcSurvey className="size-8" />
              <div className="flex flex-col gap-1 items-center">
                <h1 className="font-semibold">Intervensi</h1>
                <p>4</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center relative overflow-hidden flex-1">
            <div className="size-24 absolute bg-[#FFEBC2] -top-1/2  rounded-full"></div>
            <div className="flex flex-col gap-5 items-center z-10">
              <FcElectricalSensor className="size-8" />
              <div className="flex flex-col gap-1 items-center">
                <h1 className="font-semibold">Butuh Perhatian</h1>
                <p>{dataSummary?.summary?.needAttention.length ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around bg-white p-4 rounded-2xl shadow-sm">
          {children ? (
            <div className="flex gap-4 items-center">
              <div className="size-24 rounded-full overflow-hidden bg-[#FBC248]">
                <img src={girl} />
              </div>
              <div className="flex flex-col gap-2">
                <h1>{children.fullName}</h1>
                <h1>{getCurrrentDate(new Date(children.birthDate))}</h1>
                <div className="flex gap-1 items-center">
                  <p className="font-semibold text-orange-600">
                    {children.nutrition[0].height} kg
                  </p>
                  <div className="size-2 rounded-full bg-[#FBC248]"></div>
                  <p className="font-semibold text-orange-600">
                    {children.nutrition[0].weight} kg
                  </p>
                  <div className="size-2 rounded-full bg-[#FBC248]"></div>
                  <p className="font-semibold text-orange-600">
                    {children.nutrition[0].nutritionStatus.status}{" "}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-lg font-semibold">Data tidak ditemukan</h1>
          )}
        </div>
      </section>

      <section className="flex gap-4">
        <div className="bg-white shadow-sm rounded-2xl flex-1 p-4">
          {!dataSummary ? (
            <h1>Data tidak ditemukan</h1>
          ) : (
            <LineChartComponent
              height={300}
              title="Perkembangan Gizi Anak"
              data={childNutritionGrowth}
              xAxisKey={"date"}
              keys={[
                {
                  key: "height",
                  fill: COLORS[0],
                },
                {
                  key: "weight",
                  fill: COLORS[1],
                },
                {
                  key: "bmi",
                  fill: COLORS[2],
                },
              ]}
            />
          )}
        </div>
        <div className="bg-white p-4 space-y-4 overflow-y-auto">
          <h1 className="text-center">Sumber Data Gizi</h1>

          {!dataSummary?.summary?.mappedNutritionResource ? (
            <h1 className="font-semibold text-lg">Belum Ada Sumber data</h1>
          ) : (
            dataSummary?.summary?.mappedNutritionResource.map((val) => (
              <div className="flex items-center gap-5">
                <h1 className="flex-1">{val.name}</h1>
                <div className="flex gap-1 items-center">
                  {Array.from({ length: val.total }).map((val) => (
                    <div className="w-8 h-1 bg-black rounded-full"></div>
                  ))}
                  {Array.from({ length: 3 - val.total }).map((val) => (
                    <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="flex justify-end gap-5 items-center">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-300 shadow-sm">
          {["KURUS", "NORMAL", "GEMUK"].map((item, idx) => {
            const isActive = status === item;
            const label =
              item === "KURUS"
                ? "Kurus"
                : item === "NORMAL"
                ? "Normal"
                : "Gizi Lebih";

            return (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`min-w-[80px] px-4 py-2 text-sm font-semibold transition-colors duration-200
          focus:outline-none  focus:ring-blue-500
          ${
            isActive
              ? "bg-blue-700 text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }
          ${idx === 0 ? "rounded-l-md" : ""}
          ${idx === 2 ? "rounded-r-md" : ""}
        `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex gap-4">
        <div className="bg-white p-4 rounded-2xl flex-1 shadow-sm">
          <BarChartComponent
            height={300}
            title="Distribusi Status Gizi"
            data={nutritionDistribution}
          />
        </div>

        <div className="p-4 rounded-2xl flex-1 bg-white shadow-sm">
          {nutritionDistributionByRegion.length ? (
            <DoughnutChartComponent
              title={`Distribusi Gizi Berdasarkan Lokasi - ${status}`}
              data={nutritionDistributionByRegion}
            />
          ) : (
            <h1 className="text-center text-lg font-semibold">
              Tidak ada data
            </h1>
          )}
        </div>
      </section>
    </article>
  );
};

export default Index;
