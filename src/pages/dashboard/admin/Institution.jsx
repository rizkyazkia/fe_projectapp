import React from "react";
import TableNoAction from "../../../components/dashboard/admin/TableNoAction";
import { getInstitutions } from "../../../lib/institutionsAPI";
import useSWR from "swr";

const TABLE_HEAD = ["Nama", "Alamat", "Provinsi", "Kota"];

const Institution = () => {
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [query, setQuery] = React.useState("");

  const institution = async () => {
    const response = await getInstitutions(keyword, page, limit);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  const { data, isLoading, mutate } = useSWR(
    ["institutions", keyword, page],
    () => institution()
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
        isLoading={isLoading}
        data={data}
        rows={rows}
        pages={pages}
        page={page}
        setPage={setPage}
        query={query}
        setQuery={setQuery}
        searchData={searchData}
        dataKey={"institutions"}
        placeholder="Nama, Email, Provinsi, Kota"
        content="instansi"
      >
        {(item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
              {item?.name}
            </td>
            <td className="px-6 py-4 capitalize whitespace-nowrap text-sm font-medium text-gray-800">
              {item?.address}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
              {item?.province?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
              {item?.city?.name}
            </td>
          </tr>
        )}
      </TableNoAction>
    </div>
  );
};

export default Institution;
