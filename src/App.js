import React from 'react';
import * as THREE from 'three'
import { Suspense, useState, useRef, createContext, useContext, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Preload, Image as ImageImpl, Text, Html, Instance } from '@react-three/drei'
import {animated, useSpring, useTransition} from '@react-spring/three'
import gsap from "gsap";
import Home from "./Home";
import { MeshBasicMaterial } from 'three';

const ObjSizeContext = createContext();

function Image({index, c = new THREE.Color(), ...props}) {
  const [expand, setExpand] = useState(0)
  const [hide, setHide] = useState()
  const ref = useRef()
  const ref_s = useRef()
  const tt1 = useRef()
  const tt2 = useRef()
  const tt3 = useRef()
  const group = useRef()
  const refTxt = useRef();
  const refTxtHtml = useRef();
  const testRef = useRef();
  const testOneRef = useRef();
  const data = useScroll()
  const { width, height } = useThree((state) => state.viewport)
  const w = 1
  const gap = 0.25
  const xW = w + gap
  const img_w = height * 0.9 * 1.75;
  const imgs_scr_w = img_w + xW * 2;
  const total_scr_w = img_w / 2 - (width / 2 - width * 0.35) + xW * 2 + (width - imgs_scr_w) / 2 + width
  const obj_size = useContext(ObjSizeContext);
  var dis = 0;
  var sca = 0;
  var exp = 0;
  var zoom_index = 1;
  var rise_action_title, rise_action_sub, rise_action_btn;
  const AnimatedText = animated(Text)
  const txt_title_style = {
    fontWeight: 700,
    fontSize: "165px",
    lineHeight: "68%",
    fontFamily: 'Aileron',
    textTransform: "uppercase",
    color: "#FFFFFF",
    margin: '0',
    height: "121px",
    // width: "100%",
    // textAlign:'center',
  }
  const txt_small_style = {
    fontFamily: 'Aileron',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '110%',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    margin: '0'
  }

  const spring = useSpring({

    from: { scale: [1, 0, 0]},
    to: { scale: [1, 1, 0]},
    //  from: { opacity: 0  },
    // to: {  opacity: 1 },
    config: {
      friction: 10,
      duration: 100
    },
    // delay: 1000,

    // transform: "translate3d(2,2,0)"
    // from: {
    //   opacity: 0,
    //   top: `-5px`
    // },
    // to: {
    //   opacity: 1,
    //   top: `0px`
    // },
    // config: {
    //   clamp: true
    // }

    // from: {
    //   transform: `translate3d(0,6px,0)`
    // },
    // transform: `translate3d(0,0,0)`,
    // delay: 5165,

  })

  useEffect(()=>{
    rise_action_title = gsap.to(tt1.current, {y: 121, duration: 0, delay: 0})
    rise_action_sub = gsap.to(tt2.current, {y: tt2.current.offsetHeight, duration: 0, delay: 0})
    rise_action_btn = gsap.to(tt3.current, {y: tt3.current.parentElement.offsetHeight, duration: 0, delay: 0})


    // ref_s.current.material.transparent = true
    // ref_s.current.material.opacity = 1
    // ref.current.material.transparent = true
    // ref_s.current.material.polygonOffset = true
    // testOneRef.current.material.polygonOffset = true
    
    // ref_s.current.material.depthTest = true;
    // ref_s.current.material.depthWrite = true;
    // ref_s.current.material.depthFunc = -5;
    // ref_s.current.material.polygonOffsetFactor = 3
    // testOneRef.current.material.polygonOffsetFactor = 5
    // ref_s.current.material.polygonOffsetUnites = 1
    ref.current.material.polygonOffset = true
    // ref.current.material.depthTest = true;
    // ref.current.material.depthWrite = false;
    // ref.current.material.depthFunc = 3;

    ref.current.material.polygonOffsetFactor = 5
    document.querySelector('canvas').style.zIndex = 3
    console.log("eerrrrr", testOneRef.current)
    console.log("eeeee", ref.current)
  }, [])

  useFrame((state, delta) => {
    const scroll_pos = Math.round(data.range(0, 1 / 3) + data.range(1 / 3, 1 / 3) + data.range(2 / 3, 1 / 3))
    const expand_index = scroll_pos === 0 ? 1 : scroll_pos
    // console.log("rrrrrrrrrrrrrrrrr", group.current)    
    if(exp != scroll_pos){
      zoom_index = 1;
      if(index === scroll_pos){
        rise_action_title = gsap.to(tt1.current, {y: 0, duration: 0.5, delay: 1})
        rise_action_sub = gsap.to(tt2.current, {y: 0, duration: 0.5, delay: 1})
        rise_action_sub = gsap.to(tt3.current, {y: 0, duration: 0.5, delay: 1})
      }
      else{
        rise_action_title.pause();
        rise_action_sub.pause();
        rise_action_btn.pause();
        gsap.to(tt1.current, {y: 121, duration: 0.3, delay: 0})
        gsap.to(tt2.current, {y: tt2.current.offsetHeight, duration: 0.4, delay: 0})
        gsap.to(tt3.current, {y: tt3.current.parentElement.offsetHeight, duration: 0.4, delay: 0})
      }
      // setExpand(scroll_pos);
      exp = scroll_pos;
    }
    
    for(var i=1; i<index; i++){
      if(i === expand_index){
        dis += obj_size.img_w + gap;
        continue;
      }
      dis += obj_size.xW;
    }
    if(index === expand_index){
      dis += obj_size.img_w / 2;
      sca = obj_size.img_w;

    }
    else{
      dis += obj_size.w / 2;
      sca = 1;
      
    }
    if(scroll_pos === 0) {
      dis += width * 0.35 + obj_size.imgs_scr_w_sp * 2;
      ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, 1, 6, delta)
      // ref.current.material.transparent = true;
      // ref.current.material.opacity = 0

      // ref.current.material.color.set('white', 0.5)
      // ref.current.material.transparent = true
      // ref.current.material.opacity = 0.5
      // ref.current.material.color.lerp(c.set('red'), 0)
      // console.log("wwwwww", ref.current.material.color)
    }
    else{
    ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, 0, 6, delta)
    }
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, dis - width / 2 + obj_size.imgs_scr_w_sp, 2, delta)
    // ref_s.current.position.x = THREE.MathUtils.damp(ref_s.current.position.x, dis - width / 2 + obj_size.imgs_scr_w_sp, 2, delta)
    ref.current.material.scale[0] = ref.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, sca, 2, delta)
    if(index === scroll_pos && zoom_index < 1.1){
      // ref.current.material.scale[0] = THREE.MathUtils.damp(ref.current.scale.x, sca * 1.5, 4, delta)
      // ref.current.material.scale[1] = THREE.MathUtils.damp(ref.current.scale.y, sca * 1.5, 4, delta)
      console.log("wwwwwwwwwwwwwwwwwwww", zoom_index)
    // if(zoom_index < 1.1) {
      zoom_index += delta/100;
      ref.current.material.zoom = zoom_index;
    // }

    }
    // ref.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, sca * 1.2, 2, 3)
    // ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, sca / 1.8 * 1.2, 2, 3)
    // ref.current.material.zoom = 1.5
    // ref_s.current.material.scale[0] = ref_s.current.scale.x = THREE.MathUtils.damp(ref_s.current.scale.x, sca, 2, delta)
    // group.current.scale.x = THREE.MathUtils.damp(group.current.scale.x, sca, 2, delta)
    refTxt.current.position.x = THREE.MathUtils.damp(refTxt.current.position.x, dis - width / 2 + obj_size.imgs_scr_w_sp, 2, delta)
    
    // refTxt.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, 0.1, 8, delta)
    // refTxt.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, 0, 8, delta)
    // console.log("e34333333")
    // console.log(refTxt.current)

    dis = 0;

    // gsap.to(tt1.current, { y: -121, duration: 1});
    // gsap.from(tt1.current, {y: 121, duration: 1});
    // const tween = gsap.to(tt1.current, {y: 121, duration: 1});
    
    // gsap.to(tt1.current, {y: 121, duration: 10});
    // group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)
    // ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.max(0, 1 - data.delta * 1000), 4, delta)
  })
  return (
    <group ref={group}>
      {/* <Text ref={refTxt} anchorX={'center'} anchorY={'middle'} fontSize={1}  position={props.position}>{props.txt}
      <meshStandardMaterial color="#fff" />
      </Text> */}
      {/* <Instance> */}
      {/* <mesh ref={testOneRef} renderOrder={3}>
      <meshStandardMaterial >
      
      <Html renderOrder={3} ref={testRef} zIndexRange={[1, 1]} style={{zIndex:1}} position={[0,-1,-1]} >
        <p style={{color:'white', fontSize:'32px'}}>
          dfdsfdsfdsfsdfsfsgdfgfdsgdfgdgfdg
        </p>
      </Html>
      </meshStandardMaterial>

      </mesh>
      <Text renderOrder={3} color="white" fontSize={3} depthOffset={2} anchorX="center" anchorY="middle">
      <Html renderOrder={3} transform sprite prepend>
        <p style={{color:'white', fontSize:'32px'}}>
          dfdsfdsfdsfsdfsfsgdfgfdsgdfgdgfdg
        </p>
      </Html>
</Text> */}

      {/* </Instance> */}
      <mesh zIndexRange={[-2, -2]} style={{}} ref={refTxt}  position={props.position} >
            <Html ref={refTxtHtml} zIndexRange={[2, 6]} style={{zIndex:-4}} center position={[0,0,0]} wrapperClass="dddddddddd" >
              <div style={{ zIndex:-1, pointerEvents: 'auto', backgroundColor:'hidden', overflow:"hidden", textAlign:'center', width: 'fit-content', height: "35px", position: 'absolute', transform: 'translateY(-145%)'}}>
                <p ref={tt2} style={txt_small_style}>{props.txt_title}</p>
              </div>
              
              <div style={{ zIndex:-1, pointerEvents: 'auto', backgroundColor:'', overflow:"hidden", textAlign:'center', height: "121px", padding:'0px'}}>
                <p ref={tt1} style={txt_title_style}>{props.txt}</p>
              </div>

              <div style={{ zIndex:-1, pointerEvents: 'auto', backgroundColor:'', overflow:"hidden", textAlign:'center', padding:'0px',position:'absolute', display: 'flex',right:'0', height:'155px', transform:'translateY(25%)'}}>
                <div ref={tt3} style={{display: 'flex', width: '177px', height:'52px'}}>
                  <div id='show_btn'>
                    <p>show more</p>
                  </div>
                  <div id='show_mark'><span className="material-symbols-outlined">keyboard_double_arrow_right</span></div>
                </div>
              </div>
            </Html>
      </mesh>
      <ImageImpl ref={ref} {...props} >
      </ImageImpl>
      {/* <ImageImpl renderOrder={5} ref={ref_s} url={"/plans" + index + '.png'} transparent position={[props.position[0], props.position[1], 0]} scale={props.scale} >
      </ImageImpl> */}
    </group>
  )
}

function Hometxt(props) {
 
  useFrame((state, delta) => {

  })
  return (
    <Html ref={props.refs}  position={props.position}>
      <p>Photo-realistic 3d renders</p>
    </Html>
  )
}

function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport)
  const w = width < 10 ? 1.5 / 3 : 1 / 3
  return (
    <group {...props}>
      <Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
      <Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
      <Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
    </group>
  )
}

function Pages() {
  const { width } = useThree((state) => state.viewport)
  return (
    <>
      {/* <Page position={[-width * 1, 0, 0]} urls={['/trip1.jpg', '/trip2.jpg', '/trip3.jpg']} /> */}
      <Page position={[width * 0, 0, 0]} urls={['/img1.jpg', '/img2.jpg', '/img3.jpg']} />
      {/* <Page position={[width * 1, 0, 0]} urls={['/img4.jpg', '/img5.jpg', '/img6.jpg']} /> */}
      {/* <Page position={[width * 2, 0, 0]} urls={['/trip1.jpg', '/trip2.jpg', '/trip3.jpg']} /> */}
      {/* <Page position={[width * 3, 0, 0]} urls={['/img1.jpg', '/img2.jpg', '/img3.jpg']} /> */}
      {/* <Page position={[width * 4, 0, 0]} urls={['/img4.jpg', '/img5.jpg', '/img6.jpg']} /> */}
    </>
  )
}

function Items({ w = 1, gap = 0.25 }) {
  const { width, height } = useThree((state) => state.viewport)
  const xW = w + gap
  const img_w = height * 0.9 * 1.8;
  const imgs_scr_w = img_w + xW * 2;
  const imgs_scr_w_sp = (width - imgs_scr_w) / 2;
  const total_scr_w = img_w / 2 - (width / 2 - width * 0.35) + xW * 2 + (width - imgs_scr_w) / 2 + width
  const obj_size = {w, gap, xW, img_w, imgs_scr_w, imgs_scr_w_sp}
  return (
    <ScrollControls horizontal damping={1} pages={total_scr_w / width} distance={1}>
          <Scroll html>
            {/* <h1 style={{ position: 'absolute', top: '20vh', left: '-75vw' }}>home</h1> */}
            {/* <h1 id='teseid' style={{ position: 'absolute', top: '20vh', left: '25vw' }}>to</h1> */}
            {/* <p id='home_title'>Photo-realistic 3d renders</p>
            <p id='home_subtitle'>Renders are digital representations of projects recreated in 3D. They are the ideal tool to effectively present a property under construction or renovation as it allows you to see the final result without any need to wait for the work to be completed. They find use in revolutionizing architecture, construction, interior design and recently, real estate as well.</p>
            <img id='home_img' src='/img/btn.jpg' /> */}
        {/* <div id='home_txt'>
          <p id='home_title'>Photo-realistic 3d renders</p>
          <p id='home_subtitle'>Renders are digital representations of projects recreated in 3D. They are the ideal tool to effectively present a property under construction or renovation as it allows you to see the final result without any need to wait for the work to be completed. They find use in revolutionizing architecture, construction, interior design and recently, real estate as well.</p>
          <img id='home_img' src='/img/btn.jpg' />
        </div> */}

            {/* <h1 style={{ position: 'absolute', top: '20vh', left: '125vw' }}>be</h1> */}
            {/* <h1 style={{ position: 'absolute', top: '20vh', left: '225vw' }}>home</h1> */}
            {/* <h1 style={{ position: 'absolute', top: '20vh', left: '325vw' }}>to</h1> */}
            {/* <h1 style={{ position: 'absolute', top: '20vh', left: '425vw' }}>be</h1> */}
          </Scroll>
          <Scroll>
            {/* <Pages /> */}
            
          </Scroll>
          <ObjSizeContext.Provider value={obj_size}>
            <Backs/>            
          </ObjSizeContext.Provider>


        </ScrollControls>
  )
}

function Backs() {
  const txtRef = useRef()
  const { width, height } = useThree((state) => state.viewport)
  const data = useScroll()
  const AnimatedText = animated(Text)
  const obj_size = useContext(ObjSizeContext);

  useFrame((state, delta) => {
    // txtRef.current.style.left = -width * 0.1 + "px"
    // console.log("aaasssss", txtRef.current.position)
    const scroll_pos = Math.round(data.range(0, 1 / 3) + data.range(1 / 3, 1 / 3) + data.range(2 / 3, 1 / 3))
    if(scroll_pos == 0) txtRef.current.position.x = THREE.MathUtils.damp(txtRef.current.position.x, 0, 2, delta)
    else txtRef.current.position.x = THREE.MathUtils.damp(txtRef.current.position.x, -width * 0.5, 2, delta)
    
    
    // const b = data.range(1 / 3, 1 / 3)
    // const c = data.range(2 / 3, 1 / 3)
    // console.log("eeeeeeee");
    // console.log(Math.round(a))
    // group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)
    // ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.max(0, 1 - data.delta * 1000), 4, delta)
  })
  return (
    <group>
      <AnimatedText ref={txtRef} position={[0,0,0]}>
      <Html fullscreen style={{paddingTop:'35px'}} zIndexRange={[-100, -2]} position={[0,0,0]}>
        <div id='home_txt'>
          <p id='home_title'>Photo-realistic 3d renders</p>
          <p id='home_subtitle'>Renders are digital representations of projects recreated in 3D. They are the ideal tool to effectively present a property under construction or renovation as it allows you to see the final result without any need to wait for the work to be completed. They find use in revolutionizing architecture, construction, interior design and recently, real estate as well.</p>
          <img id='home_img' src='/img/btn.jpg' />
        </div>
      </Html>

      </AnimatedText>
      <Image index={1} txt={"Verdi"} txt_title={"residence"} position={[width * 0.35, 0, 0]} scale={[obj_size.img_w , height * 0.9, 0]} url={"/img1.jpg"} />
      {/* <Image position={[width * 0.35 + height * 0.9 * 1.75, 0, 0]} scale={[height * 0.9 * 1.75, height * 0.9, 1]} url={'/img2.jpg'} />  */}
      <Image index={2} txt={"Laura"} txt_title={"villa"} position={[width * 0.35 + obj_size.img_w, 0, 0]} scale={[1 , height * 0.9, 0]} url={'/img2.jpg'} /> 
      {/* <Image position={[width * 0.8, 0, 0]} scale={[height * 0.9 * 1.75, height * 0.9, 1]} url={'/img3.jpg'} /> */}
      <Image index={3} txt={"Thiago"} txt_title={"render"} position={[width * 0.35 + obj_size.img_w / 2 + 0.75 + 1.25, 0, 0]} scale={[1, height * 0.9, 0]} url={'/img3.jpg'} />
    </group>
  )
}

export default function App() {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1]}>
      <Suspense fallback={null}>
        <Items/>
        <Preload />
      </Suspense>
    </Canvas>
  )
}
