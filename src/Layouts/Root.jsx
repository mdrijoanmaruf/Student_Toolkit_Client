import React from 'react'
import Navbar from '../Shared/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Shared/Footer/Footer'

const Root = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar></Navbar>
      </div>
      
      {/* Main Content with top padding for fixed navbar */}
      <main className="min-h-[70vh] pt-16">
        <Outlet></Outlet>
      </main>
      
      {/* Footer */}
      <div>
        <Footer></Footer>
      </div>
    </div>
  )
}

export default Root