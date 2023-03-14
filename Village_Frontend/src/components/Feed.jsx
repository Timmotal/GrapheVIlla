import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {

    const [loading, setLoading] = useState(false);
    const { categoryId } = useParams();
    const [pins, setPins] = useState(null);

    useEffect(() => {
      setLoading(true);
      
    
      if(categoryId){ //logic for fetching all of the pins for a specific category
        const query = searchQuery(categoryId); // pass the destructured param into the searchQuery

        client.fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
      } else {
        // we dont need to pass in the query, as we already have it in the database already
        client.fetch(feedQuery)  // whoa im surprised, ";" semicolon has sone effect here
        .then((data) => {
          setPins(data)
          setLoading(false);
          // https://resource.jsmasterypro.com/newsletter // i have subscribed to his newsletter
        })
      }
    }, [categoryId])
    

    if(loading) return <Spinner message="configuring your genes for evolution" />;
    // this will be dynamic, that is why we are passing it through the props, where though?

    if(!pins?.length) return <h2>No Pins Available</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed