import { useState } from "react";
import Swal from "sweetalert2";

import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Table from "../../components/ui/Table/Table";

import { readExcel } from "../../utils/excel";
import barangService from "../../services/barangService";

function ImportBarang() {
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

      console.log("EXCEL DATA :", data);

      setPreviewData(data);
    } catch (err) {
      console.error(err);

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

    console.log("================================");
    console.log("PREVIEW DATA");
    console.log(previewData);
    console.log("================================");

    const response = await barangService.importBarang(previewData);

    console.log("================================");
    console.log("SUPABASE RESPONSE");
    console.log(response);
    console.log("================================");

    setLoading(false);

    const { data, error } = response;

    if (error) {
      console.error(error);

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
  };

  return (
    <>
      <Card title="Import Master Barang">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
        />

        <br />

        <p>
          <strong>File :</strong> {fileName || "-"}
        </p>

        <p>
          <strong>Total Data :</strong> {previewData.length}
        </p>

        <br />

        <Button
          onClick={handleImport}
          disabled={loading}
        >
          {loading
            ? "Mengimport..."
            : "Import Barang"}
        </Button>
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