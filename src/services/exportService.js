import { supabase } from "../config/supabase";

const exportService = {

    async getExportData(tanggal) {

        return await supabase
            .from("stock_opname")
            .select(`
                qty_fisik,
                tanggal,
                catatan,
                created_at,
                profiles(
                    nama
                ),
                master_barang(
                    plu,
                    nama_barang,
                    lokasi
                )
            `)
            .eq("tanggal", tanggal)
            .order("created_at", {
                ascending: true
            });

    }

};

export default exportService;