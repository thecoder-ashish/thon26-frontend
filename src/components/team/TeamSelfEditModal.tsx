import * as React from "react";
import axios from "axios";
import { Pencil, Eye, EyeOff, Trash2, UserPlus, UserMinus, AlertTriangle, ArrowLeft, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBackendUrl } from "@/lib/api";

type Member = {
  team_member_id: number;
  member_name: string;
  roll_no: string;
  branch?: string;
  phone_number?: string;
  email?: string;
};

type TeamData = {
  team_id: number;
  team_name: string;
  points: number;
  members: Member[];
};

type Phase = "auth" | "edit" | "success";

interface TeamSelfEditModalProps {
  initialTeamId?: number;
  onClose: () => void;
  onRefresh: () => void;
}

export function TeamSelfEditModal({ initialTeamId, onClose, onRefresh }: TeamSelfEditModalProps) {
  const { toast } = useToast();

  // Auth phase state
  const [phase, setPhase] = React.useState<Phase>("auth");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);

  // Edit phase state
  const [teamData, setTeamData] = React.useState<TeamData | null>(null);
  const [teamName, setTeamName] = React.useState("");
  const [members, setMembers] = React.useState<Member[]>([]);
  const [removedIds, setRemovedIds] = React.useState<number[]>([]);
  const [newMembers, setNewMembers] = React.useState<{ name: string; rollno: string }[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleVerify = async () => {
    if (!phone.trim() || phone.trim().length !== 10) {
      toast({ variant: "destructive", title: "Invalid Phone", description: "Please enter the team leader's 10-digit phone number." });
      return;
    }
    if (!password || password.length < 4) {
      toast({ variant: "destructive", title: "Password Required", description: "Please enter your team password (minimum 4 characters)." });
      return;
    }

    setIsVerifying(true);
    try {
      const backendUrl = getBackendUrl();
      const res = await axios.post(`${backendUrl}/teams/verify-team`, {
        phone: phone.trim(),
        password,
      });
      const data: TeamData = res.data;
      setTeamData(data);
      setTeamName(data.team_name);
      setMembers(data.members);
      setRemovedIds([]);
      setNewMembers([]);
      setPhase("edit");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.response?.data?.message || "Incorrect phone number or password.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveMember = (id: number) => {
    if (!teamData) return;
    // Cannot remove the leader (first member by default)
    const leader = teamData.members[0];
    if (leader && id === leader.team_member_id) {
      toast({ variant: "destructive", title: "Cannot Remove Leader", description: "The team leader cannot be removed." });
      return;
    }
    const remaining = members.filter((m) => !removedIds.includes(m.team_member_id) && m.team_member_id !== id);
    if (remaining.length + newMembers.length < 3) {
      toast({ variant: "destructive", title: "Minimum 3 Members", description: "A team must have at least 3 members." });
      return;
    }
    setRemovedIds((prev) => [...prev, id]);
  };

  const handleAddMember = () => {
    const activeCount = members.filter((m) => !removedIds.includes(m.team_member_id)).length;
    if (activeCount + newMembers.length >= 5) {
      toast({ variant: "destructive", title: "Maximum 5 Members", description: "A team cannot have more than 5 members." });
      return;
    }
    setNewMembers((prev) => [...prev, { name: "", rollno: "" }]);
  };

  const handleSave = async () => {
    if (!teamData) return;

    if (!teamName.trim()) {
      toast({ variant: "destructive", title: "Team Name Required", description: "Please enter a team name." });
      return;
    }

    // Validate new members
    const rollPattern = /^202[56][A-Za-z0-9]+$/;
    for (const m of newMembers) {
      if (!m.name.trim()) {
        toast({ variant: "destructive", title: "Name Required", description: "Please enter a name for all new members." });
        return;
      }
      if (!m.rollno.trim() || !rollPattern.test(m.rollno.trim())) {
        toast({ variant: "destructive", title: "Invalid Roll Number", description: `Roll number must start with 2025 or 2026 (e.g. 2026UCA0001).` });
        return;
      }
    }

    setIsSaving(true);
    try {
      const backendUrl = getBackendUrl();
      const res = await axios.put(`${backendUrl}/teams/${teamData.team_id}/self-edit`, {
        phone: phone.trim(),
        password,
        teamName: teamName.trim(),
        memberIdsToRemove: removedIds,
        membersToAdd: newMembers.map((m) => ({
          name: m.name.trim(),
          rollno: m.rollno.trim(),
        })),
      });

      toast({ title: "Team Updated!", description: "Your team details have been saved successfully." });
      onRefresh();
      onClose();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: err.response?.data?.message || err.response?.data?.error || "Server error while saving changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!teamData) return;
    setIsDeleting(true);
    try {
      const backendUrl = getBackendUrl();
      await axios.delete(`${backendUrl}/teams/${teamData.team_id}/self-delete`, {
        data: { phone: phone.trim(), password },
      });
      toast({ title: "Team Deleted", description: "Your team has been permanently deleted." });
      onRefresh();
      onClose();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.response?.data?.message || "Server error while deleting team.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const activeMembers = members.filter((m) => !removedIds.includes(m.team_member_id));
  const totalCount = activeMembers.length + newMembers.length;
  const leaderId = teamData?.members[0]?.team_member_id;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-3xl border bg-card/95 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {phase === "edit" && (
              <button
                onClick={() => { setPhase("auth"); setShowDeleteConfirm(false); }}
                className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-black tracking-widest text-primary uppercase">
                {phase === "auth" ? "Team Portal" : `Team #${teamData?.team_id}`}
              </p>
              <h2 className="text-lg font-black font-raleway tracking-tight text-foreground">
                {phase === "auth" ? "Edit Your Team" : teamData?.team_name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border bg-background/80 hover:bg-background transition-all active:scale-95 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">

          {/* ─── AUTH PHASE ─── */}
          {phase === "auth" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter the <strong>team leader's phone number</strong> and your <strong>team password</strong> to access your team's edit panel.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase block mb-1.5">
                    Leader's Phone Number
                  </label>
                  <input
                    id="self-edit-phone"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-bold font-mont outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase block mb-1.5">
                    Team Password
                  </label>
                  <div className="relative">
                    <input
                      id="self-edit-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your team password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-muted bg-muted/30 p-3">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <strong>Already registered before this update?</strong><br />
                    Contact{" "}
                    <a
                      href="https://wa.me/916206814632"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold underline underline-offset-2 hover:text-primary/80 transition-colors"
                    >
                      Ashish on WhatsApp
                    </a>
                    {" "}to access your account.
                  </p>
                </div>
                </div>
              </div>

              <Button
                id="self-edit-verify-btn"
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-5 font-black tracking-wide font-raleway gap-2"
              >
                {isVerifying ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  <><Pencil className="h-4 w-4" /> Verify & Edit Team</>
                )}
              </Button>
            </div>
          )}

          {/* ─── EDIT PHASE ─── */}
          {phase === "edit" && teamData && !showDeleteConfirm && (
            <div className="space-y-5">
              {/* Team Name */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase block mb-1.5">
                  Team Name
                </label>
                <input
                  id="self-edit-team-name"
                  type="text"
                  value={teamName}
                  maxLength={50}
                  onChange={(e) => setTeamName(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-black font-raleway uppercase outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Roster */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                    Roster ({totalCount}/5)
                  </label>
                  {totalCount < 5 && (
                    <button
                      onClick={handleAddMember}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add Member
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Existing members */}
                  {members.map((m) => {
                    const isRemoved = removedIds.includes(m.team_member_id);
                    const isLeader = m.team_member_id === leaderId;
                    if (isRemoved) return null;
                    return (
                      <div
                        key={m.team_member_id}
                        className={`flex items-center justify-between rounded-xl border p-3 ${isLeader ? "bg-primary/5 border-primary/20" : "bg-card"}`}
                      >
                        <div>
                          {isLeader && (
                            <span className="text-[9px] font-black tracking-widest text-primary uppercase block">Leader</span>
                          )}
                          <p className="font-bold font-raleway text-sm text-foreground">{m.member_name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{m.roll_no}</p>
                        </div>
                        {!isLeader && (
                          <button
                            onClick={() => handleRemoveMember(m.team_member_id)}
                            className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remove member"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* New members being added */}
                  {newMembers.map((nm, i) => (
                    <div key={`new-${i}`} className="rounded-xl border border-dashed border-primary/40 p-3 space-y-2 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black tracking-widest text-primary uppercase">New Member</span>
                        <button
                          onClick={() => setNewMembers((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="MEMBER NAME"
                        maxLength={30}
                        value={nm.name}
                        onChange={(e) =>
                          setNewMembers((prev) =>
                            prev.map((m, idx) => idx === i ? { ...m, name: e.target.value.toUpperCase() } : m)
                          )
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold font-mont uppercase outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      <input
                        type="text"
                        placeholder="ROLL NO (e.g. 2026UCA0001)"
                        maxLength={16}
                        value={nm.rollno}
                        onChange={(e) =>
                          setNewMembers((prev) =>
                            prev.map((m, idx) => idx === i ? { ...m, rollno: e.target.value.toUpperCase() } : m)
                          )
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-mono outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button
                  id="self-edit-save-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-5 font-black tracking-wide font-raleway gap-2"
                >
                  {isSaving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> Save Changes</>
                  )}
                </Button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/30"
                >
                  Delete My Team
                </button>
              </div>
            </div>
          )}

          {/* ─── DELETE CONFIRM ─── */}
          {phase === "edit" && showDeleteConfirm && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-destructive font-black text-sm">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>Delete "{teamData?.team_name}"?</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  This <strong>cannot be undone</strong>. Your team and all {members.length} members will be permanently removed from NSUTTHON 2026.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 font-raleway font-bold"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 font-raleway font-bold gap-1.5"
                >
                  {isDeleting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 className="h-4 w-4" /> Confirm Delete</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
