import "./Table.css";

function Table({
    columns = [],
    data = [],
    emptyMessage = "Belum ada data."
}) {

    return (

        <div className="table-wrapper">

            <table className="table">

                <thead>

                    <tr>

                        {
                            columns.map((column, index) => (

                                <th key={index}>
                                    {column.header}
                                </th>

                            ))
                        }

                    </tr>

                </thead>

                <tbody>

                    {
                        data.length === 0
                            ?

                            (
                                <tr>

                                    <td
                                        className="table-empty"
                                        colSpan={columns.length}
                                    >

                                        {emptyMessage}

                                    </td>

                                </tr>
                            )

                            :

                            (
                                data.map((row, index) => (

                                    <tr key={index}>

                                        {
                                            columns.map((column, colIndex) => (

                                                <td key={colIndex}>

                                                    {
                                                        column.render
                                                            ?

                                                            column.render(row)

                                                            :

                                                            typeof column.accessor === "function"

                                                                ?

                                                                column.accessor(row)

                                                                :

                                                                row[column.accessor]
                                                    }

                                                </td>

                                            ))
                                        }

                                    </tr>

                                ))
                            )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Table;