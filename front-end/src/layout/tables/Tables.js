import React, { useEffect, useState } from "react";
import { listTables } from "../../utils/api";

function Tables() {
  const [tableList, setTableList] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    async function loadTables() {
      try {
        const response = await listTables();
        setTableList(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

  const tableChoice = tableList.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return tableChoice;
}

export default Tables;
