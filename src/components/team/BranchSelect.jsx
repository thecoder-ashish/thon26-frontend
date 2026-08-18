import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function BranchSelect({ value, onChange }) {
  // Define props here
  const options = [
    {
      label: "Main Campus",
      options: [
        { label: "CSE", value: "CSE" },
        { label: "CSDS", value: "CSDS" },
        { label: "CSAI", value: "CSAI" },
        { label: "IT", value: "IT" },
        { label: "ITNS", value: "ITNS" },
        { label: "MAC", value: "MAC" },
        { label: "ECE", value: "ECE" },
        { label: "EIOT", value: "EIOT" },
        { label: "EE", value: "EE" },
        { label: "ICE", value: "ICE" },
        { label: "ME", value: "ME" },
        { label: "BT", value: "BT" },
        { label: "BBA", value: "BBA" },
        { label: "B.Design", value: "B.Design" },
        { label: "B.FTech", value: "B.FTech" },
      ],
    },
    {
      label: "East Campus",
      options: [
        { label: "CSDA", value: "CSDA" },
        { label: "CIOT", value: "CIOT" },
        { label: "ECAM", value: "ECAM" },
      ],
    },
    {
      label: "West Campus",
      options: [
        { label: "MEEV", value: "MEEV" },
        { label: "CE", value: "CE" },
        { label: "GI", value: "GI" },
        { label: "B.Arch", value: "B.Arch" },
      ],
    },
    {
      options: [
        { label: "Others", value: "Others" },

      ],
    },
  ];
  console.log("Selected Branch Value:", value);

  return (
    <Select value={value} onChange={(selectedValue) => onChange(selectedValue)}>
      <SelectTrigger className="w-[180px] ml-11">
        <SelectValue placeholder="BRANCH" />
      </SelectTrigger>

      <SelectContent className="max-h-80 outline-none overflow-y-auto">
        {options.map((campus) => (
          <SelectGroup key={campus.label}>
            <SelectLabel>{campus.label}</SelectLabel>
            {campus.options.map((course) => (
              <SelectItem key={course.value} value={course.value}>
                {course.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
