import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
// local imports
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {

  const userImg = fetchUser().picture;
  // const userTitle = fetchUser().name;
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();
  // console.log(pinId + " pin Id");
  // console.log(pins + " okay na ")
  
  // now i actually get how useParams work, 
  // the dynamic url we assigned to the pinDetails is what useParams get
  // we get it by destructuring our assigned dynamic url from the useParams hook;

  //  adrian says it, it important is called above all "if statements"
  // if(!pinDetail) return <Spinner message="Configuring molecules for pin..." />
  // so then we move the above to below to useEffect

  const addComment = () => {
    if(comment) { 
      setAddingComment(true);

      console.log(comment);

      client 
      .patch(pinId)
     
      .setIfMissing({ comments: []})
      .insert('after', 'comments[-1]', [{
        comment,
        _key: uuidv4(),
        postedBy: {
          _type:'postedBy',
          _ref: user._id
        }
        }])
        // after we insert something, we have to commit it
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
          // window.location.reload(); na me add this line bro
        })
    }
    // console.log(comment+ " comment");
    // console.log(comments+ " commentsssssss");
 
  }
  
  // console.log({pinId})

   const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId); // we changed this from "const" to "let"
    // let res;

     
    if(query) { 
      client.fetch(query)
      .then((data) => { // this returns an array
        setPinDetail(data[0]); // so here we got the first item from the array

        if(data[0]) { // the magic line, hehe that gets the category for us, and i dont fully comprehennd the DB yet
          query = pinDetailMorePinQuery(data[0]); // i just do nit understand how the data flow really works bro
          // console.log(data);
          // console.log(data[0]);
          client.fetch(query)
          .then((res) => setPins(res)); //i added extra braces ((res)), gave me couple of headaches
          // console.log(res + " res what")
        }
      })
    }
   }
   

  //  adrian says it, it important is called above all "if statements"
   useEffect(() => {
    fetchPinDetails(); //i think we use useEffect when we want to make a change based on the state changes
   }, [pinId])
  
   if(!pinDetail) return <Spinner message="Configuring molecules for pin..." />
  //  console.log(pins + " I CANT BE WITHOUT DATA, DEY THERE NA");

  return (
    <>
    <div 
      className="flex xl-flex-row flex-col m-auto bg-white"
      style={{ maxWidth: '1500px', borderRadius: '32px'}}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img 
            src={pinDetail?.image && urlFor(pinDetail.image).url()} 
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post" 
            />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
            <a href={`${pinDetail?.image?.asset?.url}?dl=`}
                           download
                           onClick={(e) => e.stopPropagation()} // this stops the click from further propagating through the image, it justs propagate only to the element clicked
                           className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                        >
                            <MdDownloadForOffline />
                        </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link to={`user-profile/${pinDetail?.postedBy?._id}`} className="flex gap-2 mt-5 bg-white rounded-lg items-center">
            <img 
                src={pinDetail?.postedBy?.image} 
                alt="user-profile" 
                className="h-8 w-8 rounded-full object-cover" 
            />
            <p className="font-semibold capitalize">{pinDetail?.postedBy?.userName}</p>
        </Link>
        <h2 className="mt-5 text-2xl">Comments</h2>
        <div className="max-h-370 overflow-y-auto">
          {pinDetail?.comments?.map((comment, i) => ( //we had some errors because we didn't add '?'
          // so whenever you are not sure if an object has a particular property, definitely use a question mark "?"
            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                 key={i}>
              <img 
                src={comment?.postedBy?.image} 
                // src={userImg}
                alt="user-profile" 
                className="w-10 h-10 rounded-full cursor pointer" />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-6 gap-3">
        <Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
            <img 
                // src={pinDetail?.postedBy?.image} 
                src={userImg}
                alt="user-profile" 
                className="h-10 w-10 rounded-full cursor-pointer" 
            />
        </Link>
        {/* We Are Implementing The Add Comment Section Here */}
        <input 
          type="text" 
          className="flex-1 border-gray-200 outline-none border-2 p-2 rounded-xl focus:border-gray-300"
          placeholder='Add your comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)} />
          <button 
            className="bg-red-500 text-white rounded-full px-6 py-2 font-semi-bold text-base outline-none"
            type="button"
            onClick={addComment}
            >
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
        </div>
        </div>
      </div>
      {/* // {console.log(pins  + "  category length")} */}
      {pins?.length > 0 ? (
        <>
        <h2 className="text-center font-bold text-2x mt-8 mb-4">
        Want more berries
        </h2>
        <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="no other berries for you..." />
      )}
  
    </>
  )
}

export default PinDetail