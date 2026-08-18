import React , { useState} from "react";
import { Swords, Users2, User2 } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



export function NsutthonGrid({}) {
  const { ref, inView } = useInView({
    triggerOnce: false, // Ensures the animation happens only once
    threshold: 0.1, // Percentage of element in view to trigger
  });



  const [rippleCard1, setRippleCard1] = useState({ x: 0, y: 0, visible: false });
  const [rippleCard2, setRippleCard2] = useState({ x: 0, y: 0, visible: false });
  const [rippleCard3, setRippleCard3] = useState({ x: 0, y: 0, visible: false });

  const handleCardClick1 = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRippleCard1({ x, y, visible: true });
  };
  
  const handleCardClick2 = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRippleCard2({ x, y, visible: true });
  };
  

  const handleCardClick3 = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRippleCard3({ x, y, visible: true });
  };
  

const Ripple = ({ rippleX, rippleY, onEnd }) => (
  <AnimatePresence>
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 50, opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute",
        background: "rgba(255, 255, 255, 0.6)",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        top: rippleY,
        left: rippleX,
        pointerEvents: "none",
      }}
      onAnimationComplete={onEnd}
    />
  </AnimatePresence>
);

return (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <Card ref={ref} onClick={handleCardClick1} className="relative overflow-hidden">
      {rippleCard1.visible && (
        <Ripple
          rippleX={rippleCard1.x}
          rippleY={rippleCard1.y}
          onEnd={() => setRippleCard1((prev) => ({ ...prev, visible: false }))}
        />
      )}
      <CardContent className="flex justify-between items-baseline">
        <div className="text-2xl pt-6 font-bold">
          {inView && <CountUp start={0} end={450} duration={3} />}+
        </div>
        <Users2 className="h-4 w-4 opacity-75" />
      </CardContent>
      <CardFooter className="flex flex-row items-center -mt-4 justify-between space-y-0">
        Teams Registered
      </CardFooter>
    </Card>

   
    <Card ref={ref} onClick={handleCardClick2} className="relative overflow-hidden">
    {rippleCard2.visible && (
        <Ripple
          rippleX={rippleCard2.x}
          rippleY={rippleCard2.y}
          onEnd={() => setRippleCard2((prev) => ({ ...prev, visible: false }))}
        />
      )}
        <CardContent className="flex justify-between items-baseline">
          <div className="text-2xl pt-6 font-bold">
            {inView && <CountUp start={1000} end={1500} duration={3} />}+
          </div>
          <User2 className="h-4 w-4 opacity-75" />
        </CardContent>
        <CardFooter className="flex flex-row items-center -mt-4  justify-between space-y-0 ">
          Users Registered
        </CardFooter>
      </Card>
      <Card ref={ref} onClick={handleCardClick3} className="relative overflow-hidden">
      {rippleCard3.visible && (
        <Ripple
          rippleX={rippleCard3.x}
          rippleY={rippleCard3.y}
          onEnd={() => setRippleCard3((prev) => ({ ...prev, visible: false }))}
        />
      )}
        <CardContent className="flex justify-between items-baseline">
          <div className="text-2xl pt-6 font-bold">
            {inView && <CountUp start={0} end={40} duration={4} />}+
          </div>
          <Swords className="h-4 w-4 opacity-75" />
        </CardContent>
        <CardFooter className="flex flex-row items-center -mt-4  justify-between space-y-0 ">
          Events
        </CardFooter>
      </Card>
      {/* <Card ref={ref}>
        <CardContent className="flex justify-between items-baseline">
          <div className="text-2xl pt-6 font-bold">
            {inView && <CountUp start={0} end={30} duration={2} />}+
          </div>
          <Swords className="h-4 w-4 opacity-75" />
        </CardContent>
        <CardFooter className="flex flex-row items-center -mt-4  justify-between space-y-0 ">
          Events
        </CardFooter>
      </Card> */}
    </div>
  );
}
