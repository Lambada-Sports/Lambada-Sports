/* eslint-disable no-unused-vars */
import { SketchPicker } from "react-color";
import { useState } from "react";
import DesignEditor from "./DesignEditor";

export default function SidebarPanel({
  selectedColor,
  setSelectedColor,
  selectedDesignURL,
  setSelectedDesignURL,
  setUserDesign,
}) {
  const [tab, setTab] = useState("Design");
  const [showEditor, setShowEditor] = useState(false);
  const [editorImage, setEditorImage] = useState(null);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Soccer Jersey F3 Basic</h1>

      <div className="flex space-x-2 mb-4">
        {["Design", "Colors", "Text", "Logos", "Custom"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {tab === "Colors" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose Jersey Color</p>
          <SketchPicker
            color={selectedColor}
            onChange={(color) => setSelectedColor(color.hex)}
          />
        </div>
      )}

      {/* Custom Tab */}
      {tab === "Custom" && (
        <DesignEditor
          userImage={selectedDesignURL}
          editorImage={editorImage}
          setEditorImage={setEditorImage}
          setSelectedDesignURL={(finalImg) => {
            setSelectedDesignURL(finalImg);
            setUserDesign(finalImg);
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
}
