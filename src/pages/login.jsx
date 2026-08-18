import { LoginForm } from "../components/LoginForm";
import React from "react";


function LoginPage() {


  return (
    <>
      <div className="relative justify-center grid lg:max-w-none lg:grid-cols-2 p-0" style={{ height: 'calc(100vh - 80px)' }}>
      
        

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>

        </div>
        <div className="lg:p-8 mt-20 ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 pt-10 md:pt-6  text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login into account
                </h1>
                <p className="text-sm text-muted-foreground px-8 mx-auto">
                Enter your Mobile no. below to login 
              </p>
            </div>
            <LoginForm />

          </div>

        </div>
      </div> 
    </>
  );
}

export default LoginPage;
