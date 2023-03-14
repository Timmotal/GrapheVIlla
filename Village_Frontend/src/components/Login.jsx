import React from 'react';
// import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import logo from '../assets/graphevilla.png';
import { GoogleLogin } from '@react-oauth/google';
import { client } from '../client';
import jwt_decode from 'jwt-decode';


const Login = () => {

    const navigate = useNavigate(); //to use it,we have to call it as a hook
    const responseGoogleFail = () => console.log('fail')

    const responseGoogle = (response) => {
        const decodedUserObj = jwt_decode(response.credential);
        console.log(decodedUserObj);
        console.log(response);
        localStorage.setItem('user', JSON.stringify(decodedUserObj));
        
        const { given_name, sub, picture } = decodedUserObj;

        const doc = {
            _id: sub, //prefix "under skull (_)" is for sanity to know which document we are creating
            _type: 'user',
            userName: given_name,
            image: picture,
        }

        // only create documents if it doesn't exist in database
        client.createIfNotExists(doc)
        .then(() => {
            navigate('/', {replace: true}) //call navigate as a function
        })
        // if response google is successful we should get redirected back to our local host 3000
        // and our user should be created in sanity dashboard
        // are all these comments necessaryy bro?
        // necessary like oxygen
    }
    // const user = false;

  return (

    <div className='flex justify-start items-center flex-col h-screen'>
          {/* Login */}
        <div className="relative w-full h-full"> 
        <section>
    <div className="pattern">
        <div className="face face1"></div>
        <div className="face face2"></div>
        
    </div>
  </section>
  <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0">
                <div className="p-5">
                    <img src={logo} width="180px" alt="logo" />
                </div>
                <div className="shadow-2xl">
                    <GoogleLogin
                        clientId={process.env.REACT_APP_SANITY_PROJECT_ID}
                        render={(renderProps) => (
                            <button
                                type='button'
                                className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                            >
                                <FcGoogle className='mr-4' />
                                Sign In With Google
                            </button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogleFail}
                        cookiePolicy="single_host_origin"
                    />
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Login;