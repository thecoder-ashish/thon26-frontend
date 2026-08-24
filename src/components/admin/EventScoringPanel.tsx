import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/auth";
import {
  Users,
  CheckCircle2,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { getBackendUrl } from "@/lib/api";

interface EventItem {
  event_id: number;
  event_name: string;
  society_name?: string;
  day_number: number;
  time?: string;
}

interface TeamItem {
  team_id: number;
  team_name: string;
  points: number;
}

export function EventScoringPanel() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [allTeams, setAllTeams] = useState<TeamItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Participant IDs list
  const [participantIds, setParticipantIds] = useState<number[]>([]);
  const [typedTeamInput, setTypedTeamInput] = useState<string>("");

  // Winners
  const [firstPlaceId, setFirstPlaceId] = useState<string>("");
  const [secondPlaceId, setSecondPlaceId] = useState<string>("");
  const [thirdPlaceId, setThirdPlaceId] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch Events and Registered Teams
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const backendUrl = getBackendUrl();
        const [eventsRes, teamsRes] = await Promise.all([
          axios.get<EventItem[]>(`${backendUrl}/events`),
          axios.get<TeamItem[]>(`${backendUrl}/teams`),
        ]);
        setEvents(eventsRes.data);
        setAllTeams(teamsRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events or teams list.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to add typed team IDs (comma / space / enter separated)
  const handleAddTypedTeams = () => {
    if (!typedTeamInput.trim()) return;

    const rawIds = typedTeamInput
      .split(/[\s,]+/)
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id) && id > 0);

    if (rawIds.length === 0) return;

    const validIds: number[] = [];
    const invalidIds: number[] = [];

    rawIds.forEach((id) => {
      const exists = allTeams.some((t) => t.team_id === id);
      if (exists) {
        if (!participantIds.includes(id) && !validIds.includes(id)) {
          validIds.push(id);
        }
      } else {
        invalidIds.push(id);
      }
    });

    if (invalidIds.length > 0) {
      toast({
        variant: "destructive",
        title: "Unknown Team IDs",
        description: `Team ID(s) not found: ${invalidIds.join(", ")}`,
      });
    }

    if (validIds.length > 0) {
      setParticipantIds((prev) => [...prev, ...validIds]);
      setTypedTeamInput("");
      toast({
        title: "Teams Added",
        description: `Added ${validIds.length} team(s) to participants list.`,
      });
    }
  };

  const handleRemoveParticipant = (idToRemove: number) => {
    setParticipantIds((prev) => prev.filter((id) => id !== idToRemove));
    if (firstPlaceId === idToRemove.toString()) setFirstPlaceId("");
    if (secondPlaceId === idToRemove.toString()) setSecondPlaceId("");
    if (thirdPlaceId === idToRemove.toString()) setThirdPlaceId("");
  };

  const getTeamName = (id: number | string) => {
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    const team = allTeams.find((t) => t.team_id === numId);
    return team ? team.team_name : `Team ${id}`;
  };

  // Submit scoring results
  const handleSubmitScoring = async () => {
    if (!selectedEventId) {
      toast({
        variant: "destructive",
        title: "Missing Event",
        description: "Please select the completed event.",
      });
      return;
    }

    if (participantIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No Participants",
        description: "Please add at least one participating team.",
      });
      return;
    }

    // Ensure winners are chosen from participating teams
    const first = firstPlaceId ? parseInt(firstPlaceId, 10) : null;
    const second = secondPlaceId ? parseInt(secondPlaceId, 10) : null;
    const third = thirdPlaceId ? parseInt(thirdPlaceId, 10) : null;

    if (first && !participantIds.includes(first)) {
      toast({
        variant: "destructive",
        title: "Invalid 1st Place",
        description: "1st place winner must be in the participants list.",
      });
      return;
    }

    if (second && !participantIds.includes(second)) {
      toast({
        variant: "destructive",
        title: "Invalid 2nd Place",
        description: "2nd place winner must be in the participants list.",
      });
      return;
    }

    if (third && !participantIds.includes(third)) {
      toast({
        variant: "destructive",
        title: "Invalid 3rd Place",
        description: "3rd place winner must be in the participants list.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = user?.token || localStorage.getItem("jwt");
      const payload = {
        event_id: parseInt(selectedEventId, 10),
        first_team_id: first,
        second_team_id: second,
        third_team_id: third,
        participating_team_ids: participantIds,
      };

      const backendUrl = getBackendUrl();
      const response = await axios.post(
        `${backendUrl}/teams/score-event`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Points Updated Successfully",
          description: `Scored ${participantIds.length} teams. Leaderboard points updated automatically.`,
        });

        // Reset form
        setSelectedEventId("");
        setParticipantIds([]);
        setFirstPlaceId("");
        setSecondPlaceId("");
        setThirdPlaceId("");
        setTypedTeamInput("");

        // Refresh teams list
        const updatedTeams = await axios.get<TeamItem[]>(
          `${backendUrl}/teams`
        );
        setAllTeams(updatedTeams.data);
      }
    } catch (error: any) {
      console.error("Error submitting scoring:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          error.response?.data?.message ||
          "Failed to update points. Check backend connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 sm:p-6 bg-card border rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-raleway">
          Event Scoring & Points Submission
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the completed event, enter all participating teams (+5 pts), and assign 1st (+40), 2nd (+25), and 3rd (+10) positions.
        </p>
      </div>

      {/* Step 1: Select Event */}
      <div className="space-y-3">
        <Label className="text-base font-bold flex items-center gap-2">
          <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
            1
          </span>
          Select Completed Event
        </Label>
        <Select
          value={selectedEventId}
          onValueChange={setSelectedEventId}
          disabled={isLoading || isSubmitting}
        >
          <SelectTrigger className="w-full text-base py-6">
            <SelectValue placeholder="Choose an event..." />
          </SelectTrigger>
          <SelectContent>
            {events.map((ev) => (
              <SelectItem key={ev.event_id} value={ev.event_id.toString()}>
                <span className="font-bold">{ev.event_name}</span>{" "}
                <span className="text-muted-foreground">
                  (Day {ev.day_number} • {ev.society_name || "General"})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Add Participating Teams */}
      <div className="space-y-3">
        <Label className="text-base font-bold flex items-center gap-2">
          <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
            2
          </span>
          Add Participating Team IDs (+5 Points each)
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Type Team IDs separated by comma or space (e.g. 1001, 1004, 1007)..."
            value={typedTeamInput}
            onChange={(e) => setTypedTeamInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTypedTeams();
              }
            }}
            className="flex-1 text-base"
          />
          <Button
            type="button"
            onClick={handleAddTypedTeams}
            variant="secondary"
            className="font-bold shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Teams
          </Button>
        </div>

        {/* Selected Participants Badges */}
        {participantIds.length > 0 ? (
          <div className="p-3 border rounded-lg bg-muted/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {participantIds.length} Teams Participating
              </span>
              <button
                type="button"
                onClick={() => setParticipantIds([])}
                className="text-red-500 hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {participantIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-1.5 bg-background border px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                >
                  <span>#{id}</span>
                  <span className="text-muted-foreground font-normal">
                    {getTeamName(id)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(id)}
                    className="text-muted-foreground hover:text-red-500 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No participating teams added yet. Type team IDs above and click "Add Teams".
          </p>
        )}
      </div>

      {/* Step 3: Assign Positions */}
      {participantIds.length > 0 && (
        <div className="space-y-4 pt-2 border-t">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
              3
            </span>
            Assign Winning Positions
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1st Place */}
            <div className="border border-foreground/20 bg-muted/30 p-4 rounded-xl space-y-2">
              <div className="font-bold text-foreground">
                1st Position (+45 Pts)
              </div>
              <p className="text-xs text-muted-foreground">40 Win + 5 Participation</p>
              <Select value={firstPlaceId} onValueChange={setFirstPlaceId}>
                <SelectTrigger className="w-full bg-background font-semibold">
                  <SelectValue placeholder="Select 1st Place..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- None --</SelectItem>
                  {participantIds.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      #{id} - {getTeamName(id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2nd Place */}
            <div className="border border-foreground/20 bg-muted/30 p-4 rounded-xl space-y-2">
              <div className="font-bold text-foreground">
                2nd Position (+30 Pts)
              </div>
              <p className="text-xs text-muted-foreground">25 Win + 5 Participation</p>
              <Select value={secondPlaceId} onValueChange={setSecondPlaceId}>
                <SelectTrigger className="w-full bg-background font-semibold">
                  <SelectValue placeholder="Select 2nd Place..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- None --</SelectItem>
                  {participantIds.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      #{id} - {getTeamName(id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3rd Place */}
            <div className="border border-foreground/20 bg-muted/30 p-4 rounded-xl space-y-2">
              <div className="font-bold text-foreground">
                3rd Position (+15 Pts)
              </div>
              <p className="text-xs text-muted-foreground">10 Win + 5 Participation</p>
              <Select value={thirdPlaceId} onValueChange={setThirdPlaceId}>
                <SelectTrigger className="w-full bg-background font-semibold">
                  <SelectValue placeholder="Select 3rd Place..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- None --</SelectItem>
                  {participantIds.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      #{id} - {getTeamName(id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Points Breakdown Preview Table */}
      {participantIds.length > 0 && (
        <div className="space-y-3 pt-2 border-t">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
              4
            </span>
            Points Allocation Preview
          </Label>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team ID</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead className="text-center">Status / Position</TableHead>
                  <TableHead className="text-center">Position Pts</TableHead>
                  <TableHead className="text-center">Part. Pts</TableHead>
                  <TableHead className="text-right font-bold">Total Pts Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participantIds.map((id) => {
                  const idStr = id.toString();
                  const is1st = firstPlaceId === idStr;
                  const is2nd = secondPlaceId === idStr;
                  const is3rd = thirdPlaceId === idStr;

                  const posPts = is1st ? 40 : is2nd ? 25 : is3rd ? 10 : 0;
                  const partPts = 5;
                  const totalPts = posPts + partPts;

                  return (
                    <TableRow key={id} className={is1st || is2nd || is3rd ? "bg-muted/40 font-medium" : ""}>
                      <TableCell className="font-bold">#{id}</TableCell>
                      <TableCell>{getTeamName(id)}</TableCell>
                      <TableCell className="text-center">
                        {is1st ? (
                          <span className="font-bold text-foreground">
                            1st Place
                          </span>
                        ) : is2nd ? (
                          <span className="font-bold text-foreground">
                            2nd Place
                          </span>
                        ) : is3rd ? (
                          <span className="font-bold text-foreground">
                            3rd Place
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Participant
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">+{posPts}</TableCell>
                      <TableCell className="text-center">+{partPts}</TableCell>
                      <TableCell className="text-right font-mono font-extrabold">
                        +{totalPts} Pts
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Step 5: Submit Button */}
      <div className="pt-4 border-t flex justify-end">
        <Button
          type="button"
          onClick={handleSubmitScoring}
          disabled={isSubmitting || !selectedEventId || participantIds.length === 0}
          className="w-full sm:w-auto px-8 py-6 text-lg font-black font-raleway tracking-wide shadow-lg flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Submitting Results...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" /> Submit Event Results
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default EventScoringPanel;
