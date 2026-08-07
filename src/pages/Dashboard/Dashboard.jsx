import { useEffect, useState } from "react";
import Card from "../../components/ui/Card/Card";
import StatCard from "../../components/ui/StatCard/StatCard";
import Table from "../../components/ui/Table/Table";
import dashboardService from "../../services/dashboardService";
import bandingkanService from "../../services/bandingkanService";
import Swal from "sweetalert2";
import {
  Package,
  ClipboardCheck,
  Clock3,
  Target,
} from "lucide-react";

import "../../styles/dashboard.css";
const columns = [

  {
    header: "PLU",
    accessor: (row) => row.master_barang?.plu
  },

  {
    header: "Nama Barang",
    accessor: (row) => row.master_barang?.nama_barang
  },

  {
    header: "Qty System",
    accessor: "qty_system"
  },

  {
    header: "Qty Fisik",
    accessor: "qty_fisik"
  },

  {
    header: "Selisih",
    render: (row) => (

      <span
        style={{
          padding: "5px 12px",
          borderRadius: "999px",
          fontWeight: "bold",
          backgroundColor:
            row.selisih === 0
              ? "#DCFCE7"
              : "#FEE2E2",
          color:
            row.selisih === 0
              ? "#166534"
              : "#B91C1C"
        }}
      >
        {row.selisih}
      </span>

    )
  },

  {
    header: "Petugas",
    accessor: (row) => row.profiles?.nama
  }

];

const data = [];

function Dashboard() {
  const [totalBarang, setTotalBarang] = useState(0);

  const [sudahSO, setSudahSO] = useState(0);

  const [petugas, setPetugas] = useState(0);

  const [riwayat, setRiwayat] = useState([]);

  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {

    loadDashboard();

  }, []);
  async function prosesBanding() {

    const { error } =
      await bandingkanService.prosesBandingkan(tanggal);

    if (error) {

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message
      });

      return;

    }

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data berhasil dibandingkan."
    });

    loadDashboard();

  }
  async function loadDashboard() {



    const { count: total } =
      await dashboardService.getTotalBarang();

    const { count: so } =
      await dashboardService.getSudahSO(tanggal);

    const { data: users } =
      await dashboardService.getTotalPetugas(tanggal);


    const { data: detail, error } =
      await dashboardService.getHasilBanding(tanggal);
    setTotalBarang(total);

    setSudahSO(so);

    setPetugas(
      [...new Set(users.map(x => x.user_id))].length
    );
    setRiwayat(detail ?? []);
  }
  return (
    <>

      <div className="dashboard-welcome">

        <h1>
          Halo, AO'ER
        </h1>

        <p>
          Selamat datang di aplikasi Stock Opname Web.
        </p>

      </div>


      <div className="stats-grid">

        <StatCard
          title="Total Barang"
          value={totalBarang}
          icon={<Package size={20} />}
        />

        <StatCard
          title="Sudah Input"
          value={sudahSO}
          variant="success"
          icon={<ClipboardCheck size={20} />}
        />

        <StatCard
          title="Belum Input"
          value={totalBarang - sudahSO}
          variant="warning"
          icon={<Clock3 size={20} />}
        />

        <StatCard
          title="Petugas"
          value={petugas}
          variant="primary"
          icon={<Target size={20} />}
        />

      </div>
      <div className="dashboard-filter">

        <div className="filter-left">

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />

          <button onClick={loadDashboard}>
            Tampilkan
          </button>

        </div>

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            onClick={prosesBanding}
          >
            Proses Bandingkan
          </button>

          <button className="export-btn">
            Export Excel
          </button>

        </div>

      </div>
      <Card title="Hasil Perbandingan">

        <Table

          columns={columns}

          data={riwayat}

        />

      </Card>

    </>
  );
}

export default Dashboard;