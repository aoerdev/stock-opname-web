import * as XLSX from "xlsx";

export const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, {
          type: "binary",
        });

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet);

        const data = json.map((row) => ({
          plu: String(row.PLU ?? "").trim(),
          nama_barang: String(row["Nama Barang"] ?? "").trim(),
          lokasi: String(row.Lokasi ?? "").trim(),
          aktif: true,
        }));

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;

    reader.readAsBinaryString(file);
  });
};