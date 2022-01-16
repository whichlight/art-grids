//hex to binary
function hex2bin(hex) {
    let a = parseInt(hex, 16).toString(2);
    return a;
}

//store the response 
let layer = [];
let play = false;

const provider = new ethers.providers.Web3Provider(window.ethereum);

//test if i'm connected 
async function printblock() {
    let num = await provider.getBlockNumber();
    console.log("connected! currently at block " + num);
}

//get a grid 
const gridAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const gridAbi = [
    //get number of grids
    "function getGridIds() public view returns (uint256[] memory)",
    //get a particular grid 
    "function getGrid(uint256 id) public view returns (uint256)"
];

const gridContract = new ethers.Contract(gridAddress, gridAbi, provider);

async function getGrid(id) {
    let grid = await gridContract.getGrid(id);
    console.log(grid, hex2bin(grid));
    return hex2bin(grid)
}

let grid_res = getGrid(3);
grid_res.then(function (g) {
    for (let i = 0; i < g.length; i++) {
        layer[i] = parseInt(g[i]);
    }
});


const s = (p) => {


    function setup() {
        w = p.width;
        h = p.height;
        p.createCanvas(w, h);
        p.background(255);
        //    p.noLoop();
        p.frameRate(10);
    }

    function draw() {

        p.background(0);
        //render

        if (play) {
            let side = w / layer.length;
            for (let i = layer.length; i >= 0; i--) {
                let s = i * 10 + 10;
                p.noStroke();
                p.fill(layer[i] * 255);
                p.ellipse(w / 2, h / 2, s, s);
            }
        }
    }

}

let myp5 = new p5(s, 'myContainer');
