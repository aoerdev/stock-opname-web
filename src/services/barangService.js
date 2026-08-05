import { supabase } from "../config/supabase";

const barangService = {
  async getBarang() {
    return await supabase
      .from("master_barang")
      .select("*")
      .order("plu");
  },

  async importBarang(data) {
    return await supabase
      .from("master_barang")
      .upsert(data, {
        onConflict: "plu",
      });
  },

  async deleteBarang(id) {
  return await supabase
    .from("master_barang")
    .delete()
    .eq("id", id);
  }
};

export default barangService;