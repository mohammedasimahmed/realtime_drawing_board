import { useEffect, useRef } from "react";

export default function useOnDraw(onDraw) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);

  const mouseMoveListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  function setCanvasRef(ref) {
    canvasRef.current = ref;
  }

  function onCanvasMouseDown() {
    isDrawingRef.current = true;
  }

  useEffect(() => {
    function computePointInCanvas(clientX, clientY) {
      if (canvasRef.current) {
        const boundingRect = canvasRef.current.getBoundingClientRect();
        return {
          x: clientX - boundingRect.left,
          y: clientY - boundingRect.top,
        };
      } else {
        return null;
      }
    }
    function initMouseMoveListener() {
      const mouseMoveListener = (e) => {
        if (isDrawingRef.current && canvasRef.current) {
          let point;
          if (e.type === "mousemove") {
            point = computePointInCanvas(e.clientX, e.clientY);
          } else if (e.type === "touchmove") {
            point = computePointInCanvas(
              e.touches[0].clientX,
              e.touches[0].clientY
            );
          }
          const ctx = canvasRef.current.getContext("2d");
          if (onDraw) onDraw(ctx, point, prevPointRef.current);
          prevPointRef.current = point;
        }
      };
      mouseMoveListenerRef.current = mouseMoveListener;
      window.addEventListener("mousemove", mouseMoveListener);
      window.addEventListener("touchmove", mouseMoveListener);
    }

    function initMouseUpListener() {
      const listener = () => {
        isDrawingRef.current = false;
        prevPointRef.current = null;
      };
      mouseUpListenerRef.current = listener;
      window.addEventListener("mouseup", listener);
      window.addEventListener("touchend", listener);
    }

    function cleanup() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("touchmove", mouseMoveListenerRef.current);
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
        window.removeEventListener("touchend", mouseUpListenerRef.current);
      }
    }

    initMouseMoveListener();
    initMouseUpListener();
    return () => cleanup();
  }, [onDraw]);

  return {
    setCanvasRef,
    onCanvasMouseDown,
  };
}
