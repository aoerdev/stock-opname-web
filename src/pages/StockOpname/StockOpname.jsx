import { useEffect, useState } from "react";

import PageHeader from "../../components/ui/PageHeader/PageHeader";
import Card from "../../components/ui/Card/Card";
import SearchInput from "../../components/ui/SearchInput/SearchInput";
import Table from "../../components/ui/Table/Table";
import Swal from "sweetalert2";

import stockOpnameService from "../../services/stockOpnameService";
import useAuth from "../../hooks/useAuth";

import "./StockOpname.css";

function StockOpname() {

    const { user } = useAuth();

    const [search, setSearch] = useState("");
    const [totalBarang, setTotalBarang] = useState(0);
    const [totalSO, setTotalSO] = useState(0);

    const [barang, setBarang] = useState([]);

    const [showBelumSO, setShowBelumSO] =
        useState(false);

    const [selectedBarang, setSelectedBarang] =
        useState(null);

    const [qtyGudang, setQtyGudang] =
        useState("");

    const [qtyRak, setQtyRak] =
        useState("");

    const [catatan, setCatatan] =
        useState("");


    useEffect(() => {

        if (user) {

            loadProgress();

        }

    }, [user]);


    // =========================
    // CARI BARANG
    // =========================

    async function handleSearch(value) {

        setSearch(value);

        setShowBelumSO(false);

        if (value.length < 2) {

            setBarang([]);

            return;

        }

        const { data, error } =
            await stockOpnameService.searchBarang(
                value
            );

        if (error) {

            console.error(error);

            return;

        }

        const tanggal =
            new Date()
                .toISOString()
                .slice(0, 10);


        const hasil = await Promise.all(

            data.map(async (item) => {

                const { data: cek } =
                    await stockOpnameService.checkToday(

                        item.id,
                        user.id,
                        tanggal

                    );

                return {

                    ...item,

                    checked: !!cek,

                    qty_gudang_today:

                        cek?.qty_gudang === null ||
                            cek?.qty_gudang === undefined

                            ? ""

                            : cek.qty_gudang,


                    qty_rak_today:

                        cek?.qty_rak === null ||
                            cek?.qty_rak === undefined

                            ? ""

                            : cek.qty_rak,


                    catatan_today:

                        cek?.catatan ?? ""

                };

            })

        );

        setBarang(hasil);

    }


    // =========================
    // BARANG BELUM SO
    // =========================

    async function handleBelumSO() {

        if (!user) {

            Swal.fire(
                "Error",
                "User login tidak ditemukan.",
                "error"
            );

            return;

        }


        const tanggal =
            new Date()
                .toISOString()
                .slice(0, 10);


        const { data, error } =
            await stockOpnameService.getBarangBelumSO(
                tanggal
            );


        if (error) {

            Swal.fire(
                "Error",
                error.message,
                "error"
            );

            return;

        }


        const hasil = data.map((item) => ({

            ...item,

            checked: false,

            qty_gudang_today: "",

            qty_rak_today: "",

            catatan_today: ""

        }));


        setBarang(hasil);

        setShowBelumSO(true);

        setSelectedBarang(null);

        setSearch("");

    }


    // =========================
    // SIMPAN STOCK OPNAME
    // =========================

    async function handleSave() {

        if (!selectedBarang) {

            Swal.fire(
                "Peringatan",
                "Pilih barang terlebih dahulu.",
                "warning"
            );

            return;

        }


        if (!user) {

            Swal.fire(
                "Error",
                "User login tidak ditemukan.",
                "error"
            );

            return;

        }


        if (
            qtyGudang === "" &&
            qtyRak === ""
        ) {

            Swal.fire(
                "Peringatan",
                "Isi Qty Gudang atau Qty Rak terlebih dahulu.",
                "warning"
            );

            return;

        }


        const gudang =

            qtyGudang === ""

                ? null

                : Number(qtyGudang);


        const rak =

            qtyRak === ""

                ? null

                : Number(qtyRak);


        const qtyFisik =

            (gudang ?? 0) +
            (rak ?? 0);


        const data = {

            master_barang_id:
                selectedBarang.id,

            tanggal:
                new Date()
                    .toISOString()
                    .slice(0, 10),

            qty_gudang:
                gudang,

            qty_rak:
                rak,

            qty_fisik:
                qtyFisik,

            catatan,

            user_id:
                user.id

        };


        const { error } =
            await stockOpnameService.saveStockOpname(
                data
            );


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
            "Stock Opname berhasil disimpan.",
            "success"
        );


        await loadProgress();


        setQtyGudang("");

        setQtyRak("");

        setCatatan("");

        setSelectedBarang(null);

        setBarang([]);

        setSearch("");

        setShowBelumSO(false);

    }


    // =========================
    // LOAD PROGRESS
    // =========================

    async function loadProgress() {

        const tanggal =
            new Date()
                .toISOString()
                .slice(0, 10);


        const barang =
            await stockOpnameService.getTotalBarang();


        const so =
            await stockOpnameService.getTotalSOHariIni(
                tanggal
            );


        setTotalBarang(barang.count);

        setTotalSO(so.count);

    }


    // =========================
    // PILIH BARANG
    // =========================

    function pilihBarang(row) {

        setSelectedBarang(row);

        setQtyGudang(
            row.qty_gudang_today ?? ""
        );

        setQtyRak(
            row.qty_rak_today ?? ""
        );

        setCatatan(
            row.catatan_today ?? ""
        );

    }


    // =========================
    // KOLOM TABEL
    // =========================

    const columns = [

        {
            header: "PLU",
            accessor: "plu"
        },

        {
            header: "Nama Barang",
            accessor: "nama_barang"
        },

        {
            header: "Status",

            accessor: (row) =>

                row.checked

                    ?

                    <span className="badge-success">
                        ✔ Sudah
                    </span>

                    :

                    <span className="badge-secondary">
                        Belum
                    </span>

        },

        {
            header: "Aksi",

            accessor: (row) => (

                <button

                    className={

                        row.checked

                            ?

                            "lihat-btn"

                            :

                            "pilih-btn"

                    }

                    onClick={() =>
                        pilihBarang(row)
                    }

                >

                    {

                        row.checked

                            ?

                            "Lihat"

                            :

                            "Pilih"

                    }

                </button>

            )

        }

    ];


    const totalFisik =

        (qtyGudang === ""

            ? 0

            : Number(qtyGudang))

        +

        (qtyRak === ""

            ? 0

            : Number(qtyRak));


    return (

        <>

            <PageHeader

                title="📦 Stock Opname"

                subtitle="
                    Cari barang berdasarkan PLU atau Nama Barang.
                "

            />


            {/* =========================
                PROGRESS
            ========================= */}

            <div className="progress-wrapper">

                <div className="progress-card">

                    <h4>✔ Sudah SO</h4>

                    <h2>{totalSO}</h2>

                    <span>PLU</span>

                </div>


                <div className="progress-card">

                    <h4>📦 Total Barang</h4>

                    <h2>{totalBarang}</h2>

                    <span>PLU</span>

                </div>

            </div>


            <div className="progress-bar-wrapper">

                <div

                    className="progress-bar"

                    style={{

                        width: `${totalBarang

                            ? (
                                totalSO /
                                totalBarang
                            ) * 100

                            : 0

                            }%`

                    }}

                />

            </div>


            <p className="progress-text">

                {totalSO} / {totalBarang} PLU

            </p>


            {/* =========================
                SEARCH
            ========================= */}

            <Card>

                <div className="search-action">

                    <SearchInput

                        placeholder="
                            Cari PLU atau Nama Barang...
                        "

                        value={search}

                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }

                    />


                    <button

                        className="belum-so-btn"

                        onClick={handleBelumSO}

                    >

                        📋 Belum di-SO

                    </button>

                </div>

            </Card>


            {/* =========================
                HASIL
            ========================= */}

            <Card

                title={

                    showBelumSO

                        ? "📋 Barang Belum di-SO"

                        : "Hasil Pencarian"

                }

            >

                {

                    selectedBarang && (

                        <Card

                            title={

                                selectedBarang?.checked

                                    ? "Update Stock Opname"

                                    : "Input Stock Opname"

                            }

                        >

                            <div className="detail-grid">


                                <div>

                                    <label>
                                        PLU
                                    </label>

                                    <input

                                        value={
                                            selectedBarang.plu
                                        }

                                        disabled

                                    />

                                </div>


                                <div>

                                    <label>
                                        Nama Barang
                                    </label>

                                    <input

                                        value={
                                            selectedBarang.nama_barang
                                        }

                                        disabled

                                    />

                                </div>


                                <div>

                                    <label>
                                        Lokasi
                                    </label>

                                    <input

                                        value={
                                            selectedBarang.lokasi ?? "-"
                                        }

                                        disabled

                                    />

                                </div>


                                <div>

                                    <label>
                                        Qty Gudang
                                    </label>

                                    <input

                                        type="number"

                                        min="0"

                                        placeholder="
                                            Belum diinput
                                        "

                                        value={qtyGudang}

                                        onChange={(e) =>
                                            setQtyGudang(
                                                e.target.value
                                            )
                                        }

                                    />

                                </div>


                                <div>

                                    <label>
                                        Qty Rak
                                    </label>

                                    <input

                                        type="number"

                                        min="0"

                                        placeholder="
                                            Belum diinput
                                        "

                                        value={qtyRak}

                                        onChange={(e) =>
                                            setQtyRak(
                                                e.target.value
                                            )
                                        }

                                    />

                                </div>


                                <div>

                                    <label>
                                        Total Qty Fisik
                                    </label>

                                    <input

                                        type="number"

                                        value={totalFisik}

                                        disabled

                                    />

                                </div>


                                <div className="full-width">

                                    <label>
                                        Catatan
                                    </label>

                                    <textarea

                                        rows="3"

                                        value={catatan}

                                        onChange={(e) =>
                                            setCatatan(
                                                e.target.value
                                            )
                                        }

                                    />

                                </div>

                            </div>


                            <div className="action-button">

                                <button

                                    className="cancel-btn"

                                    onClick={() => {

                                        setSelectedBarang(null);

                                        setQtyGudang("");

                                        setQtyRak("");

                                        setCatatan("");

                                    }}

                                >

                                    Batal

                                </button>


                                <button

                                    className="save-btn"

                                    onClick={handleSave}

                                >

                                    {

                                        selectedBarang?.checked

                                            ? "Update Stock Opname"

                                            : "Simpan Stock Opname"

                                    }

                                </button>

                            </div>

                        </Card>

                    )

                }


                {

                    !selectedBarang && (

                        <Table

                            columns={columns}

                            data={barang}

                            emptyMessage={

                                showBelumSO

                                    ? "Semua barang sudah di-SO 🎉"

                                    : "Belum ada hasil pencarian."

                            }

                        />

                    )

                }

            </Card>

        </>

    );

}

export default StockOpname;