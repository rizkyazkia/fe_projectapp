import { HSStaticMethods } from "preline/preline";
import React, { useEffect } from "react";
import { FaEye } from "react-icons/fa6";
import useSWR from "swr";
import { useAuth } from "../../../hooks/auth/useAuth";
import {
  getInterventionBelongsToFamily,
  getInterventionBelongsToInstitution,
} from "../../../lib/recommendationAPI";
import { getCurrrentDate } from "../../../lib/utility";
import Pagination from "../../Pagination";
import Intervensi from "./FollowUpLetter/Index";

const TABLE_HEAD = [
  "NIS",
  "Siswa",
  "Sekolah",
  "Kelas",
  "Status",
  "Tanggal",
  "Aksi",
];

const InterventionTable = ({ forWho }) => {
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(10);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [selectedRec, setSelectedRec] = React.useState(null);

  let tableContent;
  const { accessToken } = useAuth();

  const fetchIntervention = async () => {
    let fetchFunction =
      forWho === "PARENT"
        ? getInterventionBelongsToFamily
        : getInterventionBelongsToInstitution;
    const data = await fetchFunction(accessToken, {
      page,
      limit,
      keyword: query,
    });
    setLimit(data.data.limit);
    setPages(data.data.totalPages);

    return data.data.interventions;
  };

  const {
    data: interventionData = [],
    isLoading,
    mutate,
  } = useSWR("institutionInterventions", () => fetchIntervention());

  useEffect(() => {
    if (!isLoading) {
      HSStaticMethods.autoInit();
    }
  }, [interventionData]);

  useEffect(() => {
    mutate();
  }, [query]);

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
  } else if (interventionData?.length > 0) {
    tableContent = interventionData.map((intervention, idx) => {
      const parsedContent = intervention?.options
        ? JSON.parse(intervention.options)
        : "";
      const content = parsedContent.content;

      return (
        <tr key={intervention.id}>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {intervention?.recommendation?.student?.nis ?? "-"}
          </td>
          <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
            {intervention?.recommendation?.student?.familyMember?.fullName ||
              "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {intervention?.recommendation?.student?.institution?.name || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {intervention?.recommendation?.student?.class?.name ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-800">
            {intervention?.recommendation?.status ?? "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-800">
            {getCurrrentDate(new Date(intervention?.createdAt)) || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center gap-x-3">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none capitalize"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls={`modal-detail-recommendation-${intervention.id}`}
                data-hs-overlay={`#modal-detail-recommendation-${intervention.id}`}
                onClick={() => console.log("Cliked")}
              >
                <FaEye className="size-5" />
              </button>
            </div>
            <div
              id={`modal-detail-recommendation-${intervention.id}`}
              className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
              tabIndex="-1"
              aria-labelledby={`modal-detail-recommendation-${intervention.id}-label`}
              data-hs-overlay-keyboard="false"
            >
              <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
                <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-2xl h-[750px]">
                  <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                    <h3
                      id={`modal-detail-recommendation-${intervention.id}`}
                      className="font-bold text-gray-800"
                    >
                      Detail
                    </h3>
                    <button
                      type="button"
                      className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                      aria-label="Close"
                      data-hs-overlay={`#modal-detail-recommendation-${intervention.id}`}
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
                  <div id="surat" className="p-6 h-full">
                    <Intervensi
                      values={intervention.recommendation}
                      content={parsedContent?.content ?? ""}
                      signature={parsedContent?.signature ?? ""}
                      institution={intervention?.user}
                    />
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
            Belum ada rekomendasi yang tersedia
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
                  // onSubmit={searchData}
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
                    placeholder="Nama siswa"
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
                <div className="max-w-[200px] w-full"></div>
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

export default InterventionTable;
