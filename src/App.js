import React from 'react'
import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import ContactForm from './pages/ContactForm'
import ContactTable from './pages/ContactList'

const App = () => {
  return (
    <>
    <BrowserRouter>
<Navbar/>
  <Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/add-contact' element={<ContactForm/>}/>
  <Route path='/all-contacts' element={<ContactTable/>}/>
  </Routes>
    </BrowserRouter>
    
    
    </>
  )
}

export default App