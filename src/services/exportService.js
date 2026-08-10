import { supabase } from "../config/supabase";

const exportService = {

    async getExportData(tanggal) {

        return await supabase
            .from("hasil_stock_opname")
            .select(`
                tanggal,
                qty_system,
                qty_fisik,
                selisih,
                user_id,

                profiles:profiles!hasil_stock_opname_user_fk(
                    nama
                ),

                master_barang:master_barang!hasil_stock_opname_master_barang_fk(
                    plu,
                    nama_barang,
                    lokasi
                )
            `)
            .eq("tanggal", tanggal)
            .order("master_barang_id", {
                ascending: true
            });

    }

};

export default exportService;