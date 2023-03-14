import React from 'react';
import { Dna } from 'react-loader-spinner';


const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
          <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
          />
        {/* <Loader
            type="Circle"
            color="#00bfff"
            height={50}
            width={200}
            className="m-5"
            /> */}
                <p className="text-lg text-center px-2">
                    {message}
                </p>
    </div>
    // <div>Spinner</div>
  )
}

export default Spinner