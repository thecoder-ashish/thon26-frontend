// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table"


//   import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
//   } from "@/components/ui/alert-dialog"
  
//   const invoices = [
//     {
//       invoice: "INV001",
//       paymentStatus: "Paid",
//       totalAmount: "$250.00",
//       paymentMethod: "Credit Card",
//     },
//     {
//       invoice: "INV002",
//       paymentStatus: "Pending",
//       totalAmount: "$150.00",
//       paymentMethod: "PayPal",
//     },
//     {
//       invoice: "INV003",
//       paymentStatus: "Unpaid",
//       totalAmount: "$350.00",
//       paymentMethod: "Bank Transfer",
//     },
//     {
//       invoice: "INV004",
//       paymentStatus: "Paid",
//       totalAmount: "$450.00",
//       paymentMethod: "Credit Card",
//     },
//     {
//       invoice: "INV005",
//       paymentStatus: "Paid",
//       totalAmount: "$550.00",
//       paymentMethod: "PayPal",
//     },
//     {
//       invoice: "INV006",
//       paymentStatus: "Pending",
//       totalAmount: "$200.00",
//       paymentMethod: "Bank Transfer",
//     },
//     {
//       invoice: "INV007",
//       paymentStatus: "Unpaid",
//       totalAmount: "$300.00",
//       paymentMethod: "Credit Card",
//     },
//   ]


//   import { ScrollArea } from "@/components/ui/scroll-area"
//   import { Loader2 } from "lucide-react"
//   import { Button } from "@/components/ui/button"
//   import React, { useState } from 'react';

//   export function TableDemo() {
//     return (
//       <Table>
//         <TableCaption>A list of your recent invoices.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[100px]">Invoice</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Method</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoices.map((invoice) => (
//             <TableRow key={invoice.invoice}>
//               <TableCell className="font-medium">{invoice.invoice}</TableCell>
//               <TableCell>{invoice.paymentStatus}</TableCell>
//               <TableCell>{invoice.paymentMethod}</TableCell>
//               <TableCell className="text-right">{invoice.totalAmount}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     )
//   }
  

  
   
  
//   export function PopupDialog({ teamName,members, onResponse, showPopup }) {
    
//     // const { teamName, members } = teamData;
  
//     // console.log( teamName);
//     // console.log( members);
//     const [isLoading, setIsLoading] = useState(false);
//     const handleContinue = () => {
//         setIsLoading(true);
//         onResponse(true);
//         showPopup(false);
//         setIsLoading(false);
//     };
  
//     const handleCancel = () => {
//         // On "Cancel", send false as response
//         onResponse(false);
//         showPopup(false);
//     };
  
//     return (
//       <AlertDialog open={true} >
//         <AlertDialogContent >
//           <AlertDialogHeader>
//             <AlertDialogTitle > Team Name : {teamName}</AlertDialogTitle>
            
           
//             {/* Grid for members data */}
//             <div className=" md:hidden">
//             <ScrollArea className="h-96 overflow-auto ...  border-spacing-1 border-2 rounded-md ">
//               {/* Card-based view for mobile */}
//             <div className="space-y-4">
//               {members.map((member, index) => (
//                 <div key={index} className="border rounded-md p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="font-semibold">Name:</span>
//                     <span>{member.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-semibold">Email:</span>
//                     <span>{member.email}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-semibold">Phone:</span>
//                     <span>{member.phone}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-semibold">Branch:</span>
//                     <span>{member.branch}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-semibold">Roll No:</span>
//                     <span>{member.rollno}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             </ScrollArea>
//             </div>
//             <div className="hidden md:block">
//             <Table >
//               <TableHeader >
//                 <TableRow>
//                   <TableHead className="text-center" >Name</TableHead>
//                   <TableHead className="text-center" >Email</TableHead>
//                   <TableHead className="text-center" >Phone</TableHead>
//                   <TableHead className="text-center" >Branch</TableHead>
//                   <TableHead className="text-center"  >Roll No</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {members.map((member, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{member.name}</TableCell>
//                     <TableCell>{member.email}</TableCell>
//                     <TableCell>{member.phone}</TableCell>
//                     <TableCell>{member.branch}</TableCell>
//                     <TableCell>{member.rollno}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             </div>
            
//             {/* <AlertDialogDescription>
              
//             </AlertDialogDescription> */}
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//               <AlertDialogCancel className="md:w-20" disabled={isLoading} onClick={handleCancel}> EDIT </AlertDialogCancel>
//               <AlertDialogAction disabled={isLoading}  onClick={handleContinue}>{ isLoading && <Loader2 className=" mr-1 h-4 w-4 animate-spin" /> }
//   {isLoading ? "PLEASE WAIT" : "CONTINUE"}</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     )
//   }
  