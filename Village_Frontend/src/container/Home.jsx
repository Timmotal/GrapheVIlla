import React, { useState, useRef, useEffect } from 'react'; //3 most important hooks in React
import { HiMenu } from 'react-icons/hi'; //look well bro "Hi" and "Ai" two different familie
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

// import Sidebar from '../components/Sidebar'; we optimized this to that below
// import UserProfile from '../components/UserProfile';
import { Sidebar, UserProfile } from '../components'; //make your many imports readable
import Pins from './Pins';
import { client } from '../client';
import graphevilla from '../assets/graphevilla.png';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';


const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();


  //     // so we already used this line in Home jsx, now it's time to turn it into a utility function
//     const userInfo = localStorage.getItem('user') !== 'undefined' ?
//    JSON.parse(localStorage.getItem('user')) : localStorage.clear();
       const userInfo = fetchUser();
   
  // sometime we wont have the user

  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    if(!userInfo) {navigate('/login')}

    client.fetch(query) // [first] fetch something
    .then((data) => { // [then] you do something
      setUser(data[0]); 
      // can you notice setUser is going to be a state field
    })
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0); // at the start, we set scroll to be at Top of Page
  }, []); //this is a Dead Mount useEffect

  return (
    <div className='flex bg-hightlight2 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
         {/* Home */}
         <div className="hidden md:flex h-screen flex-initial">
          {/* will be hidden on all devices, except from medium devices downward */}
          {/* the below means, if user exists then simply render the user, else false */}
          <Sidebar user={user && user} />
          {/* the above is DESKTOP SIDE BAR */}
         </div>
         <div className="flex md:hidden flex-row">
          {/* we forgot to add this div below thank the heavens we remember now */}
          <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={graphevilla} alt="logo" className='w-40 ' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className='w-28 rounded-full' />
          </Link>
          </div>
          
          {toggleSidebar && (
            <div className="fixed w-45 bg-hightlight4  h-screen overflow-y-auto shadow-md z-10 animate-slide-in ">
              <div className="absolute w-full flex justify-end p-2">
                <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
              </div>
              {/* our MOBILE SIDE BAR, i got lost initially */}
              <Sidebar user={user && user} closeToggle={setToggleSidebar} /> {/* IF USER EXISTS THEN PASS IN THE USER  */}
            </div>
          )}

         </div>
         <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
          <Routes>
            {/* here the ":" stands for a dynamic userId */}
            <Route path='/user-profile/:userId' element={<UserProfile />} />
            {/* so if we got to forward slash, anything else, we simply render PINS to the DOM */}
            <Route path='/*' element={<Pins user={user && user} />} />
          </Routes>
         </div>
    </div>
  )
}

export default Home