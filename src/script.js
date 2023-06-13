import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Stats from 'stats.js'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


//stats fps counter 

const stats = new Stats()
stats.showPanel(0,1,2) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)


// Scene
const scene = new THREE.Scene()


//fog 
const fog = new THREE.Fog('#262837', 7,15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColor = textureLoader.load('./textures/door/color.jpg')
const doorNormal = textureLoader.load('./textures/door/normal.jpg')
const doorHeight = textureLoader.load('./textures/door/height.jpg')
const doorAlpha = textureLoader.load('./textures/door/alpha.jpg')
const doorMetal = textureLoader.load('./textures/door/metalness.jpg')
const doorAmbientOcclusion = textureLoader.load('/textures/door/ambientOcclusion.jpg') 
const doorRoughness = textureLoader.load('/textures/door/roughness.jpg') 

const brickAO = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const brickColor = textureLoader.load('/textures/bricks/color.jpg')
const brickNormal = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughness = textureLoader.load('/textures/bricks/roughness.jpg')

const grassAO = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassColor = textureLoader.load('/textures/grass/color.jpg')
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

grassAO.repeat.set(10,10)
grassColor.repeat.set(10,10)
grassNormal.repeat.set(10,10)
grassRoughness.repeat.set(10,10)

grassAO.wrapS = THREE.RepeatWrapping
grassAO.wrapT = THREE.RepeatWrapping
grassColor.wrapS = THREE.RepeatWrapping
grassColor.wrapT = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping


/**
 * 
 * House
 */
const house = new THREE.Group();
scene.add(house);

const houseSize = {num:3};
const color = new THREE.Color('rgb(222, 184, 135)')

const houseCube = new THREE.Mesh(new THREE.BoxBufferGeometry(houseSize.num,houseSize.num,houseSize.num), new THREE.MeshStandardMaterial({
    map: brickColor,
    normalMap: brickNormal,
    roughnessMap: brickRoughness,
    aoMap: brickAO,
    aoMapIntensity: 3,
}))

houseCube.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(houseCube.geometry.attributes.uv.array, 2)
)

gui.add(houseCube.material,'aoMapIntensity',0,5,0.001).name('ev aoI')
houseCube.receiveShadow = true
houseCube.castShadow = true

// scene.add(houseCube)
houseCube.position.y += houseSize.num /2
house.add(houseCube)

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(houseSize.num,houseSize.num/2,4),
    new THREE.MeshStandardMaterial({color: 'red'})
)
roof.position.y = houseSize.num + houseSize.num/4
roof.rotation.y = Math.PI*2/4/2
house.add(roof)



const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(houseSize.num*0.7 , houseSize.num*.8,100,100),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        normalMap: doorNormal,
        alphaMap: doorAlpha,
        transparent: true,
        metalnessMap: doorMetal,
        metalness: 1,
        displacementMap: doorHeight,
        aoMap: doorAmbientOcclusion,
        displacementScale: 0.1,
        roughnessMap: doorRoughness,
        aoMapIntensity:1

    })
)

gui.add(door.material,'displacementScale',0,3,0.001).name('kapi girintisi');
gui.add(door.material,'aoMapIntensity',0,3,0.001).name('aomap');

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)



house.add(door)
door.position.x = 0
door.position.z = houseSize.num/2+0.01
door.position.y += houseSize.num/2 - .37

//bush
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: 'green'})
const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
house.add(bush1)
bush1.position.z = 5
bush1.scale.set(.5,.5,.5)


const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
house.add(bush2)
bush2.position.z = -5
bush2.scale.set(0.76,.4,.45)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
house.add(bush3)
bush3.position.z = 2
bush3.position.x= 3
bush3.scale.set(1,3,.5)

//graves 
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(.8,1,.18)
const graveMaterial = new THREE.MeshStandardMaterial({color:'gray'})

for (let index = 0; index < 30; index++) {
    const grave = new THREE.Mesh(graveGeometry,graveMaterial) 
    // const randomX = 2+ Math.floor((Math.random()-.5)*17);
    // const randomY = Math.floor((Math.random()-.5)*.1)+.5;
    // const randomZ = Math.floor((Math.random()-.5)*20);
    const angle = Math.random()*Math.PI*2
    const radius = 4+ Math.random()*5
    const x = Math.sin(angle)*radius
    const z = Math.cos(angle)*radius
    

    const randomYrotation = (Math.random()-0.5)*.5
    const randomZrotation = (Math.random()-0.5)*.3

    grave.position.set(x,.45,z)

    grave.rotation.y = randomYrotation
    grave.rotation.z = randomZrotation

    grave.rotation.z = Math.PI * Math.random() / 25
    grave.castShadow = true
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map:grassColor,
        aoMap:grassAO,
        normalMap: grassNormal,
        roughnessMap: grassRoughness,
        aoMapIntensity:5
        
     })
)

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */

const lightsColor = '#b9d5ff'
// Ambient light
const ambientLight = new THREE.AmbientLight(lightsColor, 0.15)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(lightsColor, 0.15)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name('moonlight')
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//doorLights
const doorLightObject = new THREE.Mesh(new THREE.BoxBufferGeometry(.3,.1,.3), new THREE.MeshStandardMaterial({color:'darkblue'}))
const doorLight = new THREE.PointLight('crimson',2,8)
// doorLight.castShadow = true 
doorLightObject.position.y += .2
doorLightObject.castShadow = true
const kapiGrubu = new THREE.Group();
kapiGrubu.add(doorLightObject,doorLight);
house.add(kapiGrubu)
kapiGrubu.position.z = houseSize.num/2+.2 
kapiGrubu.position.y = 2.3
// doorLight.position.z += houseSize.num/2 +1
// doorLight.position.y = 2

//ghosts 

const ghost1 = new THREE.PointLight('cyan', 2, 5)
const ghost2 = new THREE.PointLight('magenta', 2,5)
const ghost3 = new THREE.PointLight('yellow', 2,5)
scene.add(ghost1,ghost2,ghost3)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 3
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

// shadows
renderer.shadowMap.enabled=true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true

moonLight.receiveShadow = true
doorLight.receiveShadow = true
ghost1.receiveShadow = true
ghost2.receiveShadow = true
ghost3.receiveShadow = true

bush1.receiveShadow = true
bush3.receiveShadow = true
bush2.receiveShadow = true

floor.receiveShadow = true
houseCube.receiveShadow = true
houseCube.castShadow = true
door.receiveShadow = true
door.castShadow = true

const shadowQuality = 1024

doorLight.shadow.mapSize.width = shadowQuality
doorLight.shadow.mapSize.height = shadowQuality
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = shadowQuality
ghost1.shadow.mapSize.height = shadowQuality
ghost1.shadow.camera.far =7

ghost2.shadow.mapSize.width = shadowQuality
ghost2.shadow.mapSize.height = shadowQuality
ghost2.shadow.camera.far =7

ghost3.shadow.mapSize.width = shadowQuality
ghost3.shadow.mapSize.height = shadowQuality
ghost3.shadow.camera.far =7





const randomBiSayi = Math.random()*2;
const random2 = Math.random();
const random3 = Math.random();
const random4 = Math.random();

const cube = new THREE.Mesh(new THREE.ConeGeometry(.1,1,5,5),
new THREE.MeshStandardMaterial({color:'lightseagreen'}))
scene.add(cube)

const cube2 = new THREE.Mesh(new THREE.ConeGeometry(.1,1,5,5),
new THREE.MeshStandardMaterial({color:'salmon'}))
scene.add(cube2)

const cube3 = new THREE.Mesh(new THREE.ConeGeometry(.1,1,5,5),
new THREE.MeshStandardMaterial({color:'peachpuff'}))
scene.add(cube3)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin()
    const elapsedTime = clock.getElapsedTime()

    fog.near = Math.sin((elapsedTime))


    //ghostlights 
    ghost1.position.x = -Math.sin(3-elapsedTime* randomBiSayi) * 5 
    ghost1.position.z = -Math.cos(3-elapsedTime* randomBiSayi) * 5 
    ghost1.position.y = Math.sin(3-elapsedTime* randomBiSayi)  +1

    ghost2.position.x = Math.sin(15+elapsedTime* random2) * 5 
    ghost2.position.z = -Math.cos(15+elapsedTime* random2) * 5 
    ghost2.position.y = Math.sin(15+elapsedTime* random2) +2

    ghost3.position.x = Math.sin(4+elapsedTime* random3) * 5 
    ghost3.position.z = Math.cos(4+elapsedTime* random3) * 5 
    ghost3.position.y = Math.sin(4+elapsedTime* random3) +1

    cube.position.copy(ghost1.position)
    cube2.position.copy(ghost2.position)
    cube3.position.copy(ghost3.position)
    // Update controls
    controls.update()

    // houseCube.material.aoMapIntensity = Math.sin(elapsedTime)*10

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end()
}

tick()