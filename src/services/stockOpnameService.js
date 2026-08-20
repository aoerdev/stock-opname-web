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

  async saveStockOpname(data) {

    console.log("DATA YANG DIKIRIM:", data);

    const result = await supabase
      .from("stock_opname")
      .upsert(
        data,
        {
          onConflict: "master_barang_id,user_id,tanggal"
        }
      );

    console.log("HASIL UPSERT:", result);

    return result;

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
  async getBarangBelumSO(userId, tanggal) {

    const { data: semuaBarang, error: barangError } =
      await supabase
        .from("master_barang")
        .select("*")
        .eq("aktif", true)
        .order("nama_barang");

    if (barangError) {

      return {
        data: null,
        error: barangError
      };

    }


    const { data: barangSO, error: soError } =
      await supabase
        .from("stock_opname")
        .select("master_barang_id")
        .eq("user_id", userId)
        .eq("tanggal", tanggal);


    if (soError) {

      return {
        data: null,
        error: soError
      };

    }


    const soIds =
      new Set(
        barangSO.map(
          item => item.master_barang_id
        )
      );


    const belumSO =
      semuaBarang.filter(
        item => !soIds.has(item.id)
      );


    return {
      data: belumSO,
      error: null
    };

  },


  // Cek apakah barang sudah di-SO hari ini
  async checkToday(masterBarangId, userId, tanggal) {

    return await supabase
      .from("stock_opname")
      .select("*")
      .eq("master_barang_id", masterBarangId)
      .eq("user_id", userId)
      .eq("tanggal", tanggal)
      .maybeSingle();

  },


  // Total master barang aktif
  async getTotalBarang() {

    return await supabase
      .from("master_barang")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq("aktif", true);

  },


  // Total barang yang sudah SO hari ini
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