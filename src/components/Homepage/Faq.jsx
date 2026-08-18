import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { memo, useCallback } from "react";
import clsx from "clsx";

export function Faq({ showAll }) {
  const allFaqs = useCallback(
    () => [
      {
        id: "item-1",
        question: "What is NSUTTHON?",
        answer:
          "NSUTTHON is the 3 days long annual flagship event of CROSSLINKS, in which all the student societies of NSUT organize events and competitions for freshers.",
      },
      {
        id: "item-2",
        question: "Will classes be conducted during NSUTTHON?",
        answer:
          "Yes, classes will be conducted as per your timetable, but we will try our best to avoid any clashes with the events.",
      },
      {
        id: "item-3",
        question: "What is the schedule of events?",
        answer:
          "The schedule of the events will be released on the official Instagram handle of CROSSLINKS, NSUT and on this website. You are requested to follow our social media handles for all updates.",
      },
      {
        id: "item-4",
        question: "What are the types of events?",
        answer:
          "Events range from orientations of a society to competitions like treasure hunts, cryptic hunts, hackathons, dance face-offs and a lot more, for each of which participating and winning teams will be awarded points.",
      },
      {
        id: "item-5",
        question: "Are there any prizes for the winning teams?",
        answer:
          "The prizes for winning a particular society's event will be decided by the respective society. The top 3 teams which emerge as the overall winners of NSUTTHON will be awarded cash prizes and trophies by CROSSLINKS.",
      },
      {
        id: "item-6",
        question: "Is it an individual or team based event?",
        answer:
          "You need to register in teams of 3 to 5 members. However, you can participate in an event individually to represent your team.",
      },
      {
        id: "item-7",
        question: "What is the platform being used?",
        answer:
          "Every team has to register on NSUTTHON's website to be able to take part in the festival and accumulate points.",
      },
      {
        id: "item-8",
        question: "How to get a team registered for NSUTTHON?",
        answer:
          "For participating in NSUTTHON you need to register your team by proceeding with the following steps:<br/>" +
          "1) Visit the website of NSUTTHON.<br/>" +
          "2) Start by clicking on <strong>REGISTER</strong>.<br/>" +
          "3) Select your team size (3/4/5).<br/>" +
          "4) Enter your team name.<br/>" +
          "5) Enter name and roll numbers of your team members (The first member is your team leader).<br/>" +
          "6) Enter contact details for your leader and secondary contact.<br/>" +
          "7) Complete the partner tasks given on the success page to finalize your registration.<br/>" +
          "8) Note down your Team ID for future references.",
      },
      {
        id: "item-9",
        question: "Is it necessary to register our team?",
        answer:
          "Yes, it is mandatory to register your team on NSUTTHON's website to take part in any society's event and be scored on the leaderboard.",
      },
      {
        id: "item-10",
        question: "What is the distribution of scores?",
        answer:
          "The points will be distributed as follows:<br/>" +
          "• Winner (1st Place): 40 points (+ 5 participation = <strong>45 points</strong>)<br/>" +
          "• 1st Runner Up (2nd Place): 25 points (+ 5 participation = <strong>30 points</strong>)<br/>" +
          "• 2nd Runner Up (3rd Place): 10 points (+ 5 participation = <strong>15 points</strong>)<br/>" +
          "• Participation: <strong>5 points</strong> for every participating team.<br/>" +
          "The team with the highest cumulative score after all the events will be the winner of NSUTTHON.",
      },
      {
        id: "item-11",
        question: "What to do if two events clash?",
        answer:
          "You can make a choice by having team members split across simultaneous events to represent your team.<br/>" +
          "<strong>Pro Tip:</strong> Make a team of 5 members so that your chances of scoring points increases as your team can participate in two or more events at the same time.",
      },
      {
        id: "item-12",
        question: "What will be the length of an event?",
        answer: "The average length of any event ranges from 1-2 hours.",
      },
      {
        id: "item-13",
        question: "Do I need to join the society to take part in its event?",
        answer:
          "No, you need not be a part of any society to be able to participate in its event, however, you must register your team on NSUTTHON's website.",
      },
      {
        id: "item-14",
        question: "How to register for a particular event?",
        answer:
          "Once you register your team on NSUTTHON's website, you can view event details and register for individual society events directly through the Events page.",
      },
      {
        id: "item-15",
        question: "Can a team take part in two events happening at the same time?",
        answer:
          "Yes, different members of a team can take part in two events simultaneously provided they have registered.",
      },
    ],
    []
  );

  const containerClass = clsx("faq-container relative overflow-hidden", {
    "with-gradient": !showAll,
  });
  const hiddenClass =
    "opacity-0 max-h-0 overflow-hidden transition-all duration-500 ease-in-out ";
  const shownClass =
    "opacity-100 max-h-full transition-all duration-1000 ease-in-out";

  const faqs = allFaqs();

  return (
    <div
      className={`${containerClass} relative pb-3 border-b-4 overflow-hidden`}
    >
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            value={faq.id}
            className={showAll || index < 8 ? shownClass : hiddenClass}
            key={faq.id}
          >
            <AccordionTrigger className="font-bold text-left hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default Faq;
