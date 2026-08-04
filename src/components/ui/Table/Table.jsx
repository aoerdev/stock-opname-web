import "./Table.css";

function Table({
  columns = [],
  data = [],
  emptyMessage = "Belum ada data.",
}) {
  return (
    <div className="table-container">
      <table className="custom-table">

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="table-empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.accessor}>
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}

        </tbody>

      </table>
    </div>
  );
}

export default Table;