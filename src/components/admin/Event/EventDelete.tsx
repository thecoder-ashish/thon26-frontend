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

// Define the prop types
interface EventDeleteDialogBoxProps {
  eventId: number;
  onEventDelete: () => void;
}
export function EventDeleteDialogBox({
  eventId,
  onEventDelete,
}: EventDeleteDialogBoxProps) {
  const { user } = useAuth();

  const deleteEvent = async () => {
    // Check if user and token exist
    if (!user || !user.token) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "User is not authenticated. Please login to continue.",
      });
      return;
    }

    try {
      // Configure headers with Authorization token
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Send a DELETE request to the backend with configured headers
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/eventdelete/${eventId}`,
        config
      );

      // Check response status
      if (response.status === 200) {
        toast({
          title: "Event deleted successfully!",
        });
        onEventDelete();
      } else {
        toastError(response.data);
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
      toastError("Server error while deleting event.");
    }
  };

  // Function to show error toast
  const toastError = (description: string) => {
    toast({
      title: "Error",
      variant: "destructive",
      description,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 border mr-2">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteEvent}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
