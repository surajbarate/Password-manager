import React from 'react'

const Navbar = () => {
  return (
    <div>
      <nav className="bg-purple-200 flex justify-between px-5 py-4" >
        <div className="logo">Passop</div>
       <ul>
        <li className=" sm:p-4 flex gap-10"> 
            <a className='hover:font-bold' href="/">Home</a>
            <a className='hover:font-bold' href="#">About</a>
            <a className='hover:font-bold' href="#">Contact</a>
            <a className='hover:font-bold' href="#">Login</a>
        </li>
       </ul>
      </nav>
    </div>
  )
}

export default Navbar
