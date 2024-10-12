import React from 'react'

function FacebookPageManagement() {
  return (
      <div className="flex justify-center items-center h-screen bg-indigo-700" >
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Facebook Page Integration</h3>
              <a
                  href="https://richpanel-fb-helpdesk-gwbm.onrender.com/auth/facebook/callback"
                  className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                  Connect Page
              </a>
          </div>
      </div>

  )
}

export default FacebookPageManagement