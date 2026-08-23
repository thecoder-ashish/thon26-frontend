import { Trash } from "lucide-react";
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
} from "@/components/ui/alert-dialog-2";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth";
import { getBackendUrl } from "@/lib/api";

interface TeamDeleteDialogProps {
  team_id: number;
  team_name: string;
  onTeamDeleted: () => void;
}

export function TeamDeleteDialog({
  team_id,
  team_name,
  onTeamDeleted,
}: TeamDeleteDialogProps) {
  const { user } = useAuth();

  const deleteTeam = async () => {
    const token = user?.token || localStorage.getItem("accessToken");
    if (!token) {
      toast({
        title: "Authentication Error",
        variant: "destructive",
        description: "Please login as administrator to perform this action.",
      });
      return;
    }

    try {
      const backendUrl = getBackendUrl();
      const response = await axios.delete(
        `${backendUrl}/teams/${team_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Team Deleted",
          description: `Team "${team_name}" and its members were permanently removed.`,
        });
        onTeamDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting team:", error);
      toast({
        title: "Delete Failed",
        variant: "destructive",
        description: error.response?.data?.message || "Server error while deleting team.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 border text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors ml-1.5"
          title={`Delete Team ${team_name}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Team "{team_name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action <strong>cannot be undone</strong>. This will permanently delete Team <strong>#{team_id} ({team_name})</strong> and <strong>all associated team members</strong> from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteTeam}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default TeamDeleteDialog;
