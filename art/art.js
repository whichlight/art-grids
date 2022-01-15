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
//how to update this without having to do it on each deploy? 
const gridAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
let grid_res = getGrid(1);
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
    background(2);
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

        /*
        CAF stands for Cellular Automata Function
        After running a bunch of functions i updated the function to just take a number. 
        if the left, middle, and right number in binary equal 
         any of the digits of the 4th arg, it is 1. else 0.
         
         see here for the binary notation: https://natureofcode.com/book/chapter-7-cellular-automata/
        */
        layer[i] = CAF(l2[i-1], l2[i], l2[i+1], 012348);
    }

    /*
    some cool number functions 

    favs: 
        3456: arrows top left mountains
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
}

function CAF(a,b,c, val){
    let res = 0;
    let s = a*(2**2) + b*(2**1) + c*(2**0);
    let digits_str = val.toString().split('');
    var realDigits = digits_str.map(Number) 

    realDigits.forEach(function(p){
        if(s==p){
            res = 1;
        }
    });
    return res; 

}






/////////// old CA code 
/*
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

//black triangles downwards
function CA01478(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 0 || s == 1 || s == 4 || s ==7 || s == 8){
        return 1; 
    }else {
        return 0; 
    }
}

function CA4(a,b,c){
    let s = 2**a + 2**b + 2**c;
    if(s == 4){
        return 1; 
    }else {
        return 0; 
    }
}

function CA(a,b,c){
    let s = a*(2**2) + b*(2**1) + c*(2**0);
    if( s == 7 || s == 6 || s == 0 || s == 1 || s == 2){
        return 1; 
    }else {
        return 0; 
    }
}
*/







