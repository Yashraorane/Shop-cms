import React from 'react'

// app/login/page.js
export default function Login() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/3 bg-white p-8 shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your password"
              />
            </div>
            <button className="w-full py-2 bg-indigo-500 text-white rounded">Login</button>
          </form>
        </div>
      </div>
    );
  }
  