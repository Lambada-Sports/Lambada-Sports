// components/Customisation.jsx

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import JerseyModel from './JerseyModel'
import { OrbitControls } from '@react-three/drei'
import SidebarPanel from './SidebarPanel'

export default function Customisation() {
  const [selectedColor, setSelectedColor] = useState('#5C78CC')
  const [userDesign, setUserDesign] = useState(null)
  const [selectedDesignURL, setSelectedDesignURL] = useState(null)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left: Canvas 3D */}
      <div style={{ width: '50vw', background: '#f0f0f0' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <JerseyModel selectedColor={selectedColor} userDesign={userDesign} />
          <OrbitControls />
        </Canvas>
      </div>

      {/* Right: Sidebar */}
      <div style={{ width: '50vw', padding: '20px', overflowY: 'auto' }}>
        <SidebarPanel
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedDesignURL={selectedDesignURL}
          setSelectedDesignURL={setSelectedDesignURL}
          setUserDesign={setUserDesign} // ✅ ADD THIS LINE

        />
      </div>
    </div>
  )
}
