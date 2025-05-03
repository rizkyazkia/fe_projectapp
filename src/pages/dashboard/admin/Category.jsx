import React from "react";
import TableNoAction from "../../../components/dashboard/admin/TableNoAction";
import { getCategories } from "../../../lib/admin/category/categoriesAPI";
import useSWR from "swr";

const TABLE_HEAD = ["No", "Kategori"];

const Category = () => {
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");

  const category = async () => {
    const response = await getCategories(keyword, page, limit);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(
    ["categories", keyword, page],
    () => category()
  );

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };

  React.useEffect(() => {
    mutate();
  }, [keyword, page, mutate]);

  return (
    <div>
      <TableNoAction
        TABLE_HEAD={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        pages={pages}
        rows={rows}
        query={query}
        setQuery={setQuery}
        searchData={searchData}
        dataKey={"categories"}
        placeholder="Kategori"
      >
        {(item, index) => (
          <tr key={item.id}>
            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
              {index + 1}
            </td>
            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
              {item?.name}
            </td>
          </tr>
        )}
      </TableNoAction>
    </div>
  );
};

export default Category;
