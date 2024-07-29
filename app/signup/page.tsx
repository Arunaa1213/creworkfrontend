"use client";
import { useContext, useState } from 'react';
import Link from 'next/link';
import React from 'react';
import validate from '../components/steroid';
// import { useUserContext } from '../userContext';
// import { useRouter } from 'next/router';
// import { UserContext } from '../context/userContext';
// import { validatelogin } from '../utils/steroid';
// import GoogleLogin from '../components/GoogleLogin';

const Signup: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [nameError, setNameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  // const { setUserInfo, userInfo } = useUserContext();
//   const { setUserInfo } = useContext(UserContext);
//   const router = useRouter();

    const signinClick = async (ev: React.FormEvent) => {
        ev.preventDefault();
        console.log('URL', process.env.NEXT_PUBLIC_API_URL);
        
       console.log('signin clicked', name, email, password);
       const formState = {
        name,
        email,
        password
       }
      const result = validate(formState);
      setNameError(result.name);
      setEmailError(result.email);
      setPasswordError(result.password);

      if (result.name === 'True' && result.email === 'True' && result.password === 'True') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({
                name: formState.name,
                email: formState.email,
                password: formState.password
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status !== 200) {
            alert('Registration failed');
        } else {
            alert('Registration successful');
        }
    }
    }

  return (
    <div className="relative flex items-start justify-center bg-gradient-to-r from-indigo-200 to-yellow-100">
      <div className="flex justify-center my-12">
        <div className="container">
          <form className="flex flex-col justify-center items-center" onSubmit={signinClick}>
            <h5 className="text-2xl text-blue-500 mb-4">Signup</h5>
            <div className="space-y-8 w-6/12 p-12 bg-white/20 backdrop-blur-sm border border-indigo-300 rounded-md">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(ev) => {
                      setName(ev.target.value);
                      setNameError('');
                    }}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focuc:border focus:border-purple-300 sm:text-sm sm:leading-6"
                  />
                </div>
                {nameError !== 'True' && (
                  <div id="nameError" className="text-red-600 font-medium text-sm mt-2">
                    {nameError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(ev) => {
                      setEmail(ev.target.value);
                      setEmailError('');
                    }}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focuc:border focus:border-purple-300 sm:text-sm sm:leading-6"
                  />
                </div>
                {emailError !== 'True' && (
                  <div id="emailError" className="text-red-600 font-medium text-sm mt-2">
                    {emailError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    value={password}
                    onChange={(ev) => {
                      setPassword(ev.target.value);
                      setPasswordError('');
                    }}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {passwordError !== 'True' && (
                  <div id="passwordError" className="text-red-600 font-medium text-sm mt-2">
                    {passwordError}
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center flex-col">
                <button
                  type="submit"
                  className="w-full mb-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Signup
                </button>
                <div className="mb-2">
                  <p> Dont have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
                </div>
                {/* <GoogleLogin /> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
