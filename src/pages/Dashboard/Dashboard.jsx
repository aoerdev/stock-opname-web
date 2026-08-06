import { useEffect, useState } from "react";
import Card from "../../components/ui/Card/Card";
import StatCard from "../../components/ui/StatCard/StatCard";
import Table from "../../components/ui/Table/Table";
import dashboardService from "../../services/dashboardService";

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
    header: "Qty",
    accessor: "qty_fisik"
  },

  {
    header: "Petugas",
    accessor: (row) => row.profiles?.nama
  },

  {
    header: "Jam",
    accessor: (row) =>
      new Date(row.created_at).toLocaleTimeString("id-ID")
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
  async function loadDashboard() {



    const { count: total } =
      await dashboardService.getTotalBarang();

    const { count: so } =
      await dashboardService.getSudahSO(tanggal);

    const { data: users } =
      await dashboardService.getTotalPetugas(tanggal);
    console.log("USERS :", users);

    const { data: detail } =
      await dashboardService.getRiwayat(tanggal);

    setTotalBarang(total);

    setSudahSO(so);

    setPetugas(
      [...new Set(users.map(x => x.user_id))].length
    );

    setRiwayat(detail);

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

        <button className="export-btn">
          Export Excel
        </button>

      </div>
      <Card title="Riwayat Input Hari Ini">

        <Table

          columns={columns}

          data={riwayat}

        />

      </Card>

    </>
  );
}

export default Dashboard;