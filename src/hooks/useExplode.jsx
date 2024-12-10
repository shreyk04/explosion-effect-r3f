import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";

import * as THREE from "three";

export const useExplode = (group, { distance = 3, enableRotation = true }) => {
  useEffect(() => {

    //to find center of the explosion 
    //the direction in which each fragment should move.
    const groupWorldPosition = new THREE.Vector3();
    group.current.getWorldPosition(groupWorldPosition);

    group.current.children.forEach((mesh) => {
      mesh.originalPosition = mesh.position.clone();
      const meshWorldPosition = new THREE.Vector3();
      mesh.getWorldPosition(meshWorldPosition);


      //To define the outward direction for each fragment, relative to the group’s center.
      mesh.directionVector = meshWorldPosition
        .clone()
        .sub(groupWorldPosition)
        .normalize();



        //originalRotation: To restore the fragment to its original orientation.
        //targetRotation: To make the explosion more dynamic by adding a random spin.
      mesh.originalRotation = mesh.rotation.clone();
      mesh.targetRotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
    });
  }, []);



  //The explosion distance can be customized (distance prop). This effect recalculates the target positions of the fragments whenever the distance changes.
  useEffect(() => {
    group.current.children.forEach((mesh) => {
      mesh.targetPosition = mesh.originalPosition
        .clone()
        .add(mesh.directionVector.clone().multiplyScalar(distance));
    });
  }, [distance]);






  //To make the explosion interactive, the scrollData.offset (normalized scroll progress) is used to interpolate the position and rotation of the fragments.

  const scrollData = useScroll();

  useFrame(() => {
    group.current.children.forEach((mesh) => {
      if (scrollData.offset < 0.0001) {
        if (mesh.name === "origin") {
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }
      } else {
        if (mesh.name === "origin") {
          mesh.visible = false;
        } else {
          mesh.visible = true;
        }
      }



      //The lerp function calculates a position between originalPosition and targetPosition based on scrollData.offset.
       //As offset increases from 0 to 1, the mesh moves outward.

      mesh.position.x = THREE.MathUtils.lerp(
        mesh.originalPosition.x,
        mesh.targetPosition.x,
        scrollData.offset // 0 at the beginning and 1 after scroll
      );
      mesh.position.y = THREE.MathUtils.lerp(
        mesh.originalPosition.y,
        mesh.targetPosition.y,
        scrollData.offset // 0 at the beginning and 1 after scroll
      );
      mesh.position.z = THREE.MathUtils.lerp(
        mesh.originalPosition.z,
        mesh.targetPosition.z,
        scrollData.offset // 0 at the beginning and 1 after scroll
      );

      if (enableRotation) {
        mesh.rotation.x = THREE.MathUtils.lerp(
          mesh.originalRotation.x,
          mesh.targetRotation.x,
          scrollData.offset // 0 at the beginning and 1 after scroll
        );
        mesh.rotation.y = THREE.MathUtils.lerp(
          mesh.originalRotation.y,
          mesh.targetRotation.y,
          scrollData.offset // 0 at the beginning and 1 after scroll
        );
        mesh.rotation.z = THREE.MathUtils.lerp(
          mesh.originalRotation.z,
          mesh.targetRotation.z,
          scrollData.offset // 0 at the beginning and 1 after scroll
        );
      }
    });
  });
};