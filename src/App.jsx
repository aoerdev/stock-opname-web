import { useEffect } from "react";
import { supabase } from "./config/supabase";
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
function App() {

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {

    const { data, error } = await supabase
      .from("master_barang")
      .select("*");

    console.log("========== TEST SUPABASE ==========");
    console.log("DATA :", data);
    console.log("ERROR :", error);

  }

  return (
    <div>
      <h1>Stock Opname Web</h1>
    </div>
  );
}

export default App;