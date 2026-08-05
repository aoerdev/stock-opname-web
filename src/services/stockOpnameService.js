import { supabase } from "../config/supabase";

const stockOpnameService = {

  // Cari berdasarkan PLU atau Nama Barang
  async searchBarang(keyword) {

    return await supabase
      .from("master_barang")
      .select("*")
      .or(`plu.ilike.%${keyword}%,nama_barang.ilike.%${keyword}%`)
      .eq("aktif", true)
      .order("nama_barang");

  },

  // Ambil 1 barang berdasarkan PLU
  async getBarangByPlu(plu) {

    return await supabase
      .from("master_barang")
      .select("*")
      .eq("plu", plu)
      .single();

  },

  // Simpan Stock Opname
  async saveStockOpname(data) {

    return await supabase
      .from("stock_opname")
     .upsert(data, {
  onConflict: "master_barang_id,tanggal",
});

  },

  // Riwayat Stock Opname Hari Ini
  async getTodayStockOpname(userId, tanggal) {

    return await supabase
      .from("stock_opname")
      .select(`
        *,
        master_barang (
          plu,
          nama_barang,
          lokasi
        )
      `)
      .eq("user_id", userId)
      .eq("tanggal", tanggal)
      .order("created_at", {
        ascending: false,
      });

  },
async checkToday(masterBarangId, userId, tanggal) {

    return await supabase
        .from("stock_opname")
        .select("*")
        .eq("master_barang_id", masterBarangId)
        .eq("user_id", userId)
        .eq("tanggal", tanggal)
        .maybeSingle();

},
async getTotalBarang() {

    return await supabase
        .from("master_barang")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("aktif", true);

},

async getTotalSOHariIni(tanggal) {

    return await supabase
        .from("stock_opname")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("tanggal", tanggal);

},
};

export default stockOpnameService;