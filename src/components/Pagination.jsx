import React from "react";

const Pagination = ({ rows, page, pages, setPage }) => {
  return (
    <div className="py-1 px-4 flex items-center justify-between">
      <div>
        <span className="text-sm text-gray-800 whitespace-nowrap">
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}{" "}
        </span>
      </div>
      <nav
        className="flex items-center space-x-1"
        aria-label="Pagination"
        key={rows}
      >
        <button
          type="button"
          className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Previous"
          onClick={() => setPage(Math.max(page - 1, 0))}
          disabled={page === 0}
        >
          <span aria-hidden="true">«</span>
          <span className="sr-only">Previous</span>
        </button>
        {Array.from({ length: pages }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`min-w-10 flex justify-center items-center text-gray-800 focus:outline-hidden focus:bg-blue-100 py-2.5 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none ${
              page === index
                ? "bg-blue-100 text-blue-800 "
                : "hover:bg-gray-200"
            }`}
            onClick={() => setPage(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          type="button"
          className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Next"
          onClick={() => setPage(Math.min(page + 1, pages - 1))}
          disabled={page === pages - 1}
        >
          <span className="sr-only">Next</span>
          <span aria-hidden="true">»</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
