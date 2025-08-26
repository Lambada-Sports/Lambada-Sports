import { SketchPicker } from 'react-color'
import { useState } from 'react'
import DesignEditor from './DesignEditor'
import DesignLoader from './DesignLoader' // ✅ PNG export helper
import sampleDesign from './json/design.json'

// ✅ Designs

export default function SidebarPanel({
  selectedColor,
  setSelectedColor,
  selectedDesignURL,
  setSelectedDesignURL,
  selectedLayer,
  setSelectedLayer,
  setUserDesign,
  setSelectedDesignJSON,
}) {
  const [tab, setTab] = useState('Design')
  const [editorImage, setEditorImage] = useState(null)
  const [selectedJson, setSelectedJson] = useState(null)

  const designOptions = [
    { name: "Design 1", json: "/design/design1.json", preview: "/preview/preview1.png" },
    { name: "Design 2", json: "/design/design2.json", preview: "/preview/preview2.png" },
    { name: "Design 3", json: "/design/design3.json", preview: "/preview/preview3.png" },
    { name: "Design 4", json: "/design/design4.json", preview: "/preview/preview4.png" },
  ];

  // 🚀 Load design JSON
  const loadDesign = async (design) => {
    try {
      const res = await fetch(design.json);
      const jsonData = await res.json();

      setSelectedJson(jsonData);           // local
      setSelectedDesignJSON(jsonData);     // global → DesignLoader trigger
    } catch (err) {
      console.error("❌ Error loading design JSON:", err);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg md:text-xl font-bold mb-4">Soccer Jersey F3 Basic</h1>

      {/* Tabs - Mobile responsive with scroll */}
      <div className="flex space-x-1 md:space-x-2 mb-4 overflow-x-auto pb-2">
        {['Design', 'Colors', 'Text', 'Logos', 'Custom'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 md:px-3 py-1 md:py-2 rounded text-sm md:text-base whitespace-nowrap flex-shrink-0 ${
              tab === t ? 'bg-black text-white' : 'bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* -------------------- Design Tab -------------------- */}
      {tab === "Design" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
          {designOptions.map((d, index) => (
            <div
              key={index}
              className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              onClick={() => loadDesign(d)}
            >
              <img
                src={d.preview}
                alt={d.name}
                className="w-full h-24 sm:h-28 md:h-32 object-contain bg-gray-100"
              />
              <p className="text-center py-1 md:py-2 font-medium text-xs sm:text-sm md:text-base">
                {d.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- Colors Tab -------------------- */}
      {tab === 'Colors' && selectedJson && (
        <div className="space-y-4">
          {/* Dropdown → JSON objects count படி auto fill */}
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="w-full border p-2 md:p-3 rounded text-sm md:text-base"
          >
            {selectedJson.objects.map((obj, index) => (
              <option key={index} value={index}>
                {obj.type} ({obj.fill})
              </option>
            ))}
          </select>

          {/* Color Picker - Mobile responsive */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <SketchPicker
                color={selectedColor}
                width="100%"
                styles={{
                  default: {
                    picker: {
                      width: '100%',
                      maxWidth: '300px'
                    }
                  }
                }}
                onChange={(color) => {
                  setSelectedColor(color.hex)

                  // 🔥 JSON clone செய்து அந்த Layer fill update பண்ணுதல்
                  const updatedJson = { ...selectedJson }
                  updatedJson.objects = [...updatedJson.objects]
                  updatedJson.objects[selectedLayer] = {
                    ...updatedJson.objects[selectedLayer],
                    fill: color.hex,   // ✅ புதிய நிறம்
                    stroke: null,      // ❌ border reset
                    shadow: null,      // ❌ shadow reset
                    opacity: 1,        // ✅ முழு நிறம்
                    fillRule: 'nonzero'
                  }
                  
                  console.log("🎨 Layer", selectedLayer, "updated fill:", color.hex)

                  setSelectedJson(updatedJson)          // local update
                  setSelectedDesignJSON(updatedJson)    // global update → DesignLoader
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Text Tab (Placeholder) -------------------- */}
      {tab === 'Text' && (
        <div className="text-center py-8">
          <p className="text-gray-500">Text editing options coming soon...</p>
        </div>
      )}

      {/* -------------------- Logos Tab (Placeholder) -------------------- */}
      {tab === 'Logos' && (
        <div className="text-center py-8">
          <p className="text-gray-500">Logo options coming soon...</p>
        </div>
      )}

      {/* -------------------- Custom Tab -------------------- */}
      {tab === 'Custom' && (
        <div className="w-full">
          <DesignEditor
            userImage={selectedDesignURL}
            editorImage={editorImage}
            setEditorImage={setEditorImage}
            setSelectedDesignURL={(finalImg) => {
              setSelectedDesignURL(finalImg)
              setUserDesign(finalImg)
            }}
          />
        </div>
      )}
    </div>
  )
}