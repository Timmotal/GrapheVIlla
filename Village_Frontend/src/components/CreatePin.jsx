import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';
import Login from './Login';

const CreatePin = ({ user }) => {

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    // if(selectedFile.type === 'image/png' || selectedFile.type == 'image/svg'){}
    // it was geeting a bit too Login, so we destructured it to below
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true);

      client.assets
      .upload('image', e.target.files[0], { contentType: type, filename: name})// i think upload here is coming from sanity, but how does VS code know it ?
      .then((document) => {
        setImageAsset(document);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Image upload error', error);
      })
    } else {
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category){
      const doc = { // we take all the above parameters and then make a document
        _type: 'pin', //we need to specify this, so it corresponds to a specific schema in the database
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id //image are stored as asset somewhere else on the databse, so we are referencing it here
          }
        },
        userId: user?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id,
        },
      category,
      }

      client.create(doc)
        .then(() => {
          navigate('/')
        })
    } else {
      setFields(true);

      setTimeout(() => setFields(false), 2000)

    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {/* Neck */}
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Kindly fill all the fields.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:4-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex flex-col items-center justify-center border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                {/*  htmlFor="", this caused me a lil bug */}
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload className='' />
                    </p>
                    <p className='text-lg'>Click To Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    use high quality JPG, SVG, PNG or Tiff less than 20 Mb
                  </p>
                </div>
                <input 
                  type="file" 
                  name="upload-image"
                  className="w-0 h-0"
                  onChange={uploadImage} 
                  />
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="uploaded-image" className='w-full h-full' />
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        
      <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
              <input
                 type="text"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="Add your title here"
                 className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
              />
              {user && (
                <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                  <img 
                    src={user.image} 
                    alt="user-profile" 
                    className="w-10 h-10 rounded-full" 
                    />
                    <p className="font bold">{user.userName}</p>
                </div>
              )}
              <input
                 type="text"
                 value={about}
                 onChange={(e) => setAbout(e.target.value)}
                 placeholder="What is your pin about?"
                 className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
              />
              <input
                 type="text"
                 value={destination}
                 onChange={(e) => setDestination(e.target.value)}
                 placeholder="Add a destination url!"
                 className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
              />
              <div className="flex flex-col">
              <div>
                  <p className="mb-2 font-semibold text-lg sm:text-xl capitalize">Choose pin category</p>
                  <select 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer">
                      <option 
                        value="" 
                        className="bg-white capitalize"> 
                           Select category
                      </option>
                      {categories.map((category) => (
                        <option 
                          className='text-base capitalize bg-white border-0 outline-none text-black' 
                          key={category.name}
                          value={category.name}>
                            {category.name}
                          </option>
                      ))}
                  </select>
              </div>

              <div className="flex justify-end items-center mt-5">
               <button
                type='button'
                onClick={savePin} 
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none">
                Save Pin
               </button>
              </div>

              </div>
      </div>        

      </div>
    </div>
    // <div>CreatePin</div>
  )
}

export default CreatePin