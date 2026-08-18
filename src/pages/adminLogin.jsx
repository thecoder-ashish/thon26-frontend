import { AdminLoginForm } from "../components/admin/AdminLoginForm";
import React from "react";


function AdminLogin() {


    return (
        <>
            <div className="relative justify-center grid lg:max-w-none lg:grid-cols-2 p-0" style={{ height: 'calc(100vh - 80px)' }}>



                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 mt-auto">


                    </div>

                </div>
                <div className="lg:p-8 mt-20 ">
                    <div className="mx-auto w-screen flex px-16  sm:px-0 flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex w-full flex-col space-y-2 pt-10 md:pt-6  text-center">
                            <h1 className="text-2xl w-full font-semibold tracking-tight">
                                Login into admin panel
                            </h1>
                            
                        </div >
                        <AdminLoginForm className="" />

                    </div>

                </div>
            </div>
        </>
    );
}

export default AdminLogin;
