import React from "react";
import { HSStaticMethods } from "preline/preline";
import { NavLink, Outlet } from "react-router-dom";
import { getCategories } from "../../../lib/admin/category/categoriesAPI";
import useSWR from "swr";

const Question = () => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const category = async () => {
    const response = await getCategories();
    return response.data.categories;
  };

  const { data, isLoading } = useSWR("categories", category);

  let tabContent = null;

  if (isLoading) {
    const loadingTabs = [...Array(5)].map((_, index) => (
      <div
        key={index}
        className="bg-obito-grey/50 rounded-t-lg animate-pulse -mb-px py-3 px-4 w-56"
      ></div>
    ));

    tabContent = (
      <div className="hidden lg:block border-b border-gray-200">
        <nav
          className="flex gap-x-2 flex-wrap"
          aria-label="Tabs"
          data-hs-tab-select="#tab-select"
        >
          {loadingTabs}
        </nav>
      </div>
    );
  } else if (data && data.length > 0) {
    tabContent = data.map((item) => (
      <NavLink
        key={item.id}
        className="hs-tab-active:bg-white hs-tab-active:border-b-transparent hs-tab-active:text-blue-600 -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border border-gray-200 text-gray-500 rounded-t-lg hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none"
        to={item.path.replace("/", "")}
        id={`hs-tab-to-select-item-${item.id}`}
        aria-selected="false"
        data-hs-tab={`#hs-tab-to-select-${item.id}`}
        aria-controls={`hs-tab-to-select-${item.id}`}
        role="tab"
      >
        {item.name}
      </NavLink>
    ));
  }

  return (
    <div>
      <div className="hs-dropdown lg:hidden relative inline-flex w-full">
        <button
          id="hs-dropdown-slideup-animation"
          type="button"
          className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none w-full"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Dropdown"
        >
          Pilih
          <div className="absolute top-1/2 end-3 -translate-y-1/2">
            <svg
              className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500"
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
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </div>
        </button>

        <div
          className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 duration-300 mt-2 min-w-60 bg-white shadow-md rounded-lg"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-dropdown-slideup-animation"
        >
          <div className="p-1 space-y-0.5">
            {data &&
              data?.length > 0 &&
              data.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path.replace("/", "")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {item.name}
                </NavLink>
              ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block border-b border-gray-200">
        <nav
          className="flex gap-2 flex-wrap"
          aria-label="Tabs"
          data-hs-tab-select="#tab-select"
        >
          {tabContent}
        </nav>
      </div>

      <div className="mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Question;
