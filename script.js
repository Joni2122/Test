// ======================================
// NEXUS: ZERO HORIZON
// SCRIPT.JS PART 1
// ======================================


// Three.js laden
const threeScript = document.createElement("script");

threeScript.src =
"https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

document.head.appendChild(threeScript);



threeScript.onload = () => {


// ===============================
// BASIC ENGINE SETUP
// ===============================


const canvas =
document.getElementById("gameCanvas");


const scene =
new THREE.Scene();



scene.fog =
new THREE.FogExp2(
    0x02030a,
    0.035
);





const camera =
new THREE.PerspectiveCamera(

    75,

    window.innerWidth /
    window.innerHeight,

    0.1,

    1000

);



camera.position.set(
    0,
    4,
    8
);







const renderer =
new THREE.WebGLRenderer({

    canvas:canvas,

    antialias:true

});



renderer.setSize(
    window.innerWidth,
    window.innerHeight
);



renderer.setPixelRatio(
    window.devicePixelRatio
);






// ===============================
// LIGHT SYSTEM
// ===============================


const ambient =
new THREE.AmbientLight(
    0xffffff,
    0.4
);


scene.add(ambient);




const neonLight =
new THREE.PointLight(
    0x00ffff,
    4,
    50
);


neonLight.position.set(
    0,
    5,
    0
);


scene.add(neonLight);






// ===============================
// WORLD
// ===============================


const floorGeometry =
new THREE.PlaneGeometry(
    200,
    200,
    50,
    50
);



const floorMaterial =
new THREE.MeshStandardMaterial({

    color:0x050510,

    metalness:0.8,

    roughness:0.4

});



const floor =
new THREE.Mesh(
    floorGeometry,
    floorMaterial
);



floor.rotation.x =
-Math.PI/2;



scene.add(floor);







// Grid im Boden


const grid =
new THREE.GridHelper(

    200,

    100,

    0x00ffff,

    0x003344

);



grid.position.y =
0.02;


scene.add(grid);







// ===============================
// PLAYER
// ===============================


const playerGroup =
new THREE.Group();



scene.add(playerGroup);






const bodyGeometry =
new THREE.IcosahedronGeometry(
    0.8,
    2
);



const bodyMaterial =
new THREE.MeshStandardMaterial({

    color:0x00ffff,

    emissive:0x005555,

    metalness:1,

    roughness:0.2

});



const player =
new THREE.Mesh(

    bodyGeometry,

    bodyMaterial

);



playerGroup.add(player);







// Energie-Ring


const ringGeometry =
new THREE.TorusGeometry(
    1.2,
    0.04,
    16,
    100
);



const ringMaterial =
new THREE.MeshBasicMaterial({

    color:0x00ffff

});



const ring =
new THREE.Mesh(

    ringGeometry,

    ringMaterial

);



ring.rotation.x =
Math.PI/2;



playerGroup.add(ring);







playerGroup.position.y =
1;









// ===============================
// MOVEMENT
// ===============================


const keys = {};



window.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()]
=
true;

});




window.addEventListener(
"keyup",
e=>{

keys[e.key.toLowerCase()]
=
false;

});







let velocity =
new THREE.Vector3();



function updatePlayer(){



const speed =
0.12;



velocity.set(
0,
0,
0
);




if(keys["w"])
velocity.z -= speed;


if(keys["s"])
velocity.z += speed;


if(keys["a"])
velocity.x -= speed;


if(keys["d"])
velocity.x += speed;




playerGroup.position.add(
velocity
);





// Kamera folgt Spieler


camera.position.x =
playerGroup.position.x;



camera.position.z =
playerGroup.position.z + 8;



camera.lookAt(
playerGroup.position
);





// Rotation


player.rotation.y +=
0.02;



ring.rotation.z +=
0.03;



}









// ===============================
// ANIMATION
// ===============================



function animate(){


requestAnimationFrame(
animate
);



updatePlayer();



renderer.render(
scene,
camera
);


}



animate();






// ===============================
// RESIZE
// ===============================


window.addEventListener(
"resize",
()=>{


camera.aspect =
window.innerWidth /
window.innerHeight;


camera.updateProjectionMatrix();



renderer.setSize(
window.innerWidth,
window.innerHeight
);


});





// Start Button


document
.getElementById("startGame")
.onclick = ()=>{


document
.getElementById("menu")
.style.display="none";


};



console.log(
"NEXUS ENGINE INITIALIZED"
);



};
// ======================================
// NEXUS: ZERO HORIZON
// SCRIPT.JS PART 2
// GAMEPLAY SYSTEM
// ======================================



// ===============================
// GAME VARIABLES
// ===============================


let health = 100;

let energy = 100;

let score = 0;

let level = 1;

let credits = 0;


let enemies = [];

let bullets = [];



let gameRunning = false;




const scoreUI =
document.getElementById("score");


const levelUI =
document.getElementById("level");


const creditsUI =
document.getElementById("credits");


const healthUI =
document.getElementById("health");


const energyUI =
document.getElementById("energy");







// ===============================
// START GAME
// ===============================


document
.getElementById("startGame")
.onclick = ()=>{


gameRunning=true;


document
.getElementById("menu")
.style.display="none";


spawnWave();


};







// ===============================
// SHOOTING SYSTEM
// ===============================



window.addEventListener(
"mousedown",
()=>{


if(!gameRunning)
return;


shoot();


});






function shoot(){



const geometry =
new THREE.SphereGeometry(
0.12,
8,
8
);



const material =
new THREE.MeshBasicMaterial({

color:0xffff00

});



const bullet =
new THREE.Mesh(

geometry,

material

);




bullet.position.copy(
playerGroup.position
);



bullet.position.y +=0.2;




scene.add(
bullet
);



bullets.push({

mesh:bullet,

direction:
new THREE.Vector3(
0,
0,
-1
)

});



}








function updateBullets(){



for(
let i=bullets.length-1;
i>=0;
i--
){



let b =
bullets[i];



b.mesh.position.add(

b.direction
.clone()
.multiplyScalar(0.5)

);




if(
b.mesh.position.length()>200
){


scene.remove(
b.mesh
);


bullets.splice(
i,
1
);


}




}



}









// ===============================
// ENEMIES
// ===============================




function spawnEnemy(){



const geometry =
new THREE.DodecahedronGeometry(
0.7
);



const material =
new THREE.MeshStandardMaterial({

color:0xff0033,

emissive:0x330000,

metalness:0.8

});



const enemy =
new THREE.Mesh(

geometry,

material

);



enemy.position.set(

(Math.random()-0.5)*40,

1,

(Math.random()-0.5)*40

);



scene.add(
enemy
);



enemies.push({

mesh:enemy,

hp:3,

speed:
0.015 + level*0.002

});



}








function spawnWave(){



let amount =
5 + level*2;



for(
let i=0;
i<amount;
i++
){

spawnEnemy();

}



}









function updateEnemies(){



for(
let i=enemies.length-1;
i>=0;
i--
){



let e =
enemies[i];



let enemy =
e.mesh;




let direction =
new THREE.Vector3()
.subVectors(

playerGroup.position,

enemy.position

)
.normalize();




enemy.position.add(

direction
.multiplyScalar(
e.speed
)

);




enemy.rotation.x +=0.02;

enemy.rotation.y +=0.03;







// Collision Player


if(

enemy.position.distanceTo(

playerGroup.position

)<1.5

){



takeDamage(
15
);



scene.remove(
enemy
);


enemies.splice(
i,
1
);



continue;


}






// Bullet Collision


for(
let j=bullets.length-1;
j>=0;
j--
){



if(

enemy.position.distanceTo(

bullets[j].mesh.position

)<1

){



e.hp--;



scene.remove(
bullets[j].mesh
);



bullets.splice(
j,
1
);



if(e.hp<=0){



destroyEnemy(
i
);



}



break;



}



}



}



}








// ===============================
// DESTROY ENEMY
// ===============================



function destroyEnemy(index){



let enemy =
enemies[index].mesh;



createExplosion(
enemy.position
);



scene.remove(
enemy
);



enemies.splice(
index,
1
);



score +=100;

credits+=5;


scoreUI.textContent=
score;


creditsUI.textContent=
credits;





if(score%1000===0){


level++;


levelUI.textContent=
level;


spawnWave();


}



}








// ===============================
// DAMAGE
// ===============================



function takeDamage(amount){



health -= amount;



healthUI.style.width =
health+"%";



document
.getElementById("damageOverlay")
.style.opacity =
0.5;



setTimeout(()=>{


document
.getElementById("damageOverlay")
.style.opacity =
0;



},100);





if(health<=0){


gameOver();


}



}







function gameOver(){


gameRunning=false;


alert(

"MISSION FAILED\nSCORE: "
+score

);


location.reload();


}









// ===============================
// EXPLOSION EFFECT
// ===============================



function createExplosion(pos){



const particleGeometry =
new THREE.SphereGeometry(
0.08,
6,
6
);



for(
let i=0;
i<20;
i++
){



const particle =
new THREE.Mesh(

particleGeometry,

new THREE.MeshBasicMaterial({

color:0xffaa00

})

);



particle.position.copy(
pos
);



particle.position.x +=
(Math.random()-0.5)*2;


particle.position.y +=
(Math.random()-0.5)*2;


particle.position.z +=
(Math.random()-0.5)*2;



scene.add(
particle
);



setTimeout(()=>{


scene.remove(
particle
);


},500);



}



}









// ===============================
// EXTRA UPDATE LOOP
// ===============================



const oldAnimate =
animate;



animate =
function(){


requestAnimationFrame(
animate
);



if(gameRunning){


updatePlayer();

updateBullets();

updateEnemies();



}



renderer.render(
scene,
camera
);



};



animate();









// ===============================
// DASH SYSTEM
// ===============================


window.addEventListener(
"keydown",
e=>{


if(
e.code==="Space"
&& energy>=25
){


playerGroup.position.z-=3;


energy-=25;


energyUI.style.width=
energy+"%";


}



});



setInterval(()=>{


if(
energy<100
){

energy+=1;


energyUI.style.width=
energy+"%";

}


},200);





console.log(
"GAMEPLAY SYSTEM ONLINE"
);
