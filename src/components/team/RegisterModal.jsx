import React, { useState, useEffect } from "react";
import RegisterBlock from "./RegisterBlock";
import { Button } from "@/components/ui/button";
import "../styles/transition.css";
import { useToast } from "@/components/ui/use-toast";
import { PopupDialog } from "./Popup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { getBackendUrl } from "@/lib/api";

function RegisterForm({ numberOfMembers, teamName }) {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null); // CAPTCHA state
  const [copyMember, setCopyMember] = useState({});
  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rollNumberPattern = /^2026U[A-Z]{2}\d{4}$/;
  const phoneNumberPattern = /^\d{10}$/; // Validates 10-digit phone number

  const getInitialMembers = () => {
    const savedMembers = localStorage.getItem('members');
    return savedMembers ? JSON.parse(savedMembers) : Array(numberOfMembers).fill({});
  };

  const [members, setMembers] = useState(getInitialMembers());

  // Save members to localStorage whenever the members state changes
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    setMembers((prevMembers) => {
      if (numberOfMembers > prevMembers.length) {
        return [
          ...prevMembers,
          ...Array(numberOfMembers - prevMembers.length).fill({}),
        ];
      } else if (numberOfMembers < prevMembers.length) {
        return prevMembers.slice(0, numberOfMembers);
      } else {
        return prevMembers;
      }
    });
  }, [numberOfMembers]);

  console.log(members)

  const saveMemberDetails = (index, newMember) => {
    const updatedMembers = [...members];
    updatedMembers[index] = newMember;
    setMembers(updatedMembers);
  };

  const submitDetails = () => {
    // Check for team name
    if (!teamName || teamName.trim() === "") {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "Enter team name",
      });
      return;
    }

    // Check for any empty name or roll number
    if (members.some((member) => !member.name || !member.rollno)) {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "Name and Roll Number are required for all team members.",
      });
      return;
    }

    // Team Leader contact check
    const leader = members[0];
    if (!leader || !leader.email || !leader.phone) {
      toast({
        variant: "destructive",
        title: "Missing Leader Contact",
        description: "Team Leader's Email and Phone Number are required.",
      });
      return;
    }

    // Secondary contact check
    const secondary = members[1];
    if (!secondary || !secondary.email || !secondary.phone) {
      toast({
        variant: "destructive",
        title: "Missing Secondary Contact",
        description: "Secondary contact email and phone number are required.",
      });
      return;
    }

    const invalidEmailMembers = members.filter(
      (member) => member.email && !emailPattern.test(member.email)
    );

    const invalidRollNumberMembers = members.filter(
      (member) => !rollNumberPattern.test(member.rollno)
    );

    const invalidPhoneNumberMembers = members.filter(
      (member) => member.phone && !phoneNumberPattern.test(member.phone)
    );

    if (invalidEmailMembers.length > 0) {
      const invalidNames = invalidEmailMembers.map((m) => m.name).join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: `Ensure the email addresses for ${invalidNames} are valid.`,
      });
      return;
    }

    if (invalidRollNumberMembers.length > 0) {
      const invalidNames = invalidRollNumberMembers
        .map((m) => m.name)
        .join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Roll Number",
        description: `Ensure the roll numbers for ${invalidNames} match format (e.g. 2026UCA0001).`,
      });
      return;
    }

    if (invalidPhoneNumberMembers.length > 0) {
      const invalidNames = invalidPhoneNumberMembers
        .map((m) => m.name)
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
    const teamDetails = { teamName, members };
    console.log(JSON.stringify(teamDetails, null, 2));
  };

  const handlePopupResponse = (response) => {
    if (response) {
      const teamDetails = {
        teamName: teamName,
        members: members,
        recaptchaToken: captchaToken,
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

  // Callback for reCAPTCHA
  const onCaptchaChange = (token) => {
    if (token) {
      setCaptchaToken(token);
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

      {/* CAPTCHA Integration */}
      <div className="py-4">
        <ReCAPTCHA sitekey={import.meta.env.VITE_CAPTCHA_KEY} onChange={onCaptchaChange} />
      </div>

      <Button
        className="w-full font-black font-raleway text-xl py-6 tracking-wide shadow-md"
        onClick={submitDetails}
      >
        SUBMIT
      </Button>

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
