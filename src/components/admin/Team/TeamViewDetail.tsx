import { useState } from 'react';
import axios from 'axios';

// UI components imports
import {
  AlertDialog,
//   AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {LucideMoreHorizontal} from "lucide-react";


interface TeamDetailsDialogProps {
    team_id: string;
    team_name: string;
  }
  
  interface TeamMember {
    member_name: string;
    branch: string;
    phone_number: string;
    roll_no: string;
    email: string;
  }
  
  export function TeamDetailsDialog({ team_id, team_name }: TeamDetailsDialogProps) {
    const [teamDetails, setTeamDetails] = useState<TeamMember[]>([]);
  
    async function fetchTeamDetails() {
      try {
        const response = await axios.get<TeamMember[]>(`${import.meta.env.VITE_BACKEND_URL}/team-members/${team_id}`);
        setTeamDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch team details:', error);
      }
    }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8  border w-8 p-0"
          onClick={fetchTeamDetails} // Fetch data when button is clicked
        >
          <LucideMoreHorizontal className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Team Name: {team_name}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <Table>
            <TableCaption>Details of {team_name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamDetails.map((member) => (
                <TableRow key={member.email}>
                  <TableCell className="font-medium">{member.member_name}</TableCell>
                  <TableCell>{member.branch}</TableCell>
                  <TableCell>{member.phone_number}</TableCell>
                  <TableCell>{member.roll_no}</TableCell>
                  <TableCell>{member.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
