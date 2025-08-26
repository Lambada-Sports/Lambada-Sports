/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import ElementsPanel from "./ElementsPanel";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function DesignEditor({ userImage, setSelectedDesignURL }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [fabricInstance, setFabricInstance] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cropRect, setCropRect] = useState(null);
  const [isErasing, setIsErasing] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, user } =
    useAuth0();

  const navigate = useNavigate();
  const location = useLocation();

  const { sport, fit, style, product_id, product } = location.state || {};

  // API function to save design
  const saveDesignToAPI = async (designData) => {
    if (!isAuthenticated) {
      await loginWithRedirect();
      return;
    }

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        "http://localhost:5000/api/customer/design",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user && user.sub,
            product_id: product_id || 1,
            design_data: designData,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const result = await response.json();
      console.log(" Design saved successfully:", result);
      return result;
    } catch (error) {
      console.error(" Failed to save design:", error);
      throw error;
    }
  };

  // Save to history
  const saveToHistory = () => {
    if (!canvas) return;
    const current = canvas.toJSON();
    setHistory((prev) => [...prev, current]);
    setRedoStack([]);
  };

  // Canvas init
  useEffect(() => {
    const init = async () => {
      const fabricModule = await import("fabric");
      const fabric =
        fabricModule.fabric || fabricModule.default || fabricModule;
      window.fabric = fabric;

      setFabricInstance(fabric);

      if (canvasRef.current && canvasRef.current.__fabricCanvas) {
        canvasRef.current.__fabricCanvas.dispose();
      }

      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: 750,
        height: 700,
        backgroundColor: "#fff",
      });

      canvasRef.current.__fabricCanvas = newCanvas;
      setCanvas(newCanvas);

      //  Mask image load
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = "/textures/sample.png";
      bgImg.onload = () => {
        const fabricBg = new fabric.Image(bgImg, {
          left: 0,
          top: 0,
          scaleX: newCanvas.width / bgImg.width,
          scaleY: newCanvas.height / bgImg.height,
          selectable: false,
          evented: false,
          absolutePositioned: true,
        });

        newCanvas.clipPath = fabricBg;
        newCanvas.backgroundImage = fabricBg;
        newCanvas.requestRenderAll();
        newCanvas.renderAll();
        saveToHistory();
      };
    };

    init();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgData = reader.result;
        setEditorImage(imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load User Image
  useEffect(() => {
    const imageToUse = editorImage || userImage;

    if (fabricInstance && canvas && imageToUse) {
      console.log("Step 1: fabricInstance, canvas, userImage available");

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageToUse;

      img.onload = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;

        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const left = (canvas.width - img.width * scale) / 2;
        const top = (canvas.height - img.height * scale) / 2;

        const fabricImg = new window.fabric.Image(img, {
          left,
          top,
          scaleX: scale,
          scaleY: scale,
          hasBorders: true,
          hasControls: true,
          selectable: true,
          opacity: 0.7,
        });

        fabricImg._tempCanvas = tempCanvas;
        fabricImg._tempCtx = ctx;

        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.renderAll();
        setIsImageLoaded(true);
        setActiveImage(fabricImg);
        saveToHistory();
      };

      img.onerror = () => {
        console.error("Image load error! Check CORS or base64 issues.");
      };
    }
  }, [userImage, canvas, fabricInstance, editorImage]);

  const isShapeOverTransparentArea = async (shape, maskImage) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = maskImage.src;

      img.onload = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const shapeLeft = shape.left;
        const shapeTop = shape.top;
        const shapeRight = shapeLeft + shape.width * shape.scaleX;
        const shapeBottom = shapeTop + shape.height * shape.scaleY;

        const scaleX = img.width / 750;
        const scaleY = img.height / 700;

        let isOverTransparent = false;

        for (let y = shapeTop; y < shapeBottom; y += 2) {
          for (let x = shapeLeft; x < shapeRight; x += 2) {
            const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
            const alpha = pixel[3];

            if (alpha < 10) {
              isOverTransparent = true;
              resolve(true);
              return;
            }
          }
        }

        resolve(false);
      };

      img.onerror = () => {
        console.error("Failed to load mask image");
        resolve(false);
      };
    });
  };

  // Eraser functionality
  const handleErase = () => {
    if (!canvas || !fabricInstance || !activeImage || !isImageLoaded) {
      console.warn("Cannot erase: Missing required setup");
      return;
    }

    const active = activeImage;

    if (!active._tempCanvas || !active._tempCtx) {
      console.warn("Cannot erase: tempCanvas or ctx missing");
      return;
    }

    setIsErasing(true);
    canvas.selection = false;
    canvas.discardActiveObject();
    canvas.defaultCursor = "crosshair";
    active.selectable = false;

    let lastPoint = null;
    const radius = 15;

    const moveHandler = (opt) => {
      if (!isErasing) return;

      const pointer = canvas.getPointer(opt.e);
      const ctx = active._tempCtx;

      const x = (pointer.x - active.left) / active.scaleX;
      const y = (pointer.y - active.top) / active.scaleY;

      if (lastPoint) {
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(dist / 2);

        for (let i = 0; i < steps; i++) {
          const px = lastPoint.x + (dx * i) / steps;
          const py = lastPoint.y + (dy * i) / steps;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, 2 * Math.PI);
          ctx.clip();
          ctx.clearRect(px - radius, py - radius, radius * 2, radius * 2);
          ctx.restore();
        }

        const updatedURL = active._tempCanvas.toDataURL();

        active.setSrc(updatedURL, () => {
          canvas.renderAll();
        });
      }

      lastPoint = { x, y };
    };

    const downHandler = () => {
      lastPoint = null;
      canvas.on("mouse:move", moveHandler);
    };

    const upHandler = () => {
      canvas.off("mouse:move", moveHandler);
      active.selectable = true;
      canvas.selection = true;
      canvas.defaultCursor = "default";
      setIsErasing(false);
      saveToHistory();
    };

    canvas.on("mouse:down", downHandler);
    canvas.on("mouse:up", upHandler);
  };

  const handleStopErase = () => {
    setIsErasing(false);
    if (!canvas) return;
    canvas.selection = true;
    canvas.defaultCursor = "default";
    canvas.off("mouse:move");
    canvas.off("mouse:down");
    canvas.off("mouse:up");
    if (activeImage) activeImage.selectable = true;
  };

  // Crop functionality
  const handleStartCrop = () => {
    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") return;

    const rect = new fabricInstance.Rect({
      left: active.left + 30,
      top: active.top + 30,
      width: active.width * active.scaleX * 0.5,
      height: active.height * active.scaleY * 0.5,
      fill: "rgba(0,0,0,0.2)",
      stroke: "blue",
      strokeWidth: 1,
      hasBorders: true,
      hasControls: true,
    });

    setCropRect(rect);
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const handleApplyCrop = () => {
    if (!cropRect || !canvas) return;
    const image = canvas.getObjects("image").find((obj) => obj !== cropRect);
    if (!image) return;

    const cropX = cropRect.left - image.left;
    const cropY = cropRect.top - image.top;

    image.set({
      cropX: cropX / image.scaleX,
      cropY: cropY / image.scaleY,
      width: cropRect.width / image.scaleX,
      height: cropRect.height / image.scaleY,
    });

    canvas.remove(cropRect);
    setCropRect(null);
    canvas.setActiveObject(image);
    canvas.renderAll();
    saveToHistory();
  };

  const handleDelete = () => {
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
      saveToHistory();
    }
  };

  const handleUndo = () => {
    if (history.length < 2) return;
    const prev = [...history];
    prev.pop();
    const last = prev[prev.length - 1];
    setRedoStack((r) => [...r, canvas.toJSON()]);
    setHistory(prev);
    canvas.loadFromJSON(last, () => canvas.renderAll());
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack.pop();
    setRedoStack([...redoStack]);
    setHistory((h) => [...h, last]);
    canvas.loadFromJSON(last, () => canvas.renderAll());
  };

  // Apply Design (just update the state and 3D model)
  const handleApplyDesign = () => {
    if (canvas) {
      canvas.discardActiveObject();
      canvas.renderAll();

      const dataURL = canvas.toDataURL({ format: "png", quality: 0.7 });
      setSelectedDesignURL(dataURL);
      setIsModified(false);

      console.log(" Design applied to 3D view!");
    }
  };

  // Save Design
  const handleSaveDesign = async () => {
    if (!canvas) return;

    setIsSaving(true);

    try {
      const maskImg = new Image();
      maskImg.crossOrigin = "anonymous";
      maskImg.src = "/textures/sample.png";

      maskImg.onload = async () => {
        try {
          const objects = canvas.getObjects();
          const shapesToRemove = [];

          for (let obj of objects) {
            if (obj.type !== "image") {
              const isInvalid = await isShapeOverTransparentArea(obj, maskImg);
              if (isInvalid) {
                shapesToRemove.push(obj);
              }
            }
          }

          shapesToRemove.forEach((obj) => canvas.remove(obj));

          canvas.discardActiveObject();
          canvas.renderAll();

          const dataURL = canvas.toDataURL({
            format: "png",
            quality: 0.7,
            multiplier: 1,
          });

          const designData = {
            canvasData: canvas.toJSON(),
            imageURL: dataURL,
            sport,
            fit,
            style,
            timestamp: new Date().toISOString(),
            metadata: {
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              objectCount: canvas.getObjects().length,
            },
          };

          console.log(" Saving design data:", designData);

          const savedDesign = await saveDesignToAPI(designData);
          console.log(" Design saved successfully with ID:", savedDesign.id);

          navigate("/order-form", {
            state: {
              designImage: dataURL,
              sport,
              fit,
              style,
              designId: savedDesign.id,
              product_id,
            },
          });
        } catch (apiError) {
          console.error(" API Error:", apiError);

          alert(
            "Failed to save design. Please check your connection and try again."
          );

          const dataURL = canvas.toDataURL({
            format: "png",
            quality: 0.7,
            multiplier: 1,
          });

          navigate("/order-form", {
            state: {
              designImage: dataURL,
              sport,
              fit,
              style,
              product_id,
              saveError: true,
            },
          });
        } finally {
          setIsSaving(false);
        }
      };

      maskImg.onerror = () => {
        console.error("Failed to load mask image");
        setIsSaving(false);
        alert("Error processing design. Please try again.");
      };
    } catch (error) {
      console.error(" Unexpected error:", error);
      setIsSaving(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const [showElementsPanel, setShowElementsPanel] = useState(false);

  const addShape = (type) => {
    if (!canvas || !fabricInstance) return;

    let shape;

    switch (type) {
      case "rect":
        shape = new fabricInstance.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 60,
          fill: "white",
          stroke: "black",
          strokeWidth: 0,
        });
        break;
      case "circle":
        shape = new fabricInstance.Circle({
          left: 120,
          top: 120,
          radius: 40,
          fill: "lightgreen",
          stroke: "black",
          strokeWidth: 0,
        });
        break;
      case "triangle":
        shape = new fabricInstance.Triangle({
          left: 140,
          top: 140,
          width: 80,
          height: 80,
          fill: "orange",
          stroke: "black",
          strokeWidth: 0,
        });
        break;
      case "line":
        shape = new fabricInstance.Line([50, 50, 150, 50], {
          left: 160,
          top: 160,
          stroke: "black",
          strokeWidth: 3,
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    saveToHistory();
    setIsModified(true);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={750} height={700} />
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />
        </div>

        <button
          onClick={() => setShowElementsPanel(!showElementsPanel)}
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          Elements
        </button>

        {showElementsPanel && <ElementsPanel onAddShape={addShape} />}

        <input
          type="color"
          onChange={(e) => {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.set) {
              activeObject.set("fill", e.target.value);
              canvas.renderAll();
            }
          }}
        />

        <button
          onClick={handleErase}
          disabled={!isImageLoaded}
          className={`px-3 py-1 rounded ${
            isImageLoaded
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Erase
        </button>

        <button
          onClick={handleStopErase}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Stop Erase
        </button>
        <button
          onClick={handleStartCrop}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Start Crop
        </button>
        <button
          onClick={handleApplyCrop}
          className="bg-yellow-700 text-white px-3 py-1 rounded"
        >
          Apply Crop
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-700 text-white px-3 py-1 rounded"
        >
          Delete Image
        </button>
        <button
          onClick={handleUndo}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Redo
        </button>

        {isModified ? (
          <>
            <button
              onClick={handleApplyDesign}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Apply Design
            </button>

            <button
              onClick={handleSaveDesign}
              disabled={isSaving}
              className={`px-3 py-1 rounded ${
                isSaving
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isSaving ? "Saving..." : "Save Design"}
            </button>
          </>
        ) : (
          <button
            onClick={handleSaveDesign}
            disabled={isSaving}
            className={`px-3 py-1 rounded ${
              isSaving
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Design"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <label htmlFor="opacitySlider">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={(e) => {
            const opacity = parseFloat(e.target.value);
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
              activeObject.set("opacity", opacity);
              canvas.renderAll();
            }
          }}
        />
      </div>

      {/* Loading overlay when saving */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Saving your design...</p>
          </div>
        </div>
      )}
    </div>
  );
}
