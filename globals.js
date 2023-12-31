// global variables
let renderFrameLoopStarted = false;
let posX = INITIAL_POS_X;
let posY = INITIAL_POS_Y;
let posScale = INITIAL_POS_SCALE;
let simulationRunning = false;
let timeSynced = true; // if false, time value shown on screen is not currently simulated time
let detatchedTimeValue = 0; // value for detatched time if it is detatched
let debugTraversing = false; // if the debug traverser is currently activated
let previousTimeAfterRender;

let conwaySim = new ConwaySimulator();
let debugTraverser = null;

let simMode = 13;
let stateSetMode = 'manual setting'; // either 'default function' or 'manual setting'

// https://en.wikipedia.org/wiki/Conway's_Game_of_Life
let smallStableThing = [
  [1, 1],
  [1, 1],
];

let glider = [
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1],
];

let lwss = [
  [0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0],
];

let gosperGliderGun = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// y coordinate is flipped as higher array indices should appear lower visually
let makeArrayReadingFunc = (stateArray, startingX, startingY) => {
  return (x, y, t) => {
    x -= startingX;
    y -= startingY;
    if (t == 0 && x >= 0 && x < stateArray[0].length && y >= 0 && y < stateArray.length) {
      return Boolean(stateArray[stateArray.length - y - 1][x]);
    } else {
      return false;
    }
  }
};

let setInitialStateToArray = (conwaySim, stateArray, startingX, startingY) => {
  switch (stateSetMode) {
    case 'default function':
      conwaySim.setDefaultState(makeArrayReadingFunc(stateArray, startingX, startingY));
      break;
    
    case 'manual setting':
      conwaySim.setDefaultState((x, y, t) => false);
      
      for (let y = 0; y < stateArray.length; y++) {
        for (let x = 0; x < stateArray[0].length; x++) {
          conwaySim.setStateAt(x + startingX, y + startingY, 0, Boolean(stateArray[stateArray.length - y - 1][x]));
        }
      }
      break;
    
    default:
      throw new Error(`State set mode ${stateSetMode} invalid`);
  }
};

function setInitialState() {
  switch (simMode) {
    case 1:
      // single dot
      conwaySim.setSimulationArea(-50, -50, 50, 50);
      
      setInitialStateToArray(conwaySim, [[1]], 0, 0);
      break;
    
    case 2:
      // 4 cell stable configuration
      conwaySim.setSimulationArea(-50, -50, 50, 50);
      
      setInitialStateToArray(conwaySim, smallStableThing, 0, 0);
      break;
    
    case 3:
      // single glider
      conwaySim.setSimulationArea(-50, -50, 50, 50);
      
      setInitialStateToArray(conwaySim, glider, -1, -1);
      break;
    
    case 4:
      // gosper glider gun
      conwaySim.setSimulationArea(-50, -50, 50, 50);
      
      setInitialStateToArray(conwaySim, gosperGliderGun, -17, -2);
      break;
    
    case 5:
      // gosper glider gun with always live unsimulated cells below
      conwaySim.setSimulationArea(-50, -50, 50, 50);
      
      conwaySim.setDefaultState((x, y, t) => {
        if (y == -51) {
          return true;
        } else {
          return false;
        }
      });
      break;
    
    case 6:
      // gosper glider gun with boundary
      conwaySim.setSimulationArea(-20, -30, 24, 10);
      
      setInitialStateToArray(conwaySim, gosperGliderGun, -17, -2)
      break;
    
    case 7:
      // gosper glider gun with hot boundary
      conwaySim.setSimulationArea(-20, -30, 24, 10);
      
      setInitialStateToArray(conwaySim, gosperGliderGun, -17, -2);
      break;
    
    case 8:
      // gosper glider gun with boundary facing towards it
      conwaySim.setSimulationArea(-20, -30, 24, 10);
      
      setInitialStateToArray(conwaySim, gosperGliderGun, -17, -2);
      break;
    
    case 9:
      // gosper glider gun with boundary facing away from it
      conwaySim.setSimulationArea(-20, -30, 24, 10);
      
      setInitialStateToArray(conwaySim, gosperGliderGun, -17, -2);
      break;
    
    case 10:
      // gosper glider gun with portals and boundary
      conwaySim.setSimulationArea(-20, -40, 24, 10);
      
      setInitialStateToArray(conwaySim, gosperGliderGun, -17, -2);
      break;
    
    case 11:
      // lwss
      conwaySim.setSimulationArea(-50, -50, 50, 50);
      
      setInitialStateToArray(conwaySim, lwss, 0, -2);
      break;
    
    case 12:
      // lwss with portals
      conwaySim.setSimulationArea(-20, -10, 20, 10);
      
      setInitialStateToArray(conwaySim, lwss, 0, -2);
      break;
    
    case 13:
      // self-sustaining dot
      conwaySim.setSimulationArea(-4, -4, 4, 4);
      
      setInitialStateToArray(conwaySim, [[1]], 0, 0);
      break;
    
    case 14:
      // lwss with time portals
      conwaySim.setSimulationArea(-20, -10, 20, 10);
      
      setInitialStateToArray(conwaySim, lwss, 0, -2);
      break;
  }
}

function setInitialStateObjects() {
  conwaySim.resetSimulationObjects();
  
  switch (simMode) {
    case 6:
      // gosper glider gun with boundary
      conwaySim.addBasicBoundary(
        20, -5, 'down', 20, false,
        0, Infinity
      );
      break;
    
    case 7:
      // gosper glider gun with hot boundary
      conwaySim.addBasicBoundary(
        20, -5, 'down', 20, false,
        0, Infinity,
        true
      );
      break;
    
    case 8:
      // gosper glider gun with boundary facing towards it
      conwaySim.addSingleSidedBoundary(
        20, -5, 'down', 20, 'right', false,
        0, Infinity
      );
      break;
    
    case 9:
      // gosper glider gun with boundary facing away from it
      conwaySim.addSingleSidedBoundary(
        20, -5, 'down', 20, 'left', false,
        0, Infinity
      );
      break;
    
    case 10:
      // gosper glider gun with portals and boundary
      conwaySim.addBasicBoundary(
        -10, -36, 'right', 31, false,
        0, Infinity
      );
      
      conwaySim.addPortalPairWithBackBoundaries(
        15, -5, 'down', 'right', false,
        -15, -5, 'down', 'left', false,
        21,
        0, Infinity,
        0
      );
      break;
    
    case 12:
      // lwss with portals
      conwaySim.addPortalPairWithBackBoundaries(
        16, 6, 'down', 'right', false,
        -15, 6, 'down', 'left', false,
        11,
        0, Infinity,
        0
      );
      break;
    
    case 13:
      // self-sustaining dot
      conwaySim.addPortalPairWithBackBoundaries(
        0, 0, 'right', 'left', false,
        0, 0, 'up', 'right', false,
        2,
        0, Infinity,
        0
      );
      break;
    
    case 14:
      // lwss with time portals
      conwaySim.addPortalPairWithBackBoundaries(
        0, 0, 'right', 'left', false,
        0, 0, 'up', 'right', false,
        2,
        0, Infinity,
        2 // :O
      );
      break;
  }
}

setInitialState();
setInitialStateObjects();

function setInitialStateToArrayIfNeededOnReset() {
  if (stateSetMode == 'manual setting') {
    setInitialState();
  }
}
