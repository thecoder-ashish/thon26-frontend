import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
    TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

 
import { Button } from "@/components/ui/button"

export function PopupDialog({ teamName,members, onResponse, showPopup }) {
  
  // const { teamName, members } = teamData;

  // console.log( teamName);
  // console.log( members);
  const [isLoading, setIsLoading] = useState(false);
  const handleContinue = () => {
      setIsLoading(true);
      onResponse(true);
      if (typeof showPopup === "function") {
        showPopup(false);
      }
      setIsLoading(false);
  };

  const handleCancel = () => {
      // On "Cancel", send false as response
      onResponse(false);
      if (typeof showPopup === "function") {
        showPopup(false);
      }
  };

  return (
    <AlertDialog open={true} >
      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogTitle > Team Name : {teamName}</AlertDialogTitle>
          
          {/* Grid for members data */}
          {/* <div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Branch</th>
                  <th>Roll No</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={index}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.branch}</td>
                    <td>{member.rollno}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          {/* Grid for members data */}
          <div className=" md:hidden">
            <ScrollArea className="h-96 overflow-auto border-2 rounded-md p-2">
              {/* Card-based view for mobile */}
              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Role:</span>
                      <span className="font-bold">
                        {index === 0
                          ? "Leader"
                          : index === 1
                          ? "Contact 2"
                          : `Member ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Name:</span>
                      <span>{member.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Roll No:</span>
                      <span>{member.rollno}</span>
                    </div>
                    {member.email && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Email:</span>
                        <span className="break-all">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Phone:</span>
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Roll No</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold text-center">
                      {index === 0
                        ? "Leader"
                        : index === 1
                        ? "Contact 2"
                        : `Member ${index + 1}`}
                    </TableCell>
                    <TableCell className="text-center">{member.name}</TableCell>
                    <TableCell className="text-center">{member.rollno}</TableCell>
                    <TableCell className="text-center">
                      {member.email || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {member.phone || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* <AlertDialogDescription>
            
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel className="md:w-24 font-bold tracking-wide" disabled={isLoading} onClick={handleCancel}> EDIT </AlertDialogCancel>
            <AlertDialogAction className="font-bold tracking-wide" disabled={isLoading}  onClick={handleContinue}>{ isLoading && <Loader2 className=" mr-1 h-4 w-4 animate-spin" /> }
{isLoading ? "PLEASE WAIT" : "CONTINUE"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
