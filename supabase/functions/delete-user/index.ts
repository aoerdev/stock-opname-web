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

        const { user_id } = await req.json();


        if (!user_id) {

            return new Response(
                JSON.stringify({
                    error: "User ID wajib diisi.",
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


        // Admin client
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );


        // Hapus profile terlebih dahulu
        const {
            error: profileError
        } = await supabaseAdmin
            .from("profiles")
            .delete()
            .eq("id", user_id);


        if (profileError) {

            return new Response(
                JSON.stringify({
                    error: profileError.message,
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


        // Hapus user dari Supabase Auth
        const {
            error: authError
        } =
            await supabaseAdmin.auth.admin.deleteUser(
                user_id
            );


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


        return new Response(
            JSON.stringify({
                success: true,
                message: "User berhasil dihapus.",
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
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
                    "Content-Type": "application/json",
                },
            }
        );

    }

});