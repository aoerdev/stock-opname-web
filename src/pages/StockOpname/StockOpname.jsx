import { useState } from "react";

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

    const [barang, setBarang] = useState([]);
    const [checkedBarang, setCheckedBarang] = useState([]);

    const [selectedBarang, setSelectedBarang] = useState(null);

const [qtyFisik, setQtyFisik] = useState("");

const [catatan, setCatatan] = useState("");

    async function handleSearch(value){

        setSearch(value);

        if(value.length < 2){

            setBarang([]);

            return;

        }

        const { data, error } = await stockOpnameService.searchBarang(value);

        if(error){

            console.error(error);

            return;

        }

        const tanggal = new Date().toISOString().slice(0,10);

const hasil = await Promise.all(

    data.map(async(item)=>{

        const { data:cek } = await stockOpnameService.checkToday(

            item.id,
            user.id,
            tanggal

        );

        return {

            ...item,

            checked:!!cek,

            qty_today:cek?.qty_fisik ?? null

        };

    })

);

setBarang(hasil);

    }

    async function handleSave(){

    if(!selectedBarang){

        Swal.fire(
            "Peringatan",
            "Pilih barang terlebih dahulu.",
            "warning"
        );

        return;

    }

    if(qtyFisik===""){

        Swal.fire(
            "Peringatan",
            "Qty Fisik wajib diisi.",
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

    const data={

        master_barang_id:selectedBarang.id,

        tanggal:new Date().toISOString().slice(0,10),

        qty_fisik:Number(qtyFisik),

        catatan,

        user_id:user.id

    };

    console.log("USER :", user);
console.log("DATA :", data);
    const {error}=await stockOpnameService.saveStockOpname(data);

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
        "Stock Opname berhasil disimpan.",
        "success"
    );

    setQtyFisik("");

    setCatatan("");

    setSelectedBarang(null);

    setBarang([]);

    setSearch("");

}
    const columns = [

    {
        header:"PLU",
        accessor:"plu"
    },

    {
        header:"Nama Barang",
        accessor:"nama_barang"
    },

   {
    header:"Status",
    accessor:(row)=>

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
        header:"Aksi",
        accessor:(row)=>(

          <button

    className={

        row.checked

        ?

        "lihat-btn"

        :

        "pilih-btn"

    }

    onClick={()=>setSelectedBarang(row)}

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

    return(

        <>

            <PageHeader
                title="📦 Stock Opname"
                subtitle="Cari barang berdasarkan PLU atau Nama Barang."
            />

            <Card>

                <SearchInput
                    placeholder="Cari PLU atau Nama Barang..."
                    value={search}
                    onChange={(e)=>handleSearch(e.target.value)}
                />

            </Card>

            <br/>

            <Card title="Hasil Pencarian">
{
    selectedBarang && (

        <>
            <br/>

            <Card title="Input Stock Opname">

                <div className="detail-grid">

                    <div>

                        <label>PLU</label>

                        <input
                            value={selectedBarang.plu}
                            disabled
                        />

                    </div>

                    <div>

                        <label>Nama Barang</label>

                        <input
                            value={selectedBarang.nama_barang}
                            disabled
                        />

                    </div>

                    <div>

                        <label>Lokasi</label>

                        <input
                            value={selectedBarang.lokasi ?? "-"}
                            disabled
                        />

                    </div>

                    <div>

                        <label>Qty Fisik</label>

                        <input

                            type="number"

                            value={qtyFisik}

                            onChange={(e)=>setQtyFisik(e.target.value)}

                        />

                    </div>

                    <div className="full-width">

                        <label>Catatan</label>

                        <textarea

                            rows="3"

                            value={catatan}

                            onChange={(e)=>setCatatan(e.target.value)}

                        />

                    </div>

                </div>

                <br/>

               <div className="action-button">

    <button
        className="cancel-btn"
        onClick={() => {

            setSelectedBarang(null);
            setQtyFisik("");
            setCatatan("");

        }}
    >
        Batal
    </button>

    <button
        className="save-btn"
        onClick={handleSave}
    >
        Simpan Stock Opname
    </button>

</div>

            </Card>

        </>

    )
}
             {
    !selectedBarang && (

        <Table
            columns={columns}
            data={barang}
            emptyMessage="Belum ada hasil pencarian."
        />

    )
}

            </Card>

        </>

    )

}


export default StockOpname;