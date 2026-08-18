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
  const rollNumberPattern = /^2026U[A-Z]{2}\d{4}$/;
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
    // Basic checks
    if (!teamName) {
      toast({
        variant: "destructive",
        title: "Team Name Missing",
        description: "Please enter a team name before proceeding.",
      });
      return;
    }

    // Check for empty fields in any member
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (
        !member.memberName ||
        !member.email ||
        !member.rollNumber ||
        !member.phoneNumber ||
        !member.branch
      ) {
        toast({
          variant: "destructive",
          title: "Incomplete Details",
          description: `Please fill in all details for Member ${i + 1}.`,
        });
        return;
      }
    }

    // Check for unique emails
    const emails = members.map((member) => member.email);
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      toast({
        variant: "destructive",
        title: "Duplicate Emails",
        description: "Each member must have a unique email address.",
      });
      return;
    }

    // Check for unique roll numbers
    const rollNumbers = members.map((member) => member.rollNumber);
    const uniqueRollNumbers = new Set(rollNumbers);
    if (rollNumbers.length !== uniqueRollNumbers.size) {
      toast({
        variant: "destructive",
        title: "Duplicate Roll Numbers",
        description: "Each member must have a unique roll number.",
      });
      return;
    }

    // Check for unique phone numbers
    const phoneNumbers = members.map((member) => member.phoneNumber);
    const uniquePhoneNumbers = new Set(phoneNumbers);
    if (phoneNumbers.length !== uniquePhoneNumbers.size) {
      toast({
        variant: "destructive",
        title: "Duplicate Phone Numbers",
        description: "Each member must have a unique phone number.",
      });
      return;
    }

    // Email format validation
    const invalidEmails = members.filter(
      (member) => !emailPattern.test(member.email)
    );
    if (invalidEmails.length > 0) {
      const invalidNames = invalidEmails
        .map((member) => member.memberName || "a member")
        .join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Email Format",
        description: `Please check the email format for ${invalidNames}.`,
      });
      return;
    }

    // Phone number format validation (10 digits)
    const invalidPhoneNumbers = members.filter(
      (member) => !phoneNumberPattern.test(member.phoneNumber)
    );
    if (invalidPhoneNumbers.length > 0) {
      const invalidNames = invalidPhoneNumbers
        .map((member) => member.memberName || "a member")
        .join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: `Ensure the phone numbers for ${invalidNames} are 10 digits.`,
      });
      return;
    }

    // If all checks pass, proceed
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
            navigate("/success", {
              state: { teamId: receivedTeamId, teamName },
            });
            setShowPopup(false);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong.",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response
              ? error.response.data.error
              : "Server error",
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
