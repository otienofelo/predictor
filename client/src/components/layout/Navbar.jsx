import React from 'react'
import { useUser, UserButton, useClerk } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-end">
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <span className="text-gray-400">|</span>

            <p className="text-gray-700">
              Hi, {user.firstName} {user.lastName}
            </p>

            <UserButton />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600">
              Farmer Login
            </button>

            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Navbar