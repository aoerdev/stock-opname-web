import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { supabase } from "../config/supabase";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [session,setSession]=useState(null);

    const [user,setUser]=useState(null);

    const [profile,setProfile]=useState(null);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        getInitialSession();

        const {

            data:{subscription}

        }=authService.onAuthStateChange(

            async(event,session)=>{

                setSession(session);

                setUser(session?.user??null);

                if(session?.user){

                    await loadProfile(session.user.id);

                }else{

                    setProfile(null);

                }

                setLoading(false);

            }

        );

        return()=>subscription.unsubscribe();

    },[]);

    async function loadProfile(userId) {

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    console.log("PROFILE :", data);
    console.log("PROFILE ERROR :", error);

    setProfile(data);

}

    async function getInitialSession(){

        const{

            data:{session}

        }=await authService.getSession();

        setSession(session);

        setUser(session?.user??null);

        if(session?.user){

            await loadProfile(session.user.id);

        }

        setLoading(false);

    }

    return(

        <AuthContext.Provider

            value={{

                session,

                user,

                profile,

                loading

            }}

        >

            {children}

        </AuthContext.Provider>

    )

}

export default AuthProvider;