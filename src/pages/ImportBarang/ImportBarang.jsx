import { useRef, useState } from "react";
import Swal from "sweetalert2";

import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import Table from "../../components/ui/Table/Table";

import { readExcel } from "../../utils/excel";
import barangService from "../../services/barangService";

import "./ImportBarang.css";

function ImportBarang() {
  const inputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      header: "PLU",
      accessor: "plu",
    },
    {
      header: "Nama Barang",
      accessor: "nama_barang",
    },
    {
      header: "Lokasi",
      accessor: "lokasi",
    },
  ];

  const handleFile = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    try {
      const data = await readExcel(file);
      setPreviewData(data);
    } catch {
      Swal.fire(
        "Error",
        "Gagal membaca file Excel.",
        "error"
      );
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      Swal.fire(
        "Peringatan",
        "Belum ada data untuk diimport.",
        "warning"
      );
      return;
    }

    const confirm = await Swal.fire({
      title: "Import Barang",
      text: `Yakin ingin mengimport ${previewData.length} barang?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Import",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    const { error } = await barangService.importBarang(previewData);

    setLoading(false);

    if (error) {
      Swal.fire(
        "Error",
        error.message,
        "error"
      );
      return;
    }

    Swal.fire(
      "Berhasil",
      `${previewData.length} barang berhasil diimport.`,
      "success"
    );

    setPreviewData([]);
    setFileName("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <Card title="Import Master Barang">

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFile}
        />

        <div
          className="upload-box"
          onClick={() => inputRef.current.click()}
        >
          <div className="upload-icon">
            📄
          </div>

          <h3>Pilih File Excel</h3>

          <p>
            Klik untuk memilih file
          </p>

          <small>
            Format .xlsx / .xls
          </small>
        </div>

        {fileName && (
          <div className="file-info">

            <h4>{fileName}</h4>

            <p>

              {previewData.length} Barang ditemukan

            </p>

          </div>
        )}

        <div className="import-button">

          <Button
            onClick={handleImport}
            disabled={loading}
          >
            {loading
              ? "Mengimport..."
              : "Import Barang"}
          </Button>

        </div>

      </Card>

      <br />

      <Card title="Preview Data">

        <Table
          columns={columns}
          data={previewData}
        />

      </Card>

    </>
  );
}

export default ImportBarang;