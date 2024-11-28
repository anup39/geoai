import React from 'react'
import { Button } from '@/components/ui/button'

function LandingPage() {
  return (
    <div className='text-6xl'> LandingPage (Unprotected)
        <Button variant='outline'>
          Login
        </Button>
    </div>
  )
}

export default LandingPage