import { supabase } from "../config/supabase";

const dashboardService = {

    async getTotalBarang() {

        return await supabase
            .from("master_barang")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("aktif", true);

    },

    async getSudahSO(tanggal) {

        return await supabase
            .from("stock_opname")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("tanggal", tanggal);

    },

    async getTotalPetugas(tanggal) {

        return await supabase
            .from("stock_opname")
            .select("user_id")
            .eq("tanggal", tanggal);

    },

   async getRiwayat(tanggal) {

    const result = await supabase
        .from("stock_opname")
        .select(`
            qty_fisik,
            created_at,
            user_id,
            profiles:profiles!stock_opname_user_id_fkey(
                nama,
                username
            ),
            master_barang:master_barang!stock_opname_master_barang_id_fkey(
                plu,
                nama_barang
            )
        `)
        .eq("tanggal", tanggal)
        .order("created_at", {
            ascending: false
        });

    console.log(result.data);

    return result;

},
async getHasilBanding(tanggal) {

    return await supabase
        .from("hasil_stock_opname")
        .select(`
            qty_system,
            qty_fisik,
            selisih,

            profiles:profiles!hasil_stock_opname_user_fk(
                nama,
                username
            ),

            master_barang:master_barang!hasil_stock_opname_master_barang_fk(
                plu,
                nama_barang,
                lokasi
            )
        `)
        .eq("tanggal", tanggal)
        .order("master_barang_id");

}

};

export default dashboardService;