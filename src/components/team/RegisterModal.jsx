import React, { useState, useEffect } from "react";
import RegisterBlock from "./RegisterBlock";
import { Button } from "@/components/ui/button";
import "../styles/transition.css";
import { useToast } from "@/components/ui/use-toast";
import { PopupDialog } from "./Popup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { getBackendUrl } from "@/lib/api";

function RegisterForm({ numberOfMembers, teamName }) {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [copyMember, setCopyMember] = useState({});
  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneNumberPattern = /^\d{10}$/; // Validates 10-digit phone number

  const getInitialMembers = () => {
    const savedMembers = localStorage.getItem("members");
    return savedMembers
      ? JSON.parse(savedMembers)
      : Array(numberOfMembers).fill({});
  };

  const [members, setMembers] = useState(getInitialMembers());

  // Save members to localStorage whenever the members state changes
  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    setMembers((prevMembers) => {
      if (numberOfMembers > prevMembers.length) {
        return [
          ...prevMembers,
          ...Array(numberOfMembers - prevMembers.length).fill({}),
        ];
      } else {
        return prevMembers.slice(0, numberOfMembers);
      }
    });
  }, [numberOfMembers]);

  const saveMemberDetails = (index, member) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = member;
      return updatedMembers;
    });
  };

  const submitDetails = () => {
    // 1. Team Name Check
    if (!teamName || !teamName.trim()) {
      toast({
        variant: "destructive",
        title: "Team Name Missing",
        description: "Please enter a team name before proceeding.",
      });
      return;
    }

    // 2. Validate Each Member
    for (let i = 0; i < members.length; i++) {
      const member = members[i] || {};
      const isLeader = i === 0;
      const isSecondaryContact = i === 1;
      const requiresContact = isLeader || isSecondaryContact;

      // Name required for all
      if (!member.name || !member.name.trim()) {
        toast({
          variant: "destructive",
          title: "Incomplete Details",
          description: `Please enter the name for Member ${i + 1}.`,
        });
        return;
      }

      // Roll No required for all
      if (!member.rollno || !member.rollno.trim()) {
        toast({
          variant: "destructive",
          title: "Incomplete Details",
          description: `Please enter the roll number for ${member.name}.`,
        });
        return;
      }

      // Leader and Secondary Contact require Email & Phone
      if (requiresContact) {
        if (!member.email || !member.email.trim()) {
          toast({
            variant: "destructive",
            title: "Incomplete Details",
            description: `Please enter the email address for ${
              isLeader ? "Team Leader" : "Contact 2"
            } (${member.name}).`,
          });
          return;
        }

        if (!member.phone || !member.phone.trim()) {
          toast({
            variant: "destructive",
            title: "Incomplete Details",
            description: `Please enter the 10-digit phone number for ${
              isLeader ? "Team Leader" : "Contact 2"
            } (${member.name}).`,
          });
          return;
        }

        if (!emailPattern.test(member.email.trim())) {
          toast({
            variant: "destructive",
            title: "Invalid Email Format",
            description: `Please enter a valid email address for ${member.name}.`,
          });
          return;
        }

        if (!phoneNumberPattern.test(member.phone.trim())) {
          toast({
            variant: "destructive",
            title: "Invalid Phone Number",
            description: `Ensure the phone number for ${member.name} is exactly 10 digits.`,
          });
          return;
        }
      }
    }

    // 3. Unique Roll Numbers Check
    const rollNumbers = members
      .map((m) => m?.rollno?.trim().toUpperCase())
      .filter(Boolean);
    if (new Set(rollNumbers).size !== rollNumbers.length) {
      toast({
        variant: "destructive",
        title: "Duplicate Roll Numbers",
        description: "Each team member must have a unique roll number.",
      });
      return;
    }

    // 4. Unique Contact Emails Check
    const contactEmails = members
      .slice(0, 2)
      .map((m) => m?.email?.trim().toLowerCase())
      .filter(Boolean);
    if (contactEmails.length > 1 && new Set(contactEmails).size !== contactEmails.length) {
      toast({
        variant: "destructive",
        title: "Duplicate Contact Emails",
        description: "Team Leader and Contact 2 must have distinct email addresses.",
      });
      return;
    }

    // 5. Unique Contact Phone Numbers Check
    const contactPhones = members
      .slice(0, 2)
      .map((m) => m?.phone?.trim())
      .filter(Boolean);
    if (contactPhones.length > 1 && new Set(contactPhones).size !== contactPhones.length) {
      toast({
        variant: "destructive",
        title: "Duplicate Contact Phones",
        description: "Team Leader and Contact 2 must have distinct phone numbers.",
      });
      return;
    }

    // If all checks pass, show confirmation popup
    setShowPopup(true);
  };

  const handlePopupResponse = (response) => {
    if (response) {
      const teamDetails = {
        teamName: teamName,
        members: members,
      };

      const backendUrl = getBackendUrl();
      axios
        .post(`${backendUrl}/register`, teamDetails)
        .then((res) => {
          if (res.status === 201) {
            const { teamId: receivedTeamId } = res.data;
            // Clear saved localStorage data on success
            localStorage.removeItem("members");
            localStorage.removeItem("teamName");
            navigate("/success", {
              state: { teamId: receivedTeamId, teamName },
            });
            setShowPopup(false);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong during registration.",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.response?.data?.error || "Server error while registering team.",
          });
          console.error("Error while registering:", error);
        });
    } else {
      setShowPopup(false);
    }
  };

  return (
    <div>
      {members.map((member, index) => (
        <Transition
          as={React.Fragment}
          key={index}
          appear={true}
          show={true}
          enter="transform transition ease-in-out duration-500"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
        >
          <div style={{ transitionDelay: `${index * 100}ms` }}>
            <RegisterBlock
              member={member}
              saveMemberDetails={(newMember) =>
                saveMemberDetails(index, newMember)
              }
              index={index + 1}
              copyMember={copyMember}
              setCopyMember={(member) => setCopyMember(member)}
            />
          </div>
        </Transition>
      ))}

      <div className="pt-6">
        <Button
          className="w-full font-black font-raleway text-xl py-6 tracking-wide shadow-md"
          onClick={submitDetails}
        >
          SUBMIT
        </Button>
      </div>

      {showPopup && (
        <PopupDialog
          teamName={teamName}
          members={members}
          onResponse={handlePopupResponse}
          showPopup={setShowPopup}
        />
      )}
    </div>
  );
}

export default RegisterForm;
