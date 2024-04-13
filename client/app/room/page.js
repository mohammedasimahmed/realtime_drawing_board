import DrawingRoom from "@/components/DrawingRoom";
import React from "react";

const page = ({ searchParams }) => {
  return (
    <div className="w-screen h-screen bg-gray-900 ">
      <DrawingRoom roomid={searchParams.id} />
    </div>
  );
};

export default page;
