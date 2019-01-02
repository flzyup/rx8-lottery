import { getUsers, getLottery, getUserAward, getAward } from "./api/api";
import Swal from 'sweetalert2'

let users = []
var camera, scene, renderer;
var controls;
var root;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: []};
var animationGroup = [targets.table, targets.sphere, targets.helix, targets.grid];
var animationIndex = 0;
var winners = [];

var timer;
var count = 3
var beginLottery = false

let awardSelector = document.getElementById('award-selector')
let elementWinner = document.getElementById('winner-list');
let awards = []
let currentAwardSelectorId = 0
let currentAwardId = 0
let lotteryButton
let fetching = false

function init() {
  getUsers()
    .then(resp => {
      users = resp.data.data
      initThree()
      animate()
    })
    .catch(err => {
      Swal('😂', err.data, 'error')
    })
  refreshAwardList()
  refreshUserAwardList()
}

function initThree() {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / (window.innerHeight), 1, 10000);
  camera.position.z = 3000;

  scene = new THREE.Scene();

  root = new THREE.Object3D();
  scene.add(root);

  // helix
  for (let i = 0; i < users.length; i++) {
    var element = document.createElement('div');
    element.classList.add('element');
    element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

    var number = document.createElement('div');
    number.className = 'number';
    number.textContent = users[i]['id'];
    element.appendChild(number);

    var symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = users[i]['name'];
    element.appendChild(symbol);

    // var details = document.createElement('div');
    // details.className = 'details';
    // details.innerHTML = users[i]['car_model'];
    // element.appendChild(details);

    var object = new THREE.CSS3DObject(element);

    var theta = i * 0.5 + Math.PI;
    var y = - (i * 20) + 100;

    object.position.setFromCylindricalCoords(900, theta, y);

    var vector = new THREE.Vector3();

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt(vector);

    root.add(object);

    objects.push(object);
  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.autoRotateSpeed = 4.0;
  controls.autoRotate = true;
  controls.addEventListener('change', render);

  lotteryButton = document.getElementById('lottery');
  lotteryButton.addEventListener('click', function () {
    // beginLottery = !beginLottery
    let enabled = !beginLottery
    enableLottery(enabled)
    if (!enabled) {
      onStopLottery()
    }
  }, false);

  window.addEventListener('resize', onWindowResize, false);

  timer = setInterval(() => {
    if (beginLottery) {
      if (!fetching) {
        fetching = true
        getLottery(currentAwardId, 0)
          .then(resp => {
            let luckyGuys = resp.data.data
            console.log('luckyGuys', luckyGuys)
            luckyman(luckyGuys, 0)
          }).catch(error => {
            console.log(error)
            enableLottery(false)
            if (error.response && error.response.data) {
              Swal('😂', error.response.data.data, 'error')
            }
          })
          .then(() => {
            fetching = false
          })
      }
    } /*else if (winners.length > 0) { // deal with winners
      for (let i = 0; i < winners.length; i++) {
        let elementWinner = document.getElementById('winner-list');
        let winner = document.createElement('div')
        winner.classList.add('child')
        winner.innerHTML = winners[i].element.getElementsByClassName('symbol')[0].innerHTML
        elementWinner.appendChild(winner)
      }
      winners.length = 0
    }*/
  }, 100)
}

function refreshUserAwardList() {
  // clear
  while (elementWinner.hasChildNodes()) {
    elementWinner.removeChild(elementWinner.lastChild);
  }

  getUserAward().then(resp => {
    let userAward = resp.data.data
    console.log(userAward)

    for (let i = 0; i < userAward.length; i++) {
      let winner = document.createElement('div')
      winner.classList.add('child')
      winner.innerHTML = userAward[i].name + ': <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

      let users = userAward[i].users

      for (let j = 0; j < users.length; j++) {
        winner.innerHTML += users[j].name + '&nbsp;&nbsp;'
        if (j != users.length - 1 && (j + 1) % 3 == 0) {
          winner.innerHTML += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        }
      }
      elementWinner.appendChild(winner)
    }
  })
}

function refreshAwardList() {
  getAward()
    .then(function (response) {
      // handle success
      console.log(response.data);
      awards = response.data.data

      awardSelector.options.length = 0

      for (let i = 0; i < awards.length; i++) {
        awardSelector.options[awardSelector.options.length] = new Option('第' + awards[i]['batch_id'] + '轮 - '+ awards[i].name + '[' + awards[i]['awarded_count'] + '/' + awards[i].count + '名]', awards[i].id)
      }
      awardSelector.selectedIndex = currentAwardSelectorId
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function luckyman(guys, stop) {
  // getLottery()
    // console.log(objects)
    // winners.removeAll();
    winners.length = 0;

    let man = ''
    for (let i = 0; i < users.length; i++) {
      // console.log(objects[i])
      if (guys.indexOf(users[i].id) != -1) {
        console.log('set:', i)
        objects[i].element.classList.add('element-highlight');
        if (stop == 1) {
          man += users[i].name + '&nbsp;&nbsp;&nbsp;&nbsp;'
          winners.push(objects[i])
        }
      } else {
        objects[i].element.classList.remove('element-highlight');
      }
    }

    if (stop == 1) {
      Swal(awards[currentAwardSelectorId].name, man)
    }
    console.log(winners)
}

function enableLottery(enabled) {
  beginLottery = enabled
  switch(beginLottery) {
    case true:
      currentAwardId = awardSelector[awardSelector.selectedIndex].value;
      currentAwardSelectorId = awardSelector.selectedIndex
      lotteryButton.innerHTML = '停止抽奖';
      controls.autoRotate = true;
      break
    case false:
      lotteryButton.innerHTML = '抽奖'
      controls.autoRotate = false;
      break
  }
}
function onStopLottery() {
  getLottery(currentAwardId, 1)
    .then(resp => {
      let luckyGuys = resp.data.data
      console.log('luckyGuys final', luckyGuys)
      luckyman(luckyGuys, 1)
      refreshUserAwardList()
      refreshAwardList()
    }).catch(error => {
      console.log(error)
      enableLottery(false)
      if (error.response && error.response.data) {
        Swal('😂', error.response.data.data, 'error')
      }
    })
    .then(() => {
      fetching = false
    })
}

//生成从minNum到maxNum的随机数
function randomNum(minNum ,maxNum){
  switch(arguments.length){
      case 1:
          return parseInt(Math.random()*minNum+1,10);
      break;
      case 2:
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break;
          default:
              return 0;
          break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

export {init}
