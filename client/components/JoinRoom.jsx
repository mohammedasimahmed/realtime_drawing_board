"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const JoinRoom = () => {
  const router = useRouter();
  const inpRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inpRef.current.value.trim()) {
      alert("Room ID cannot be empty!");
      return;
    }
    router.push(`room?id=${inpRef.current.value}`);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 flex items-center">
      <div className="w-screen h-fit">
        <h1 className="text-white text-2xl sm:text-4xl  text-center font-semibold p-3">
          Collaborative WhiteBoard
        </h1>
        <div className="w-screen p-5 ">
          <form className="bg-gray-800 w-full text-white rounded-lg shadow-md p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              Join Room
            </h2>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-400 text-sm font-bold mb-2"
              >
                Enter Room ID
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-600 rounded-md p-2 bg-gray-700"
                placeholder="Enter Room ID"
                required
                ref={inpRef}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full"
              onClick={(e) => handleSubmit(e)}
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
