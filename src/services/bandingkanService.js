import { supabase } from "../config/supabase";

const bandingkanService = {

 async getDataBanding(tanggal) {

    return await supabase
        .from("stock_opname")
        .select(`
            tanggal,
            qty_fisik,
            user_id,
            master_barang_id,
            master_barang(
                id,
                plu,
                nama_barang,
                lokasi,
                qty_system
            )
        `)
        .eq("tanggal", tanggal);

},
 async prosesBandingkan(tanggal) {

    const { data, error } =
        await this.getDataBanding(tanggal);

    if (error) {
        return { error };
    }

   const hasil = data.map((item) => ({

    master_barang_id: item.master_barang_id,

    tanggal: item.tanggal,

    user_id: item.user_id,

    qty_system: item.master_barang.qty_system,

    qty_fisik: item.qty_fisik,

    selisih:
        item.qty_fisik -
        item.master_barang.qty_system,

}));

  

   return await supabase
    .from("hasil_stock_opname")
    .upsert(hasil, {
        onConflict: "master_barang_id,tanggal",
    });


}

  

};

export default bandingkanService;