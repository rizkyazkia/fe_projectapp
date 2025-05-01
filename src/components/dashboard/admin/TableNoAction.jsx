import React from "react";

const TableNoAction = ({
  data,
  TABLE_HEAD,
  isLoading,
  rows,
  pages,
  page,
  searchData,
  query,
  setQuery,
  dataKey,
  children,
  placeholder,
}) => {
  let tableContent;

  const dynamicData = data?.[dataKey] || [];

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
  } else if (dynamicData.length > 0) {
    tableContent = dynamicData.map((item, index) => children(item, index)); // Gunakan children untuk render baris
  } else {
    tableContent = (
      <tr>
        <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
          <h1 className="text-gray-900 text-sm font-normal">
            Tidak ada instansi tersedia
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
              <form onSubmit={searchData} className="relative max-w-xs w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="py-1.5 sm:py-2 px-3 ps-9 block w-full border border-obito-grey shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={placeholder}
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
            <div className="py-1 px-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-800 whitespace-nowrap">
                  Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}{" "}
                </span>
              </div>
              <nav
                className="flex items-center space-x-1"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Previous"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  <span aria-hidden="true">«</span>
                  <span className="sr-only">Previous</span>
                </button>
                {Array.from({ length: pages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`min-w-10 flex justify-center items-center text-gray-800 focus:outline-hidden focus:bg-gray-100 py-2.5 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none ${
                      page === index
                        ? "bg-blue-100 text-blue-800 "
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setPage(index)}
                    aria-current={page === index ? "page" : undefined}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Next"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pages - 1))
                  }
                  disabled={page === pages - 1}
                >
                  <span className="sr-only">Next</span>
                  <span aria-hidden="true">»</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableNoAction;
