import { useState } from 'react';
import axios from 'axios';

// UI components imports
import {
  AlertDialog,
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
import { LucideMoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/auth/auth";
import { useToast } from "@/components/ui/use-toast";
import { getBackendUrl } from "@/lib/api";

interface TeamDetailsDialogProps {
  team_id: string;
  team_name: string;
  onTeamDeleted?: () => void;
}

interface TeamMember {
  member_name: string;
  branch: string;
  phone_number: string;
  roll_no: string;
  email: string;
}

export function TeamDetailsDialog({
  team_id,
  team_name,
  onTeamDeleted,
}: TeamDetailsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamDetails, setTeamDetails] = useState<TeamMember[]>([]);
  const [open, setOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPoc = user?.role === "poc";

  async function fetchTeamDetails() {
    try {
      const backendUrl = getBackendUrl();
      const response = await axios.get<TeamMember[]>(
        `${backendUrl}/team-members/${team_id}`
      );
      setTeamDetails(response.data);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    }
  }

  async function handleDeleteTeam() {
    const token =
      user?.token ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");

    if (!token) {
      toast({
        title: "Authentication Error",
        variant: "destructive",
        description: "Please login as administrator to perform this action.",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const backendUrl = getBackendUrl();
      await axios.delete(`${backendUrl}/teams/${team_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Team Deleted",
        description: `Team "${team_name}" (#${team_id}) and all its members were permanently removed.`,
      });

      setOpen(false);
      setShowConfirmDelete(false);
      if (onTeamDeleted) {
        onTeamDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting team:", error);
      toast({
        title: "Delete Failed",
        variant: "destructive",
        description:
          error.response?.data?.message || "Server error while deleting team.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 border w-8 p-0"
          onClick={() => {
            setOpen(true);
            fetchTeamDetails();
          }}
        >
          <LucideMoreHorizontal className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-xl font-bold">
              Team: {team_name}{" "}
              <span className="text-muted-foreground font-mono text-sm">
                #{team_id}
              </span>
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {showConfirmDelete ? (
          <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 space-y-3 my-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-destructive font-black text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Are you sure you want to delete this team?</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              This action <strong>cannot be undone</strong>. This will permanently delete Team{" "}
              <strong>
                #{team_id} ({team_name})
              </strong>{" "}
              and <strong>all {teamDetails.length} registered team members</strong> from the database.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteTeam}
                disabled={isDeleting}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Confirm & Delete Team"}
              </Button>
            </div>
          </div>
        ) : (
          <AlertDialogDescription>
            <Table>
              <TableCaption>Roster details of {team_name}</TableCaption>
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
                {teamDetails.length > 0 ? (
                  teamDetails.map((member, idx) => (
                    <TableRow key={member.email || idx}>
                      <TableCell className="font-medium">
                        {member.member_name}
                      </TableCell>
                      <TableCell>{member.branch}</TableCell>
                      <TableCell>{member.phone_number}</TableCell>
                      <TableCell>{member.roll_no}</TableCell>
                      <TableCell>{member.email}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No roster details found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AlertDialogDescription>
        )}

        <AlertDialogFooter className="flex justify-between sm:justify-between w-full items-center pt-2">
          {!isPoc && !showConfirmDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirmDelete(true)}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete Team
            </Button>
          )}
          {!showConfirmDelete && (
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Close
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default TeamDetailsDialog;
