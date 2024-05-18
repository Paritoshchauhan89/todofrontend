import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
<div className="container">
<div className="m-2">
<Link to="/add-contact"><button type="button" className="btn btn-outline-primary m-2">Add Contact </button></Link>
<Link to="/"><button type="button" className="btn btn-outline-primary m-2">View Contact </button></Link>
</div>
</div>

    
    
    
    </>
  )
}

export default Navbar