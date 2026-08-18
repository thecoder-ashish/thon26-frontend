import React from 'react'
import {Leaderboard} from '../components/Leaderboard'
import { Separator } from "@/components/ui/separator"

const LeaderboardPage = () => {
  return (
    <div className=" p-8 md:p-16 md:px-[8vw] lg:px-[10vw] xl:px-[13vw] px-[8vw] pt-8 md:pt-16">

      {/* seperator */}
     
      <h1 className=" font-extrabold font-raleway  text-center pb-4 tracking-tight text-3xl  md:text-5xl">
                        LEADERBOARD
                    </h1>
      {/* <Separator className="mt-4"/> */}
      <Leaderboard/> 
      </div>
  )
}

export default LeaderboardPage