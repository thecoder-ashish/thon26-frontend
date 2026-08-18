import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {PlusSquare} from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth";


interface TeamDetailsDialogProps {
    team_id: number;
    points: number;
    team_name: string;
    onPointsUpdated: () => void;
}

export function PointsUpdateDialog({ team_id, points, team_name, onPointsUpdated }: TeamDetailsDialogProps) {
    const [pointsToAdd, setPointsToAdd] = useState<string>("");
    const teamName = team_name;
    const teamPoints = points;
    const { toast } = useToast()
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const updatedPoints = teamPoints + ((pointsToAdd as string) === "" || (pointsToAdd as string) === "-" ? 0 : Number(pointsToAdd));
    const handleSave = () => {
        setIsLoading(true);
        
        const token = user?.token || localStorage.getItem('jwt');
        
        if (!token) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User is not authenticated."
            });
            setIsLoading(false);
            return;
        }
        
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/teams/update-points`, {
            team_id: team_id,
            points: updatedPoints
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            toast({
                title: "Success!",
                description: "Team points updated successfully!"
            });
            setPointsToAdd(""); // Reset the input field
            onPointsUpdated(); // Notify parent to refetch data
        })
        .catch(error => {
            console.error(error);
            if (error.response) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.response.data.message || "Failed to update points."
                });
            } else if (error.request) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No response received from the server."
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Something went wrong."
                });
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
    
        if (
            value === "" || // Allow empty string
            value === "-" || // Allow negative sign
            !isNaN(Number(value)) // Allow numbers
        ) {
            setPointsToAdd(value);
        }
    };



    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 ml-2 w-8 p-0">
            <PlusSquare className="h-5  w-5" />
          </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">{teamName}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 mt-4 items-center w-full justify-center">
                    <div className="flex justify-center items-center  ml-10 w-3/4  gap-2">
                        <Label htmlFor="name" className="w-full text-lg ">
                            Add Points
                        </Label>
                        <Input
                            id="name"
                            type="number"
                            value={pointsToAdd.toString()} // Convert the union type to string for the input value
                            onChange={handleInputChange}
                        />

                    </div>
                    <p className="text-center mt-2">Current Points: {teamPoints}</p>
                    <p className="text-center font-bold">New Points: {updatedPoints}</p>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
