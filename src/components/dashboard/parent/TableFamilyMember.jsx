import React from "react";
import { HSStaticMethods } from "preline/preline";
import { useAuth } from "../../../hooks/auth/useAuth";
import useSWR from "swr";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import Pagination from "../../Pagination";
import { getFamilyMember } from "../../../lib/parent/familiesAPI";
import { useFormik } from "formik";
import { useFamilyMember } from "../../../hooks/parent/useFamilyMember";
import { generateSchoolYears } from "../../../lib/utility";

const TABLE_HEAD = [
  "Nama Lengkap",
  "Jenis Kelamin",
  "Hubungan",
  "Tinggi Badan",
  "Berat Badan",
  "Kesehatan",
  "Aksi",
];

const TableFamilyMember = ({ institutionData, classData }) => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();
  const { updateFamilyMember, deleteFamilyMember } = useFamilyMember();

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");

  let tableContent;

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

  const Fetchfamilymember = async () => {
    const activeToken = await getActiveToken();
    const response = await getFamilyMember(activeToken, keyword, page, limit);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(
    ["familyMembers", keyword, page],
    () => Fetchfamilymember(),
  );

  React.useEffect(() => {
    if (data) {
      HSStaticMethods.autoInit();
    }
  }, [data]);

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    mutate("familyMembers", { revalidate: true });
  };

  React.useEffect(() => {
    mutate();
  }, [keyword, page, mutate]);

  const [editUser, setEditUser] = React.useState(false);
  const [selectedEdit, setSelectedEdit] = React.useState(null);

  const handleEdit = (id) => {
    setSelectedEdit(id);
    const user = data.familyMembers.find((user) => user.id === id);
    if (user.relation === "ANAK") {
      setEditUser(true);
    } else {
      setEditUser(false);
    }
    setTimeout(() => {
      HSStaticMethods.autoInit();
    }, 100);
  };

  React.useEffect(() => {
    if (institutionData || classData) {
      HSStaticMethods.autoInit();
    }
  }, [institutionData, classData]);

  const getInitialValues = () => {
    if (editUser) {
      const selected = data?.familyMembers.find(
        (user) => user.id === selectedEdit,
      );

      console.log(selected);

      return {
        type: "anak",
        nis: selected?.student?.nis ?? "",
        schoolYear: selected?.student?.schoolYear ?? "",
        semester: selected?.student?.semester ?? "",
        schoolId: selected?.student?.institution?.id ?? "",
        classId: selected?.student?.class?.id ?? "",
        height: selected?.nutrition?.[0]?.height ?? "",
        weight: selected?.nutrition?.[0]?.weight ?? "",
      };
    } else {
      const selected = data?.familyMembers.find(
        (user) => user.id === selectedEdit,
      );

      let type = "";
      if (selected?.relation === "IBU") {
        type = "ibu";
      } else if (selected?.relation === "AYAH") {
        type = "ayah";
      } else {
        return type;
      }

      return {
        type,
        height: selected?.nutrition?.[0]?.height ?? "",
        weight: selected?.nutrition?.[0]?.weight ?? "",
      };
    }
  };

  const { values, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: getInitialValues(),
      enableReinitialize: true,
      onSubmit: async (values) => {
        let validTypeData;
        if (editUser) {
          validTypeData = {
            ...values,
            schoolId: values.schoolId ? parseInt(values.schoolId) : null,
            classId: values.classId ? parseInt(values.classId) : null,
          };
        } else {
          validTypeData = {
            ...values,
            height: values.height ? parseInt(values.height) : null,
            weight: values.weight ? parseInt(values.weight) : null,
          };
        }

        await updateFamilyMember(selectedEdit, validTypeData);
      },
    });

  if (isLoading) {
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
  } else if (data && data?.familyMembers?.length > 0) {
    tableContent = data.familyMembers.map((fm) => {
      let gender = "";
      switch (fm?.gender) {
        case "L":
          gender = "Laki-laki";
          break;
        case "P":
          gender = "Perempuan";
          break;
      }

      return (
        <tr key={fm.id}>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {fm?.fullName ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {gender ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.relation ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.nutrition[0]?.height ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.nutrition[0]?.weight ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
            {fm?.nutrition[0]?.nutritionStatus?.displayName ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center gap-x-2">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                data-hs-overlay={`#modal-edit-family-member-${fm.id}`}
                aria-controls={`modal-edit-family-member-${fm.id}`}
                onClick={() => {
                  handleEdit(fm.id);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                onClick={async () => await deleteFamilyMember(fm.id)}
              >
                Delete
              </button>
              <div
                id={`modal-edit-family-member-${fm.id}`}
                className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
                tabIndex="-1"
                aria-labelledby={`modal-edit-family-member-${fm.id}-label`}
                data-hs-overlay-keyboard="false"
              >
                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
                  <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-lg">
                    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                      <h3
                        id={`modal-edit-family-member-${fm.id}`}
                        className="font-bold text-gray-800"
                      >
                        Edit Family Member {fm?.fullName}
                      </h3>
                      <button
                        type="button"
                        className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Close"
                        data-hs-overlay={`#modal-edit-family-member-${fm.id}`}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="shrink-0 size-4"
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
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="p-4 flex flex-col space-y-4">
                        {editUser ? (
                          <>
                            {!institutionData || !classData ? (
                              <div>Loading...</div>
                            ) : (
                              <div className="flex flex-col space-y-4">
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="nis"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Nomor Induk Siswa
                                  </label>
                                  <input
                                    type="text"
                                    id="nis"
                                    name="nis"
                                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                    placeholder="0876756"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.nis ?? ""}
                                  />
                                </div>
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="schoolYear"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Angkatan
                                  </label>
                                  <select
                                    name="schoolYear"
                                    id="schoolYear"
                                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Angkatan...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                                    className="hidden"
                                    value={values.schoolYear ?? ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "schoolYear",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Pilih Angkatan</option>
                                    {generateSchoolYears().map((item) => (
                                      <option
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="semester"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Semester
                                  </label>
                                  <select
                                    name="semester"
                                    id="semester"
                                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Semester...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                                    className="hidden"
                                    value={values.semester ?? ""}
                                    onChange={(e) =>
                                      setFieldValue("semester", e.target.value)
                                    }
                                  >
                                    <option value="">Pilih Semester</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                  </select>
                                </div>
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="schoolId"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Sekolah
                                  </label>
                                  <select
                                    name="schoolId"
                                    id="schoolId"
                                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Sekolah...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                                    className="hidden"
                                    value={values.schoolId ?? ""}
                                    onChange={(e) =>
                                      setFieldValue("schoolId", e.target.value)
                                    }
                                  >
                                    <option value="">Pilih Sekolah</option>
                                    {institutionData &&
                                      institutionData?.institutions
                                        ?.filter(
                                          (item) =>
                                            item.institution_type?.name ===
                                            "School",
                                        )
                                        .map((item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.name}
                                          </option>
                                        ))}
                                  </select>
                                </div>
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="classId"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Kelas
                                  </label>
                                  <select
                                    name="classId"
                                    id="classId"
                                    data-hs-select='{
                    "hasSearch": true,
                    "searchPlaceholder": "Cari...",
                    "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
                    "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
                    "placeholder": "Pilh Kelas...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800",
                    "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                    "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                    "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                  }'
                                    className="hidden"
                                    value={values.classId ?? ""}
                                    onChange={(e) =>
                                      setFieldValue("classId", e.target.value)
                                    }
                                  >
                                    <option value="">Pilih Kelas</option>
                                    {classData &&
                                      classData?.classes?.length > 0 &&
                                      classData?.classes?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="height"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Tinggi Badan
                                  </label>
                                  <input
                                    type="text"
                                    id="height"
                                    name="height"
                                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                    placeholder="170cm"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.height ?? ""}
                                  />
                                </div>
                                <div className="max-w-lg w-full">
                                  <label
                                    htmlFor="weight"
                                    className="block text-sm font-medium mb-2"
                                  >
                                    Berat Badan
                                  </label>
                                  <input
                                    type="text"
                                    id="weight"
                                    name="weight"
                                    className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                    placeholder="70kg"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.weight ?? ""}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="max-w-lg w-full">
                              <label
                                htmlFor="height"
                                className="block text-sm font-medium mb-2"
                              >
                                Tinggi Badan
                              </label>
                              <input
                                type="text"
                                id="height"
                                name="height"
                                className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                placeholder="170 cm"
                                value={values.height ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                            <div className="max-w-lg w-full">
                              <label
                                htmlFor="weight"
                                className="block text-sm font-medium mb-2"
                              >
                                Berat Badan
                              </label>
                              <input
                                type="text"
                                id="weight"
                                name="weight"
                                className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                                placeholder="70 kg"
                                value={values.weight ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <hr className="border-gray-200 border" />
                      <div className="p-4 flex justify-end">
                        <button
                          type="submit"
                          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  } else {
    tableContent = (
      <tr>
        <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
          <h1 className="text-gray-900 text-sm font-normal">
            Tidak ada users tersedia
          </h1>
        </td>
      </tr>
    );
  }

  return (
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
  );
};

export default TableFamilyMember;
