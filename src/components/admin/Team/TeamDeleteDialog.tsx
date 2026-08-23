import { Trash2 } from "lucide-react";
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

    try {
      const backendUrl = getBackendUrl();
      const response = await axios.delete(`${backendUrl}/teams/${team_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Team Deleted",
          description: `Team "${team_name}" (#${team_id}) and all its members were permanently removed.`,
        });
        onTeamDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting team:", error);
      toast({
        title: "Delete Failed",
        variant: "destructive",
        description:
          error.response?.data?.message ||
          "Server error while deleting team.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500 transition-all ml-2"
          title={`Delete Team ${team_name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Team "{team_name}"?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 pt-2 text-foreground/80">
            <p>
              This action <strong>cannot be undone</strong>.
            </p>
            <p>
              This will permanently delete Team <strong>#{team_id} ({team_name})</strong> and <strong>all registered team members</strong> from the database.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteTeam}
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default TeamDeleteDialog;
