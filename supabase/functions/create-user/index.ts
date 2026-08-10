import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {

        return new Response("ok", {
            headers: corsHeaders,
        });

    }

    try {

        const {
            email,
            password,
            username,
            nama,
            role,
            aktif,
        } = await req.json();


        // Validasi
        if (
            !email ||
            !password ||
            !username ||
            !nama ||
            !role
        ) {

            return new Response(
                JSON.stringify({
                    error: "Data user belum lengkap.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );

        }


        // Client khusus server-side
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );


        // Buat akun di Supabase Auth
        const {
            data: authData,
            error: authError,
        } =
            await supabaseAdmin.auth.admin.createUser({

                email,

                password,

                email_confirm: true,

            });


        if (authError) {

            return new Response(
                JSON.stringify({
                    error: authError.message,
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );

        }


        const userId = authData.user.id;


        // Buat profile
        const {
            error: profileError,
        } =
            await supabaseAdmin
                .from("profiles")
                .insert({

                    id: userId,

                    username,

                    nama,

                    role,

                    aktif:
                        aktif ?? true,

                });


        // Kalau profile gagal,
        // hapus user Auth agar tidak tersisa
        if (profileError) {

            await supabaseAdmin.auth.admin.deleteUser(
                userId
            );

            return new Response(
                JSON.stringify({
                    error:
                        profileError.message,
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

        }


        return new Response(
            JSON.stringify({

                success: true,

                user: {
                    id: userId,
                    email,
                    username,
                    nama,
                    role,
                    aktif:
                        aktif ?? true,
                },

            }),
            {
                status: 200,

                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },

            }
        );


    } catch (error) {

        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "Terjadi kesalahan.",
            }),
            {
                status: 500,

                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },

            }
        );

    }

});