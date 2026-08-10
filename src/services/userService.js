import { supabase } from "../config/supabase";

const userService = {

    async getUsers() {

        return await supabase
            .from("profiles")
            .select(`
                id,
                username,
                nama,
                role,
                aktif,
                created_at
            `)
            .order("created_at", {
                ascending: false
            });

    },


    async createUser(userData) {

        return await supabase.functions.invoke(
            "create-user",
            {
                body: userData
            }
        );

    }

};

export default userService;