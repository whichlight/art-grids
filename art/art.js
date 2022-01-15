//hex to binary
function hex2bin(hex){
    let a = parseInt(hex, 16).toString(2); 
    return a;
}

//store the response 
let layer = [];
let layers = [];

const provider = new ethers.providers.Web3Provider(window.ethereum);

//test if i'm connected 
//wow i don't have to sign anything? 
async function printblock(){
    let num = await provider.getBlockNumber();
    console.log("connected! currently at block " +num);
}

printblock();

//get a grid 

const gridAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const gridAbi = [
    //get number of grids
    "function getGridIds() public view returns (uint256[] memory)",
    //get a particular grid 
    "function getGrid(uint256 id) public view returns (uint256)"
  ];

const gridContract = new ethers.Contract(gridAddress, gridAbi, provider);

async function printGridIds(){
    let arr = await gridContract.getGridIds();
    console.log(arr);
}

async function getGrid(id){
    let grid = await gridContract.getGrid(id);
    
    console.log(grid, hex2bin(grid));
    return hex2bin(grid)
}

printGridIds();
let grid_res = getGrid(0);
grid_res.then(function(g){
    for(let i=0; i < g.length; i++){
        layer[i]=parseInt(g[i]);
    }
    layers.pop(); //idk why but there's an empty array here, so popping it. 
    loop();
});

function setup(){
    w = windowWidth; 
    h = windowHeight; 
    createCanvas(w, h);
    background(255);
    colorMode(HSB, 360, 100, 100,100);
    noLoop();
    frameRate(10);
}

function draw(){
    background(0);
    //render
   
    let side = w/layer.length; 
    layers.push(JSON.parse(JSON.stringify(layer)));
    layers.forEach(function(l,j){
        for(let i=0; i < l.length; i++){
            fill(l[i]*255);
            noStroke();
            rect(i*side, j*side, side, side);
        }
        if(j*side > h) noLoop(); 
    });
   


    //update
    l2 = JSON.parse(JSON.stringify(layer)); 

    //skip edges and determine the next row 
    for(let i = 1; i<layer.length-1; i++){
        layer[i] = CA(l2[i-1], l2[i], l2[i+1]);
    }
}

function CA358(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 3 || s == 5 || s == 8){
        return 1; 
    }else {
        return 0; 
    }
}


function CA15784(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 1 || s == 5 || s == 7 || s ==8 || s == 4){
        return 1; 
    }else {
        return 0; 
    }
}

function CA16784(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 1 || s == 6 || s == 7 || s ==8 || s == 4){
        return 1; 
    }else {
        return 0; 
    }
}

//alternating lines as columns  
function CA13784(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 1 || s == 3 || s == 7 || s ==8 || s == 4){
        return 1; 
    }else {
        return 0; 
    }
}

function CA(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 1 || s == 6 || s == 7 || s ==8 || s == 3){
        return 1; 
    }else {
        return 0; 
    }
}








