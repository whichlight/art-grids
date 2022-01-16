
let layer = [];
let seedDna = [];
let layers = [];
let playSimulation = false;


/*
 * connecting to the chain
 */

const gridAbi = [
    "function getGridIds() public view returns (uint256[] memory)",
    "function getGrid(uint256 id) public view returns (uint256)"
];

const provider = new ethers.providers.Web3Provider(window.ethereum);
const gridAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const gridContract = new ethers.Contract(gridAddress, gridAbi, provider);

function hex2bin(hex) {
    let a = parseInt(hex, 16).toString(2);
    return a;
}

async function printBlock() {
    let num = await provider.getBlockNumber();
    console.log("connected! currently at block " + num);
}

async function printGridIds() {
    let arr = await gridContract.getGridIds();
    console.log(arr);
}

async function getGrid(id) {
    let grid = await gridContract.getGrid(id);
    console.log(grid, hex2bin(grid));
    return hex2bin(grid)
}


printBlock();
printGridIds();
let grid_res = getGrid(1);

grid_res.then(function (g) {
    for (let i = 0; i < g.length; i++) {
        layer[i] = parseInt(g[i]);
    }
    seedDna = JSON.parse(JSON.stringify(layer));

    layers.pop(); //idk why but there's an empty array here, so popping it. 
    playSimulation = true;
});


/*

  CAF stands for Cellular Automata Function
       After running a bunch of functions i updated the function to just take a number. 
       if the left, middle, and right number in binary equal 
        any of the digits of the 4th arg, it is 1. else 0.
        
        see here for the binary notation: https://natureofcode.com/book/chapter-7-cellular-automata/

   some cool number functions 

   favs: 
       3456: arrows top left mountains
       012478: beautiful 
       15678: siq light and dark combo
       123: melting vibes
       346: sawtooth pattern
       012346: l layers
       012348: weiird
       012457: arrows to the top right 
       
   139: diagonal to left
   4: diagonal to right
   14: triangle and plus
   025: diagonal triangles then straigt
   248: triangle rows top right
   2348: vertical lines with some hatching 
   1458: checkerboardlike
   13458: cool diagonal and then checkerboard
   1238: diagonal with steps
   1256: arrows to the top left
   3458: checkerboard to the right 
   014567: another cool light and dark combo
   014678: plus and arrows
   */

function CAF(a, b, c, val) {
    let res = 0;
    let s = a * (2 ** 2) + b * (2 ** 1) + c * (2 ** 0);
    let digits_str = val.toString().split('');
    var realDigits = digits_str.map(Number)

    realDigits.forEach(function (p) {
        if (s == p) {
            res = 1;
        }
    });
    return res;

}


/*
 * 
 * p5 stuff
 * 
 */

//simulation
const s = (p) => {
    p.setup = function() {
        w = p.width;
        h = p.height;
        // createCanvas(w, h);
        p.background(255);
        p.frameRate(10);
    }

    p.draw = function() {

        p.background(0);

        if (playSimulation) {
            //render
            let side = w / layer.length;
            layers.push(JSON.parse(JSON.stringify(layer)));
            layers.forEach(function (l, j) {
                for (let i = 0; i < l.length; i++) {
                    p.fill(l[i] * 255);
                    p.noStroke();
                    p.rect(i * side, j * side, side, side);
                }
                if (j * side > h) p.noLoop();
            });

            //update
            l2 = JSON.parse(JSON.stringify(layer));

            //skip edges and determine the next row 
            for (let i = 1; i < layer.length - 1; i++) {
                layer[i] = CAF(l2[i - 1], l2[i], l2[i + 1], 012478);
            }
        }
    }
};

let worldp5 = new p5(s, 'worldSim');


//seed
const q = (p) => {
    p.setup = function() {
        w = p.width;
        h = p.height;
        p.createCanvas(w, h);
        p.background(255);
        p.frameRate(10);
        console.log('here');
    }

    p.draw = function() {

        p.background(0);
        if (playSimulation) {
            let side = w / seedDna.length;
            for (let i = seedDna.length; i >= 0; i--) {
                let s = i*side;
                p.noStroke();
                p.fill(seedDna[i] * 255);
                p.ellipse(w / 2, h / 2, s, s);
            }
        }
    }

}

let seedp5 = new p5(q, 'seedView');

