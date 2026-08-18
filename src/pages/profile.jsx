import React from 'react'
import { AlertVerification } from '../components/profile/AlertVerification'
import  TabsRender  from '../components/profile/Tabs'

const Profile = () => {
  return (
    <div className='p-8'> 
        <AlertVerification/>
    
    <TabsRender/>
    </div>


  )
}

export default Profile;