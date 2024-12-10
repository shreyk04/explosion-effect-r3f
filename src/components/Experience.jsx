import { Environment, Float, OrbitControls, ScrollControls } from "@react-three/drei";
import { Heart } from "./Heart";
import { useControls } from "leva";
import { Banana } from "./Banana";
import { Bluebird } from "./Bluebird";

export const Experience = () => {


const {item}=useControls({
  item:{
    value:'heart',
    options:['heart','banana','bird']
  }
})


  return (
    <>


      <OrbitControls enableZoom={false} />
      <ScrollControls  pages={4}>
      <Float floatIntensity={2} speed={2}>

      <Heart scale={0.25} visible={item==='heart'}/>
      <Banana scale={0.15} visible={item==='banana'}/>
      <Bluebird scale={0.7} visible={item==='bird'}/>
      </Float>
      </ScrollControls>
      <Environment preset="sunset" background blur={0.4}/>
     
    </>
  );
};
