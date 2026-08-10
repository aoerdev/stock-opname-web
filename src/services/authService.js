import { supabase } from "../config/supabase";

const authService = {

    async loginByUsername(username, password) {

        console.log(
            "LOGIN USERNAME:",
            username
        );


        // Cari email berdasarkan username
        // lewat RPC SECURITY DEFINER
        const {
            data: email,
            error: emailError
        } = await supabase.rpc(
            "get_login_email",
            {
                p_username: username
            }
        );


        console.log(
            "AUTH EMAIL:",
            email
        );

        console.log(
            "AUTH EMAIL ERROR:",
            emailError
        );


        // RPC gagal
        if (emailError) {

            console.error(
                "GET LOGIN EMAIL ERROR:",
                emailError
            );

            return {
                error: emailError
            };

        }


        // Username tidak ditemukan
        // atau akun tidak aktif
        if (!email) {

            console.log(
                "USERNAME TIDAK DITEMUKAN / TIDAK AKTIF:",
                username
            );

            return {
                error: {
                    message:
                        "Username atau Password salah."
                }
            };

        }


        // Login ke Supabase Auth
        const result =
            await supabase.auth.signInWithPassword({

                email: email,

                password: password

            });


        console.log(
            "SUPABASE LOGIN RESULT:",
            result
        );


        return result;

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

    }

};


export default authService;