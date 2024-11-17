import * as THREE from "three"
import Movements from "./movement.js"
import polygon from "./Web3.js"
import abi from "./abi/abi.json" assert { type: "json" }

// 1. Setting up the Scene

const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xda23cf)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

// 3. Rendering the scene

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// Adding lighting to the cube object

const ambient_light = new THREE.AmbientLight(0x404040)
const directional_light = new THREE.DirectionalLight(0x00ff00, 1)
ambient_light.add(directional_light)
scene.add(ambient_light)

// 2. Setting up the camera

const geometry_area = new THREE.BoxGeometry(100, 0.2, 50)
const material_area = new THREE.MeshPhongMaterial({ color: 0xef3 })
const area = new THREE.Mesh(geometry_area, material_area)
scene.add(area)

// const geometry_cly = new THREE.CylinderGeometry(5, 5, 20, 32)
// const material_cly = new THREE.MeshPhongMaterial({ color: 0xffff00 })
// const cylinder = new THREE.Mesh(geometry_cly, material_cly)
// scene.add(cylinder)

// const geometry_cone = new THREE.ConeGeometry(5, 20, 32)
// const material_cone = new THREE.MeshPhongMaterial({ color: 0xffff00 })
// const cone = new THREE.Mesh(geometry_cone, material_cone)
// scene.add(cone)

camera.position.z = 5
camera.position.set(10, 15, 45)

function animate() {
    // Adding rotation to the cube object
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    /*
        cylinder.rotation.x += 0.01
        cylinder.rotation.y += 0.01

        cylinder.position.set(10, 1, 1)

        cone.rotation.x += 0.01
        cone.rotation.y += 0.01

        cone.position.set(-10, 1, 1)
    */

    // Adding translation to the cube object
    // cube.position.z += 0.01

    requestAnimationFrame(animate)

    // Changing the state of the metaverse based on the Keys clocked on the keyboard
    if (Movements.isPressed(37)) {
        // LEFT
        camera.position.x -= 0.5
    }
    if (Movements.isPressed(38)) {
        // UP
        camera.position.x += 0.5
        camera.position.y += 0.5
    }
    if (Movements.isPressed(39)) {
        // RIGHT
        camera.position.x += 0.5
    }
    if (Movements.isPressed(40)) {
        // DOWN
        camera.position.x -= 0.5
        camera.position.y -= 0.5
    }

    camera.lookAt(area.position)
    renderer.render(scene, camera)
}
animate()

renderer.render(scene, camera)

const button = document.querySelector("#mint")
button.addEventListener("click", mintNFT)

async function mintNFT() {
    let nft_name = document.querySelector("#nft_name").value
    let nft_width = document.querySelector("#nft_width").value
    let nft_height = document.querySelector("#nft_height").value
    let nft_depth = document.querySelector("#nft_depth").value
    let nft_x = document.querySelector("#nft_x").value
    let nft_y = document.querySelector("#nft_y").value
    let nft_z = document.querySelector("#nft_z").value

    if (typeof window.ethereum == "undefined") {
        rej("You should install Metamask")
    }

    let web3 = new Web3(window.ethereum)
    let contract = new web3.eth.Contract(
        abi,
        "0x89062c43999adc1709a1da07da086def46569cc2"
    )
    web3.eth.requestAccounts().then((accounts) => {
        contract.methods
            .mint(
                nft_name,
                nft_width,
                nft_height,
                nft_depth,
                nft_x,
                nft_y,
                nft_z
            )
            .send({
                from: accounts[0],
                value: "10",
            })
            .then((data) => {
                console.log("NFT is minted")
            })
    })
}

polygon.then((result) => {
    console.log("Hi!")
    result.nft.forEach((object, index) => {
        if (index <= result.supply) {
            const geometry = new THREE.BoxGeometry(
                Number(object.w),
                Number(object.h),
                Number(object.d)
            )
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
            const nft = new THREE.Mesh(geometry, material)
            nft.position.set(
                Number(object.x),
                Number(object.y),
                Number(object.z)
            )
            scene.add(nft)
        }
    })
})
