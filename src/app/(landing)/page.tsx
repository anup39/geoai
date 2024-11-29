import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function LandingPage() {
  return (
    <div> World most popular chatbot for Geospatial data
      <div className='m-2 flex gap-2'>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  )
}

export default LandingPage