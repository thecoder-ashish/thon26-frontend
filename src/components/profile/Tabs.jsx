import React from "react";
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import CreateTeam from "./CreateTeam";
const Tabs = ({ color }) => {
    const [openTab, setOpenTab] = React.useState(1);
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <ul
                        className="flex mb-0  max-w-screen-md list-none flex-wrap pt-3 pb-4 flex-row"
                        
                    >
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            {/* <Button variant="secondary">Secondary</Button> */}
                            <Button
                                variant={openTab === 1 ? "" : "secondary"}
                                className="font-bold shadow-lg w-full rounded leading-normal"
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                            >
                                Create Team
                            </Button>
                           
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <Button
                                variant={openTab === 2 ? "" : "secondary"}
                                className="font-bold shadow-lg w-full rounded leading-normal"
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                            >
                                Join Team
                            </Button>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words dark:bg-red-500 w-full mb-6 shadow-lg rounded">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <CreateTeam/>
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <p>
                                        Completely synergize resource taxing relationships via
                                        premier niche markets. Professionally cultivate one-to-one
                                        customer service with robust ideas.
                                        <br />
                                        <br />
                                        Dynamically innovate resource-leveling customer service for
                                        state of the art customer service.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function TabsRender() {
    return (
        <>
            <Tabs color="red" />;
        </>
    );
}