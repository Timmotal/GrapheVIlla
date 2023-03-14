// here the logic to connect the database (sanity) with the front end,
//  part of why i want to have a mern knowledge 
// is because i believe that knowing to to connect to a database 
// i self create will give me a higher perspective 
// on how to handle most database and maybe even API 

import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-12-01',
    useCdn: false,
    token: process.env.REACT_APP_SANITY_EDITOR_TOKEN ,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);