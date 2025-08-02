/* eslint-disable no-unused-vars */
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect } from "react";

export default function JerseyModel({ selectedColor, userDesign }) {
  const { scene } = useGLTF("/models/bike_taupo_mens_trail_jersey.glb");

  // Always call both hooks
  const defaultTexture = useTexture("/textures/Image_01.png");
  const userTexture = useTexture(userDesign || "/textures/Image_01.png");

  const textureToUse = userDesign ? userTexture : defaultTexture;

  useEffect(() => {
    if (!textureToUse) return;

    textureToUse.encoding = THREE.sRGBEncoding;
    textureToUse.flipY = false;
    textureToUse.center.set(0.5, 0.5);
    textureToUse.offset.set(0, 0);
    textureToUse.repeat.set(1, 1);
    textureToUse.rotation = Math.PI * 2;
    textureToUse.needsUpdate = true;

    scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.material.isMeshStandardMaterial
      ) {
        child.material.map = textureToUse;
        child.material.color.set("#ffffff");
        child.material.roughness = 1;
        child.material.metalness = 0;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, textureToUse]);

  return (
    <primitive
      object={scene}
      scale={[7, 7, 7]}
      position={[0, -1.5, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
