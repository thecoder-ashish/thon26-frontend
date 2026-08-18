import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { BrowserRouter as Route, Link } from "react-router-dom";
import axios , { AxiosError } from "axios";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook from react-router-dom
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth"
import { Loader2 } from "lucide-react"
import { useState } from 'react';

import {   Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
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
 
  mobile_number: z.string().min(10, {
    message: "Mobile number must be at least 10 digits.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
  roll_no: z.string().min(6, {
    message: "Name must be at least 6 characters.",
  }),
  branch: z.string(),
})
 
export function SignUpForm() {
  const { toast } = useToast()
  const navigate = useNavigate(); // This is the correct way to get the navigate function
  const { login } = useAuth();  // Call the hook at the component level
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, data);

      if (response.status === 201) {
        // Use the login function to store the JWT in local storage and update the user state
        login(response.data.accessToken);  // assuming the token is in the "accessToken" property

        toast({
          title: "Registration successful",
          description: response.data.message,
          // status: "success",
        });

        navigate("/profile");
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: response.data.message,
          // status: "error",
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
        // status: "error",
      });
    }
    finally {
      // Set isLoading to false once the request has finished
      setIsLoading(false);
    }
};
  
  return (
    
    <Form {...form}>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2  md:space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Vaibhav Meena" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
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
        <FormField
          control={form.control}
          name="roll_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll No</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<FormField 
    control={form.control}
    name="branch"
    render={({ field }) => (
        <FormItem className="pb-4">
            <FormLabel >Branch</FormLabel>
            <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Engineering Branches</SelectLabel>
                            <SelectItem value="CSE">CSE</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="ECE">ECE</SelectItem>
                            {/* Add more branches as needed */}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </FormControl>
           
            <FormMessage />

        </FormItem>
    )}
/>

    <Button type="submit" disabled={isLoading} className="w-full "> { isLoading && <Loader2 className=" mr-1 h-4 w-4 animate-spin" /> }  {isLoading ? "Creating Account..." : "Create Account"} </Button>

      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Already Have an Account?
          </span>
        </div>
      </div>
      <Link to="/login" >
      <Button variant="outline" className="w-full" type="button" >
        Login
      </Button>
      
      </Link>
    </Form>


  )
}
