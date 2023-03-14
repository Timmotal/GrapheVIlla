import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from "../client";
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: {postedBy, image, _id, destination, save }}) => {

    const [postHovered, setPostHovered] = useState(false);
    // const [savingPost, setSavingPost] = useState(false); so we removed this, becuase it's hapenning so fast
    const navigate = useNavigate();

//     // so we already used this line in Home jsx, now it's time to turn it into a utility function
//     const userInfo = localStorage.getItem('user') !== 'undefined' ?
//    JSON.parse(localStorage.getItem('user')) : localStorage.clear();
       const user = fetchUser(); 


// console.log(save)
    //    double exclamation right here is legit for real,i like it
       const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub))?.length;    
       // so we are looping over the saved pins and checking if  a user id is already there, in the people who like that post
    //    adrian also teaches us some advanced things, we modified and got the length of alreadySaved, and compare it the the
    //  array result we get from filter method
    // we are trying to get a real boolean from alreadysaved, first we got the lenngth of the array, then we want to translate 0 and 1 to boolean
    // is this not what we did in the tetris game that Plamoni explained to me?
    // 1, [2, 3, 1] -> [1].length -> 1 -> !1 -> false -> !false -> true
    // 4, [2, 3, 1] -> [].length -> 0 -> !0 -> true -> !true -> false--when id is not found in the array-------------- bro can you feel the IQ here man???? tooo lit (02:41:32)
    // 1 corresponds to "TRUE" & 0 is "FALSE"

    const savePin = (id) => {
        // if(alreadySaved?.length === 0) // this would not be ideal
        if(!alreadySaved){ // bcos of that IQ double "!!", we can do things like this
            // setSavingPost(true);

            // how are we really saving to the database from here?
            client // update the document in the Sanity DB
                .patch(id) //i also remember solutions in javascript having this order, when you want to call multiple methods on something, a function perhaps
                .setIfMissing({ save: []}) // we initialized the array to be empty array here
                .insert('after', 'save[-1]', [{ // save[-1] means save at the end of the array
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    // setSavingPost(false)
                })
        }
    } //i dont fully get saving to Database yet, so he says
    //  we patch the post with an "ID"
    // add an Array
    // inset a document
    // commit
    // then do something else, whatever you want, we reloaded the page here

    const deletePin = (id) => {
    client
    .delete(id)
    .then(() => {
        window.location.reload();
    })
}


  return (
    <div className='m-2'>
        <div
            className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
        >

        <img src={urlFor(image).width(250).url()} alt="user-post" className="rounded-lg w-full object-" />
        {postHovered && (
            <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                 style={{ height: '100%' }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <a href={`${image?.asset?.url}?dl=`}
                           download
                           onClick={(e) => e.stopPropagation()} // this stops the click from further propagating through the image, it justs propagate only to the element clicked
                           className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    {/* {alreadySaved?.length !== 0 ? ( //so he asks, how are we going to get access to this variable, first we get access to user variable, which is in the localStorage */}
                       {alreadySaved ? (  
                        <button
                            type='button'
                            className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                        >
                           {save?.length} Saved
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                savePin(_id);
                            }} 
                            type='button'
                            className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                            Save
                        </button>
                    )}
                </div>
                <div className="flex justify-between items-center gap-2 w-full">
                    {destination && (
                        <a  href={destination}
                            target="_blank"
                            rel="noreferrer" 
                            className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md"
                            >
                                <BsFillArrowUpRightCircleFill />
                                {destination .length > 15 ? `${destination.slice(0, 15)}...` : destination}
                                {/* {destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)} */}
                                {/* can you feel simple logic here bro */}
                                
                            </a>
                    )}

                          {postedBy?._id === user?.sub && (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      deletePin(_id);
                                  }}
                                  type='button'
                                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none'
                              >
                                <AiTwotoneDelete />
                              </button>
                          )}
                </div>
            </div>
        )}
        </div>

        <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
            <img 
                src={postedBy?.image} 
                alt="postedBy-profile" 
                className="h-8 w-8 rounded-full object-cover" 
            />
            <p className="font-semibold capitalize">{postedBy?.userName}</p>
        </Link>
        
        {/* Pin */}
        
    </div>
  )
}

export default Pin