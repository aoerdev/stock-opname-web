import { useEffect, useState } from "react";

import Card from "../../components/ui/Card/Card";
import SearchInput from "../../components/ui/SearchInput/SearchInput";
import Table from "../../components/ui/Table/Table";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import barangService from "../../services/barangService";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "./MasterBarang.css";

function MasterBarang() {

    const [barang, setBarang] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {

        loadBarang();

    }, []);

    async function loadBarang() {

        setLoading(true);

        const { data, error } = await barangService.getBarang();

        if (error) {

            console.error(error);

        } else {

            setBarang(data);

        }

        setLoading(false);

    }

async function handleDelete(row){

    
    console.log("DELETE CLICK", row);
console.log("ID =", row.id);

    const result = await Swal.fire({

        title:"Hapus Barang",

        html:`
            <b>${row.nama_barang}</b>
            <br/>
            PLU : ${row.plu}
        `,

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Hapus",

        cancelButtonText:"Batal",

        confirmButtonColor:"#dc2626"

    });

    console.log("SWEETALERT RESULT", result);

    if(!result.isConfirmed) return;

    console.log("DELETE DATABASE");

    const { error } = await barangService.deleteBarang(row.id);

    console.log("DELETE ERROR", error);

    if(error){

        Swal.fire(
            "Error",
            error.message,
            "error"
        );

        return;
    }

    Swal.fire(
        "Berhasil",
        "Barang berhasil dihapus.",
        "success"
    );

    loadBarang();

}
    const filteredBarang = barang.filter((item) => {

        const keyword = search.toLowerCase();

        return (

            item.plu.toLowerCase().includes(keyword) ||

            item.nama_barang.toLowerCase().includes(keyword)

        );

    });

    const totalPages = Math.ceil(
  filteredBarang.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const currentData = filteredBarang.slice(
  startIndex,
  startIndex + rowsPerPage
);

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

  {
    header: "Status",
    accessor: (row) => row.aktif ? "Aktif" : "Nonaktif",
  },

  {
    header: "Aksi",
    accessor: (row) => (
      <button
        className="delete-btn"
        onClick={() => handleDelete(row)}
      >
        <Trash2 size={18} />
      </button>
    ),
  },

];

  return (
  <>
    <PageHeader
      title="📦 Master Barang"
      subtitle="Kelola seluruh master barang untuk proses stock opname."
    />

    <div className="master-toolbar">

      <div className="master-search">
        <SearchInput
          placeholder="Cari PLU atau Nama Barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="master-summary">

        <div className="summary-number">
          {filteredBarang.length}
        </div>

        <div className="summary-title">
          Total Barang
        </div>

      </div>

    </div>

    <Card title="Daftar Barang">

      {loading ? (

        <p>Loading...</p>

      ) : (

        <Table
    columns={columns}
    data={currentData}
/>

      )}
<div className="pagination">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Prev
  </button>

  <span>

    Halaman {currentPage} / {totalPages || 1}

  </span>

  <button
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>

  <select
    value={rowsPerPage}
    onChange={(e) => {

      setRowsPerPage(Number(e.target.value));

      setCurrentPage(1);

    }}
  >

    <option value={10}>10</option>

    <option value={25}>25</option>

    <option value={50}>50</option>

    <option value={100}>100</option>

  </select>

</div>
    </Card>
  </>
);

}

export default MasterBarang;