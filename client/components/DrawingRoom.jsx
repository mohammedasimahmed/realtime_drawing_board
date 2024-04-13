"use client";
import DrawingBoard from "./DrawingBoard";
import socketInitialize from "@/utils/socketInitialize";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const DrawingRoom = ({ roomid }) => {
  const [socket, setSocket] = useState(socketInitialize());
  const [chat, setChat] = useState([]);
  const [value, setValue] = useState("");
  const router = useRouter();
  const boardParent = useRef(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const handleChats = (e) => {
    e.preventDefault();
    setChat((prevChats) => [...prevChats, value]);
    socket.emit("send_text", value);
    setValue("");
  };

  function clearCanvas() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear_canvas", roomid);
  }

  function handleResize() {
    if (boardParent.current) {
      setHeight(boardParent.current.offsetHeight);
      setWidth(boardParent.current.offsetWidth);
    }
  }

  useEffect(() => {
    socket.emit("join_room", roomid);
    socket.on("receive_text", (txt) => {
      setChat((prevChats) => [...prevChats, txt]);
    });
    socket.on("canvas_clear", (roomid) => {
      const canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    });
    if (boardParent.current) {
      setHeight(boardParent.current.offsetHeight);
      setWidth(boardParent.current.offsetWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="text-white w-screen h-screen flex flex-col justify-center">
        <div className="h-full md:h-4/5 p-6 pb-0 w-screen md:w-screen flex flex-col justify-between items-center md:flex-row  md:justify-around md:items-center">
          <div
            ref={boardParent}
            className="h-2/3 w-full md:h-full xl:w-[800px] lg:w-[700px] md:w-[520px]"
          >
            <DrawingBoard socket={socket} height={height} width={width} />
          </div>
          <div className="h-1/4 md:h-full flex flex-col w-full mt-2 md:mt-0 md:p-0 xl:w-[400px] lg:w-[320px] md:w-[250px]">
            <div className="w-full p-1 bg-green-900 text-white text-center text-xl font-semibold">
              Live Chat
            </div>
            <div className="flex-1 w-full bg-white rounded overflow-scroll">
              {chat.map((item, idx) => {
                return (
                  <div
                    className="text-black p-2 pb-1 hover:bg-slate-300"
                    key={idx}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
            <form action="" onSubmit={(e) => handleChats(e)} className="w-full">
              <input
                type="text"
                className="mt-1 rounded p-1 px-2 text-black w-full outline-none"
                placeholder="Enter Message"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </form>
          </div>
          <div className="w-screen bg-cyan-950 flex justify-center md:fixed md:bottom-0">
            <button
              className="text-white bg-red-700 text-xl p-2 rounded"
              onClick={() => router.push("/")}
            >
              Leave Room
            </button>
            <button
              className="text-white bg-green-700 text-xl p-2 rounded ml-1"
              onClick={clearCanvas}
            >
              Clear Board
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawingRoom;
