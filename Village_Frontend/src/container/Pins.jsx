import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components';// i thought we were importing from index, why not?

const Pins = ({ user }) => {

  const [ searchTerm, setSearchTerm ] = useState('');
  // why search term in pins and not search, because we need to share it across multiple components....Navbar and Search will have access to it

  return (    
  <div className="px-2 md:px-5">
      <div className="">
        {/* as he mentioned the Navbar will have access to the searchTerm, so we pass in the props */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route path='/pin-detail/:pinId' element={<PinDetail user={user} />} />
          {/* back in Homepage we are passing in user to the Pin Comp, which we pass in in above in the Arguements */}
          <Route path='/create-pin' element={<CreatePin user={user} />} />
          {/* we also need to pass in user to CreatePin, so that we are able to know who create a specific Pin */}
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path='/' element={<Feed />} /> 
          {/* the above is the only thing rendering on the page, why so */}
        </Routes>
      </div>
    </div>
    // <div>Pins</div> 
  )
}

export default Pins