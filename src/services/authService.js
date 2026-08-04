import { supabase } from "../config/supabase";

const authService = {
  async loginByUsername(username, password) {
    const email = `${username}@stockopname.local`;

    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async logout() {
    return await supabase.auth.signOut();
  },

  async getSession() {
    return await supabase.auth.getSession();
  },

  async getUser() {
    return await supabase.auth.getUser();
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;