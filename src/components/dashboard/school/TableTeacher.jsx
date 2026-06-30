import React from "react";
import { getTeachers } from "../../../lib/school/teachersAPI";
import useSWR from "swr";
import Pagination from "../../Pagination";
import { HSStaticMethods } from "preline/preline";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";

const TABLE_HEAD = [
  "No",
  "Nama Lengkap",
  "Wali Kelas",
  "Alamat",
  "No. Telepon",
  "Aksi",
];

const TableTeacher = ({
  children,
  handleDelete,
  handleEdit,
  setDataTeacher,
}) => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const { setAccessToken, user, setUser, accessToken } = useAuth();

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");

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

  const teachers = async () => {
    const activeToken = await getActiveToken();
    const response = await getTeachers(keyword, page, limit, activeToken);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    setDataTeacher(response.data.teachers);
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(["teachers", keyword, page], () =>
    teachers()
  );

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
  } else if (data && data.teachers.length > 0) {
    tableContent = data?.teachers?.map((item, index) => (
      <tr key={item.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
          {index + 1 + page * limit}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 capitalize">
          {item?.fullName || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 capitalize">
          {`Wali Kelas ${item.role || "-"}`}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 capitalize">
          {item.address || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 capitalize">
          {item.phone || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
          <div className="flex justify-center items-center gap-x-2">
            <button
              type="button"
              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              onClick={() => handleEdit(item.id)}
            >
              Edit
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  } else {
    tableContent = (
      <tr>
        <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
          <h1 className="text-gray-900 text-sm font-normal">Tidak ada data</h1>
        </td>
      </tr>
    );
  }

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    mutate();
  };

  React.useEffect(() => {
    mutate();
  }, [keyword, page, mutate]);

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
                    placeholder="Nama Lengkap atau Wali Kelas"
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
                <button
                  type="button"
                  className="py-2.5 px-3.5 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-800 text-white hover:bg-blue-900 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="modal-add-teachers"
                  data-hs-overlay="#modal-add-teachers"
                >
                  Tambah Guru
                </button>
                <div
                  id="modal-add-teachers"
                  className="hs-overlay [--overlay-backdrop:static] hidden size-full fixed top-0 start-0 z-100 overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/50"
                  tabIndex="-1"
                  aria-labelledby="modal-add-teachers-label"
                  data-hs-overlay-keyboard="false"
                >
                  <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg lg:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
                    <div className="flex flex-col bg-white border border-obito-grey shadow-2xs rounded-xl pointer-events-auto lg:w-lg">
                      <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                        <h3
                          id="modal-add-teachers"
                          className="font-bold text-gray-800"
                        >
                          Tambah Guru
                        </h3>
                        <button
                          type="button"
                          className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                          aria-label="Close"
                          data-hs-overlay="#modal-add-teachers"
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
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Nama Lengkap
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Wali Kelas
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Alamat
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      No. Telepon
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Aksi
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
    </div>
  );
};

export default TableTeacher;
