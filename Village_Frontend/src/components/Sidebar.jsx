import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import graphevilla from '../assets/graphevilla.png';
import { categories } from '../utils/data';

const Sidebar = ({user, closeToggle }) => {

  const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
  const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

  // const categories = [
  //   { name: 'Bombo' },
  //   { name: 'Cacara' },
  //   { name: 'Expelimus' },
  //   { name: 'Nengbuneng' },
  //   { name: 'Scopatumana' }, 
  // ] //-----------------this was supposed to be outside the function

  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false);
    // (01:33:30) some reason why we are falsing closeToggle when it doest exist
  }
  
  return (
        <div className="flex flex-col justify-between bg-hightlight4 h-full overflow-y-scroll hide-scrollbar min-w-210 ">
          <div className="flex flex-col">
            <Link to="/" className='flex px-5 gap-2 my-6 pt-1 w-200 items-center'
                         onClick={handleCloseSidebar}>
              <img src={graphevilla} alt="logo" className="w-full" />
            </Link>
            <div className="flex flex-col gap-5">
              <NavLink to="/"
                       className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle} 
                       onClick={handleCloseSidebar}>
                        <RiHomeFill />
                        Home
              </NavLink>
              <h3 className="mt-2 px-5 text-base 2xl:text-xl">
                Explore Categories
                </h3>
                {categories.slice(0, categories.length - 1).map((category) => (
                  <NavLink to={`/category/${category.name}`}
                           className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle} 
                           onClick={handleCloseSidebar}
                           key={category.name}
                  >
                    <img 
                      src={category?.image} 
                      alt="category" 
                      className="w-8 h-8 rounded-full shadow-sm" />
                    {category.name}
                    
                  </NavLink>
                ))}
            </div>
          </div>
          {user && (
            <Link
            className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
              to={`user-profile/${user._id}`}
              onClick={handleCloseSidebar}
              >
            <img src={user.image} alt="user-profile" className="w-10 h-10 rounded-full" />
            <p>{user.userName}</p>
            </Link>
          )}
        </div>
  )
}

export default Sidebar