import React from "react";
import { getQuestionsByQuesionerID } from "../../../lib/quesionersAPI";
import useSWR from "swr";
import Pagination from "../../Pagination";
import { HSStaticMethods, HSOverlay } from "preline/preline";

const TABLE_HEAD = ["Pertanyaan", "Tipe", "Opsi", "Aksi"];

const TableQuestion = ({ id, children }) => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [existingData, setExistingData] = React.useState(null);

  const question = async () => {
    const response = await getQuestionsByQuesionerID(id, keyword, page, limit);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(["questions", keyword, page], () =>
    question()
  );

  React.useEffect(() => {
    mutate();
  }, [keyword, page, mutate]);

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    mutate("questions", { revalidate: true });
  };

  let tableContent;

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
  } else if (data && data?.questions?.length > 0) {
    tableContent = data.questions.map((q, index) => {
      return (
        <React.Fragment key={q.id}>
          <tr key={q.id}>
            <td
              rowSpan={q?.options?.length}
              className="px-6 border-r border-gray-200 py-4 capitalize whitespace-pre-wrap text-sm font-medium text-gray-800"
            >
              {page * limit + index + 1}
            </td>
            <td
              rowSpan={q?.options?.length}
              className="px-6 border-r border-gray-200 py-4 capitalize whitespace-pre-wrap text-sm font-medium text-gray-800"
            >
              {q?.title}
            </td>
            <td
              rowSpan={q?.options?.length}
              className="px-6 border-r border-gray-200 py-4 text-center capitalize whitespace-nowrap text-sm font-medium text-gray-800"
            >
              {q?.type}
            </td>

            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800 text-center border-r border-gray-200">
              {q.options[0].title}
            </td>
            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800 text-center border-r border-gray-200">
              {q.options[0].score}
            </td>
            <td
              rowSpan={q?.options?.length}
              className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium"
            >
              <button
                type="button"
                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleEdit(q.id)}
                aria-controls="modal-update-question"
              >
                Edit
              </button>
            </td>
          </tr>
          {q.options?.slice(1).map((opt) => (
            <tr key={opt.id}>
              <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800 text-center border-r border-gray-200">
                {opt.title}
              </td>
              <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800 text-center border-r border-gray-200">
                {opt.score}
              </td>
            </tr>
          ))}
        </React.Fragment>
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

  const handleEdit = (id) => {
    const selectedData = data.questions.find((question) => question.id === id);

    if (selectedData) {
      setExistingData(selectedData);
      HSOverlay.open("#modal-update-question");
    } else {
      console.error(`Data dengan id ${id} tidak ditemukan.`);
    }
  };

  React.useEffect(() => {
    if (existingData) {
      HSOverlay.open("#modal-update-question");
    }
  }, [existingData]);

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div className="py-3 px-4">
              <form onSubmit={searchData} className="relative max-w-xs w-full">
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
                  placeholder="Pertanyaan"
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
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      rowSpan={2}
                      className="border-r border-gray-200 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      rowSpan={2}
                      className="border-r border-gray-200 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Pertanyaan
                    </th>
                    <th
                      scope="col"
                      rowSpan={2}
                      className="border-r border-gray-200 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Tipe
                    </th>
                    <th
                      scope="col"
                      colSpan={2}
                      className="border-r border-gray-200 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Opsi
                    </th>
                    <th
                      scope="col"
                      rowSpan={2}
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Aksi
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="border-t border-r border-gray-200 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Nama
                    </th>
                    <th
                      scope="col"
                      className="border-t border-r border-gray-200 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Skor
                    </th>
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
      <div
        id="modal-update-question"
        className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
        tabIndex="-1"
        aria-labelledby="modal-update-question-label"
        data-hs-overlay-keyboard="false"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
          <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-2xl overflow-hidden">
            <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
              <h3
                id="modal-update-question"
                className="font-bold text-gray-800"
              >
                Update Pertanyaan
              </h3>
              <button
                type="button"
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Close"
                data-hs-overlay="#modal-update-question"
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
            {React.isValidElement(children)
              ? React.cloneElement(children, { existingData })
              : children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableQuestion;
