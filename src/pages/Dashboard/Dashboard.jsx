import Card from "../../components/ui/Card/Card";
import StatCard from "../../components/ui/StatCard/StatCard";
import Table from "../../components/ui/Table/Table";

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
    accessor: "plu",
  },
  {
    header: "Nama Barang",
    accessor: "nama",
  },
  {
    header: "Qty",
    accessor: "qty",
  },
];

const data = [];

function Dashboard() {
  return (
    <>

      <div className="dashboard-welcome">

        <h1>
          Halo, Administrator 👋
        </h1>

        <p>
          Selamat datang di aplikasi Stock Opname Web.
        </p>

      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Barang"
          value="0"
          icon={<Package size={20} />}
        />

        <StatCard
          title="Sudah Input"
          value="0"
          variant="success"
          icon={<ClipboardCheck size={20} />}
        />

        <StatCard
          title="Belum Input"
          value="0"
          variant="warning"
          icon={<Clock3 size={20} />}
        />

        <StatCard
          title="Progress"
          value="0%"
          variant="primary"
          icon={<Target size={20} />}
        />

      </div>

      <Card title="Riwayat Input Hari Ini">

        <Table
          columns={columns}
          data={data}
        />

      </Card>

    </>
  );
}

export default Dashboard;