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
    console.log(grid);
}

printGridIds();
getGrid(0);









