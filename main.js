import * as THREE from "three";
// サイズを指定
const width = 960;
const height = 540;

// canvas 要素の参照を取得する
const canvas = document.querySelector('#myCanvas');
// マウス座標管理用のベクトルを作成
const mouse = new THREE.Vector2();
// マウスイベントを登録
canvas.addEventListener('mousemove', handleMouseMove);

// マウスを動かしたときのイベント
function handleMouseMove(event) {
  const element = event.currentTarget;
  // canvas要素上のXY座標
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  // canvas要素の幅・高さ
  const w = element.offsetWidth;
  const h = element.offsetHeight;

  // -1〜+1の範囲で現在のマウス座標を登録する
  mouse.x = ( x / w ) * 2 - 1;
  mouse.y = -( y / h ) * 2 + 1;
  
  //console.log("[jiji] mouse.x", mouse.x);
  //console.log("[jiji] mouse.y", mouse.y);
}

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#myCanvas"),
});
// blur
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, 5);

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(-5, 5, 5);
scene.add( directionalLight );

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// 照明を可視化するヘルパー
/*const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(lightHelper);
*/

const penguinEye = ({ x = 0.3, y = 0.3, z = 1 }) => {
  //face
  const eyeGeo = new THREE.CircleGeometry(.4, 20);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff } ); 
  const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
  eyeMesh.position.set(x, y, z);
  scene.add(eyeMesh);

  const eyeInGeo = new THREE.SphereGeometry(.05);
  const eyeInMat = new THREE.MeshStandardMaterial({ color: 0x000000 } ); 
  const eyeInMesh = new THREE.Mesh(eyeInGeo, eyeInMat);
  eyeMesh.add(eyeInMesh);
};

// body
const geometry = new THREE.CylinderGeometry(1, 1, 1.5, 10);
const material = new THREE.MeshStandardMaterial({color: "#211715" });
const edges = new THREE.EdgesGeometry( geometry ); 
const line = new THREE.LineSegments(edges, new THREE.MeshStandardMaterial( { color: "#211715" } ) ); 
//scene.add( line );
const box = new THREE.Mesh(geometry, material);
scene.add(box);


const bellyGeo = new THREE.CircleGeometry(.5, 32, 0, Math.PI);
//const bellyGeo = new THREE.CircleGeometry(3);
const bellyMat = new THREE.MeshStandardMaterial({color: 0xffffff});
const bellyEdges = new THREE.EdgesGeometry( bellyGeo ); 
const bellyBox = new THREE.Mesh(bellyGeo, bellyMat);
bellyBox.position.set(0, -0.7, 1);
scene.add(bellyBox);

penguinEye({});
penguinEye({ x: -0.3});

// lips
var lipsGeo = new THREE.ConeGeometry(0.2, 0.5);
const lipsMat = new THREE.MeshStandardMaterial( { color: "#FEBE69" } );
const lipsMesh = new THREE.Mesh( lipsGeo, lipsMat );
lipsMesh.position.set(0, 0, 1.25);
lipsMesh.rotation.x = Math.PI / 2;;
scene.add( lipsMesh );

const x = 0, y = 0;
const wingShape = new THREE.Shape();
wingShape.moveTo( x, y );
wingShape.bezierCurveTo( x + 2, y + 1, x + 2, y - 1, x, y );
const wingGeo = new THREE.ShapeGeometry( wingShape );
const wingMat = new THREE.MeshStandardMaterial( { color: "#211715" } );
const wingMesh = new THREE.Mesh( wingGeo, wingMat ) ;
scene.add( wingMesh );

const wingShape2 = new THREE.Shape();
wingShape2.moveTo( x, y );
wingShape2.bezierCurveTo( - (x + 2), y + 1, -(x + 2), y - 1, x, y );
const wingGeo2 = new THREE.ShapeGeometry( wingShape2 );
const wingMat2 = new THREE.MeshStandardMaterial( { color: "#211715" } );
const wingMesh2 = new THREE.Mesh( wingGeo2, wingMat2 ) ;
scene.add( wingMesh2 );

let armsCount = 30;
const armsFlap = () => {
  if(armsCount <= -30){
    armsCount = 30;
  }
  
  wingMesh.rotation.y = armsCount * Math.PI / 180;
  wingMesh2.rotation.y = armsCount * Math.PI / 180;
  armsCount -= 10;    
}

function getHeartMesh({bevSeg = 1}){
  // heart
var heartShape = new THREE.Shape();
  heartShape.moveTo( (x + 25)/100, (y + 25)/100 );
  heartShape.bezierCurveTo( (x + 25)/100, (y + 25)/100, (x + 20)/100, y/100, x/100, y/100 );
  heartShape.bezierCurveTo( (x - 30)/100, y/100, (x - 30)/100, (y + 35)/100, (x - 30)/100, (y + 35)/100 );
  heartShape.bezierCurveTo( (x - 30)/100, (y + 55)/100, (x - 10)/100, (y + 77)/100, (x + 25)/100, (y + 95)/100 );
  heartShape.bezierCurveTo( (x + 60)/100, (y + 77)/100, (x + 80)/100, (y + 55)/100, (x + 80)/100, (y + 35)/100 );
  heartShape.bezierCurveTo( (x + 80)/100, (y + 35)/100, (x + 80)/100, y/100, (x + 50)/100, y/100 );
  heartShape.bezierCurveTo( (x + 35)/100, y/100, (x + 25)/100, (y + 25)/100, (x + 25)/100, (y + 25)/100 );
var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: bevSeg, steps: 0, bevelSize: 0, bevelThickness: 0 };
const heartGeo = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
const heartMat = new THREE.MeshStandardMaterial( { color: "#ff0000" } );
const heartMesh = new THREE.Mesh( heartGeo, heartMat ) ;
heartMesh.position.set(0.25, -0.7, 0);
heartMesh.rotation.z = Math.PI / 1;
  
  return heartMesh;
}

const heartMesh = getHeartMesh({});

scene.add( heartMesh );

//ice
const iceGeo = new THREE.BoxGeometry(10, .5, 10);
const iceMat = new THREE.MeshStandardMaterial({ color: "#F8A7A0" });
const iceBox = new THREE.Mesh(iceGeo, iceMat);
iceBox.position.set(0, -2.3, 0);
scene.add(iceBox);

let particleCount = 0;
function addParticle(){
  if(++particleCount % 10 !== 0){
    return;
  }
const x_size = window.innerWidth;
const y_size = window.innerHeight;
const plane = [];
  
for(let i=0; i<5; i++){
  plane[i] = getHeartMesh({bevSeg: 0});
  
   plane[i].position.x = x_size * (Math.random() - 0.5);
  plane[i].position.y = y_size * (Math.random() - 0.5);
  plane[i].position.z = x_size * (Math.random() - 0.5);
  plane[i].scale.x = 10;
  plane[i].scale.y = 10;
  plane[i].scale.z = 10;
  
  scene.add( plane[i] );
}  
}

// レイキャストを作成
const raycaster = new THREE.Raycaster();

tick();
let i=0;
// 毎フレーム時に実行されるループイベントです
function tick() {

  // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
  raycaster.setFromCamera(mouse, camera);

  // その光線とぶつかったオブジェクトを得る
  const intersects = raycaster.intersectObjects(scene.children);
  
 	if(intersects.length > 0 && intersects[0].object === bellyBox){
		//intersects[0].object.material.color.set( 0xff0000 );    
  armsFlap();
   addParticle();
	}

  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}