import React, { useEffect, useState } from "react";
import { HSStaticMethods } from "preline/preline";
import { useAuth } from "../../../hooks/auth/useAuth";
import useSWR from "swr";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import Pagination from "../../Pagination";
import { getStudentsByInstitution } from "../../../lib/school/studentsAPI";
import { useRecommendation } from "../../../hooks/useRecommendation";
import { getRecommendations } from "../../../lib/recommendationAPI";
import { getClasses } from "../../../lib/classesAPI";
import ModalContainer from "../../Modal";
import { getHealthCares } from "../../../lib/healthcare/healthcare";
import { toast } from "react-toastify";

const TABLE_HEAD = [
  "Nama Lengkap",
  "NIS",
  "Angkatan",
  "Semester",
  "Kelas",
  "Kondisi",
  "Aksi",
];

const TableStudents = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();
  const { addRecommendation } = useRecommendation();

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState("Semua Kelas");
  const [isOpen, setIsOpen] = useState(false);
  const [healthcares, setHealthCares] = useState([]);
  const [selectedHealthCare, setSelectedHealthCare] = useState("");

  function onClose() {
    setIsOpen(false);
  }

  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, [isOpen]);

  let tableContent;

  const Fetchstudents = async () => {
    const classFilter = selectedClass === "Semua Kelas" ? "" : selectedClass;
    const response = await getStudentsByInstitution(
      accessToken,
      keyword,
      page,
      limit,
      classFilter
    );
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  // const Fetchrecomend = async () => {
  //   const response = await getRecommendations();
  //   return response.data;
  // };

  const FetchClasses = async () => {
    const response = await getClasses(accessToken);
    return response.data;
  };

  const {
    data: studentData,
    isLoading: studentLoading,
    mutate: studentMutate,
  } = useSWR(["students", keyword, page, selectedClass], () => Fetchstudents());

  // const { data: recommendationData } = useSWR("recommendations", Fetchrecomend);

  const { data: classesData, isLoading: classesLoading } = useSWR(
    "classes",
    FetchClasses
  );

  console.log({ classesData });

  React.useEffect(() => {
    if (classesData) {
      HSStaticMethods.autoInit();
    }
  }, [classesData]);

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    studentMutate("users", { revalidate: true });
  };

  React.useEffect(() => {
    studentMutate();
  }, [keyword, page, studentMutate]);

  const updateToken = async () => {
    const currentTime = new Date().getTime();

    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      if (user?.exp * 1000 < currentTime) {
        updateToken();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHealthCares();
        setHealthCares(data);
      } catch (err) {
        console.log({ err });
      }
    })();
  }, []);

  const [selectedStudent, setSelectedStudent] = useState(null);

  if (studentLoading) {
    tableContent = [...Array(10)].map((_, index) => (
      <tr key={index}>
        <td className="p-4">
          <div className="h-[30px] w-full bg-gray-100 animate-pulse rounded"></div>
        </td>
        <td className="p-4">
          <div className="h-[30px] w-full bg-gray-100 animate-pulse rounded"></div>
        </td>
      </tr>
    ));
  } else if (studentData && studentData?.students?.length > 0) {
    tableContent = studentData.students.map((student) => {
      console.log({ eachStudeent: student });
      return (
        <tr key={student.id}>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {student?.fullName || "-"}
          </td>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {student?.student?.nis || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {student?.student?.schoolYear || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {student?.student?.semester || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-800">
            {student?.student?.class?.name || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-800">
            {student?.nutrition[0]?.nutritionStatus?.information || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {(() => {
              // const isNormal =
              //   student?.nutrition?.[0]?.nutritionStatus?.information?.toLowerCase() ===
              //   "gizi normal";
              const isRecommended = student?.isRecommending ?? false;
              const studentId = student?.student?.id;

              return isRecommended ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none capitalize"
                  disabled={isRecommended}
                >
                  Sedang di rekomendasikan
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none capitalize"
                    disabled={isRecommended}
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsOpen(true);
                    }}
                  >
                    Rekomendasikan
                  </button>
                </>
              );
            })()}
          </td>
        </tr>
      );
    });
  } else {
    tableContent = (
      <tr>
        <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
          <h1 className="text-gray-900 text-sm font-normal">
            Tidak ada murid tersedia
          </h1>
        </td>
      </tr>
    );
  }

  return (
    <>
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <select
          data-hs-select='{
  "hasSearch": true,
  "searchPlaceholder": "Search...",
  "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 py-1.5 sm:py-2 px-3",
  "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0 dark:bg-neutral-900",
  "placeholder": "Pilih Puskesmas",
  "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 dark:text-neutral-200 \" data-title></span></button>",
  "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600",
  "dropdownClasses": "mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
  "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
  "optionTemplate": "<div><div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div class=\"text-gray-800 dark:text-neutral-200 \" data-title></div></div></div>",
  "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
}'
          className="hidden"
          onChange={(e) => setSelectedHealthCare(Number(e.target.value))}
          value={selectedHealthCare}
        >
          <option value="">Choose</option>
          {healthcares.map((healthcare) => (
            <option value={healthcare.id}>
              {healthcare?.name}, {healthcare?.city?.name},{" "}
              {healthcare?.province?.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none w-min justify-center"
          onClick={(e) => {
            if (!selectedStudent) {
              toast.error("Pilih siswa terlebih dahulu");
              return;
            }
            addRecommendation(
              {
                selectedHealthCare,
                familyMemberId: selectedStudent.id,
                studentId: selectedStudent.student.id,
              },
              accessToken
            );
          }}
        >
          Kirim
        </button>
      </ModalContainer>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <form
                    onSubmit={searchData}
                    className="relative max-w-xs w-full"
                  >
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      name="search_query"
                      id="search_query"
                      className="py-1.5 sm:py-2 px-3 ps-9 block w-full border border-obito-grey shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Username atau Email"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                      <svg
                        className="size-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-800 text-white px-2.5 py-1.5 text-sm rounded-md absolute top-1/2 -translate-y-1/2 right-1"
                    >
                      Cari
                    </button>
                  </form>
                  <div className="max-w-[200px] w-full">
                    {classesLoading ? (
                      <span>Loading kelas...</span>
                    ) : (
                      <select
                        name="role"
                        id="role"
                        data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Semua Kelas",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                        className="block"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setPage(0);
                        }}
                      >
                        <option value="Semua Kelas">Semua Kelas</option>
                        {classesData?.classes?.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head}
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tableContent}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                pages={pages}
                rows={rows}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableStudents;
