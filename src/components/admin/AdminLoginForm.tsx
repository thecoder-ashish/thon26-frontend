import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
// import { BrowserRouter as Route, Link } from "react-router-dom";
import axios , { AxiosError } from "axios";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook from react-router-dom
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth"
import { Loader2 } from "lucide-react"

import { useState } from 'react';


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
const FormSchema = z.object({
 
username: z.string().min(4, {
    message: "username must be at least 4 characters..",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  })
})
 
import { getBackendUrl } from "@/lib/api";

export function AdminLoginForm() {
  const { toast } = useToast()
  const navigate = useNavigate(); // This is the correct way to get the navigate function
  const { login } = useAuth();  // Call the hook at the component level
  const [isLoading, setIsLoading] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    try {
      const backendUrl = getBackendUrl();
      const response = await axios.post(`${backendUrl}/admin/login`, data);

      if (response.status === 200) {
        const token = response.data.accessToken;
        const role = response.data.role || "admin";
        const username = data.username;
        login(token, role, username);

        toast({
          title: "Login successful",
          description: `Logged in as ${role === "poc" ? "POC Admin" : "Administrator"}`,
        });

        if (role === "poc") {
          navigate("/admin/dashboard?tab=4");
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.data.message,
        });
      }
    } catch (error) {
      let errorMessage = "Something went wrong!";
      
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          errorMessage = typeof axiosError.response.data === 'string'
              ? axiosError.response.data
              : JSON.stringify(axiosError.response.data);
      }
      
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        
      });
    }
    finally {
        // Set isLoading to false once the request has finished
        setIsLoading(false);
      }

};
  
  return (
    
    <Form {...form}>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4   ">
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        


    <Button type="submit" disabled={isLoading}  className="w-full  mt-10  ">      { isLoading && <Loader2 className=" mr-1 h-4 w-4 animate-spin" /> }

    {isLoading ? "Logging In..." : "Login"} </Button>

      </form>
      
      
    </Form>


  )
}
