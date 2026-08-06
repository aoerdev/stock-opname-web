import { useState } from "react";

import PageHeader from "../../components/ui/PageHeader/PageHeader";
import Card from "../../components/ui/Card/Card";

import "./Export.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import exportService from "../../services/exportService";
function Export() {

    const [tanggal, setTanggal] = useState(
        new Date().toISOString().slice(0, 10)
    );
    async function handleExport() {

        const { data, error } =
            await exportService.getExportData(tanggal);

        if (error) {

            console.error(error);

            return;

        }

        const excelData = data.map((item, index) => ({

            No: index + 1,

            PLU: item.master_barang?.plu,

            "Nama Barang": item.master_barang?.nama_barang,

            Lokasi: item.master_barang?.lokasi,

            "Qty Fisik": item.qty_fisik,

            Petugas: item.profiles?.nama,

            Catatan: item.catatan,

            Tanggal: item.tanggal,

            Jam: new Date(item.created_at).toLocaleTimeString("id-ID")

        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Stock Opname"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array"
            }
        );

        const blob = new Blob(
            [excelBuffer],
            {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

        saveAs(
            blob,
            `Stock_Opname_${tanggal}.xlsx`
        );

    }
    return (

        <>

            <PageHeader
                title="📤 Export Stock Opname"
                subtitle="Export hasil stock opname berdasarkan tanggal."
            />

            <Card>

                <div className="dashboard-filter">

                    <div className="filter-left">

                        <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                        />

                    </div>

                    <button
                        className="export-btn"
                        onClick={handleExport}
                    >

                        Export Excel

                    </button>

                </div>

            </Card>

        </>

    );

}

export default Export;