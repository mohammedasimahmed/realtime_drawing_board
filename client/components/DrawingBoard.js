import useOnDraw from "@/utils/useOnDraw";
import React, { useEffect } from "react";
import drawLine from "@/utils/drawLine";

const DrawingBoard = ({ socket, height, width }) => {
  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(onDraw);
  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#000000", 5);
    socket.emit("send_drawing", prevPoint, point, "#000000", 5, height, width);
  }

  useEffect(() => {
    const ctx = document.getElementById("renderCanvas").getContext("2d");
    socket.on(
      "receive_drawing",
      (prevPoint, point, color, linewidth, OtherHeight, OtherWidth) => {
        if (prevPoint) {
          const canvHeight =
            document.getElementById("renderCanvas").offsetHeight;
          const canvWidth = document.getElementById("renderCanvas").offsetWidth;
          prevPoint.y = prevPoint.y * (canvHeight / OtherHeight);
          point.y = point.y * (canvHeight / OtherHeight);
          prevPoint.x = prevPoint.x * (canvWidth / OtherWidth);
          point.x = point.x * (canvWidth / OtherWidth);
          drawLine(prevPoint, point, ctx, color, linewidth);
        }
      }
    );
  }, []);
  return (
    <canvas
      onMouseDown={onCanvasMouseDown}
      onTouchStart={onCanvasMouseDown}
      ref={setCanvasRef}
      width={width}
      height={height}
      id="renderCanvas"
      className="bg-white rounded"
    />
  );
};

export default DrawingBoard;
