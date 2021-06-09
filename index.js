const API = 'https://www.balldontlie.io/api/v1';
const pictureAPI = 'https://nba-players.herokuapp.com/';
const playerUI = document.querySelector('#player-user');
const actionBox = document.querySelector('#action-box');
const searchImageDiv = document.querySelector('#search-image');
const actionLog = document.querySelector('#moveused-text');
const computerUI = document.querySelector('#computer-user');

const baseDamageShoot = 4;
const baseDamagePass = 2;
const baseDamageSteal = 3;
const baseDamageRebound = 2;
const button = document.querySelector('#get-player');

//clear the inner html of all UI if user selects a new player
const clearUI = () =>  {
  playerUI.innerHTML = '';
  searchImageDiv.innerHTML = '';
  actionLog.innerHTML ='';
  actionBox.style.visibility ="hidden";
  playerUI.style.visibility ="hidden";
}; 

//Uses playerID to get season averages and data
const seasonAverages = async (playerID) => {
  try{  
    const response = await axios.get(`${API}/season_averages?season=2020&player_ids[]=${playerID}`);
    const responseData = response.data.data[0];
    console.log(responseData);
    const threePointPerc = responseData.fg3_pct;
    console.log(threePointPerc);
    const threePointMade = responseData.fg3m;
    console.log(threePointMade);
    const minutes = responseData.min;
    let health = parseInt(minutes);    


    const move1 = document.querySelector('#move-1');
    const currentHealth = document.createElement('p');
    playerUI.appendChild(currentHealth);
    currentHealth.innerText = `HP: ${health}`;

    //what happens if user clicks on move 1 "shoot"
    move1.addEventListener('click', () => {
      //checks if players 3pt% is above or equal to 42% (a good 3pt shooter) to see if the move should do more damage
      if(threePointPerc >= .42) {
        const damage = Math.floor((baseDamageShoot + Math.floor((threePointPerc*threePointMade))) * 1.5); //bonus damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }else {
        const damage = Math.floor((baseDamageShoot + Math.floor((threePointPerc*threePointMade)))); //standard damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }
    });

    //what happens if user clicks on move 2 "steal"
    const move2 = document.querySelector('#move-2');
    const steals = responseData.stl;
    const blocks = responseData.blk;
    move2.addEventListener('click', () => {
      //checks if the players steals or blocks is above or equal to 2 (a great defensive player) to see if the move should do more damage
      if(steals >= 2 || blocks >= 2) {
        const damage = Math.floor((baseDamageSteal) + Math.floor((steals+blocks)) * 1.5); //bonus damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }else {
        const damage = Math.floor((baseDamageSteal) + Math.floor((steals+blocks))); //standard damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use      
      }
    });

    //what happens if user clicks on move 3 "pass"
    const move3 = document.querySelector('#move-3');
    const assists = responseData.ast;
    move3.addEventListener('click', () => {
      if(assists >= 7){
        //checks if players assists is above or equal to 7 (a good passer) to see if the move should do more damage
        const damage = Math.floor((baseDamagePass + Math.floor((assists/2))) * 1.5); //bonus damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }else{
        const damage = Math.floor((baseDamagePass + Math.floor((assists/2)))); //standard damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }
    });

    //what happens if user clicks on move 4 "box-out"
    const move4 = document.querySelector('#move-4');
    const rebounds = responseData.reb;
    move4.addEventListener('click', () => {
      if(rebounds >= 9){
        const damage = Math.floor((baseDamageRebound + Math.floor((rebounds/2))) * 1.5); //bonus damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }else{
        const damage = Math.floor((baseDamageRebound + Math.floor((rebounds/2)))); //standard damage
        health -= damage; //updates the user health
        currentHealth.innerText = `HP: ${health}`; //sets the users health for screen use
      }
    });
  }
  catch(error) {
    console.error(error.message);
  }
};


//searches for player by full name and gets their Full name back and their player ID
const searchPlayer = async (playerName) => {
    try{
    clearUI(); 
    const response = await axios.get(`${API}/players?search=${playerName}`);
    const responseData = response.data.data[0];
    const firstName = responseData.first_name;
    const lastName = responseData.last_name;
    const fullName = `${firstName} ${lastName}`;
    const pictureResponse = await axios.get(`${pictureAPI}players/${lastName}/${firstName}`);

    //set up the select image functionality
    const searchImgPicture = document.createElement('img');
    const searchImageATag = document.createElement('a'); //creating an anchor link to jump to the gameplay portion of the page
    searchImgPicture.src = pictureResponse.config.url;
    searchImageATag.href = "#play-game"
    const selectText = document.createElement('p');

    //clicking on the image will select the player and show the rest of the UI 
    selectText.innerText = "Click on the image to select this player";
    searchImageATag.appendChild(searchImgPicture);
    searchImageDiv.appendChild(searchImageATag);
    searchImageDiv.appendChild(selectText);
    searchImgPicture.addEventListener('click',()=>{
      actionBox.style.visibility ="visible";
      playerUI.style.visibility ="visible";
    });

    //get data for the player UI box
    const displayName = document.createElement('p');
    displayName.innerText = fullName;
    const position = responseData.position;
    const displayPosition = document.createElement('p');
    displayPosition.innerText = position;

    //loads the player UI box onto the page
    const img = document.createElement('img');
    img.src = pictureResponse.config.url;
    playerUI.append(img,displayName,displayPosition);
    
    const playerID = responseData.id;
    seasonAverages(playerID);
 

  } catch (error) {
    console.error(error.message);
  }
};


//repeat the same code above for the computer player. Make it so that after you click on any of the moves buttons it will then make the computer move like 1 second later

const computerSeasonAverages = async (playerID) => {
  try{  
    const response = await axios.get(`${API}/season_averages?season=2020&player_ids[]=${playerID}`);
    const responseData = response.data.data[0];
    console.log(responseData);
    const threePointPerc = responseData.fg3_pct;
    console.log(threePointPerc);
    const threePointMade = responseData.fg3m;
    console.log(threePointMade);
    const minutes = responseData.min;
    let health = parseInt(minutes);  
  }catch(error){
    console.error(error.message);
  } 
};



//hardcoding options for computer to select from
const playerNames = ["Lebron James", "Kevin Durant", "James Harden", "Anthony Davis", "Giannis Antetokounmpo" ]

const computerPlayer = async (computerName) => {
  try{
    const response = await axios.get(`${API}/players?search=${computerName}`);
    const responseData = response.data.data[0];
    const firstName = responseData.first_name;
    const lastName = responseData.last_name;
    const fullName = `${firstName} ${lastName}`;
    const pictureResponse = await axios.get(`${pictureAPI}players/${lastName}/${firstName}`);

    //get data for the computer UI box
    const displayName = document.createElement('p');
    displayName.innerText = fullName;
    const position = responseData.position;
    const displayPosition = document.createElement('p');
    displayPosition.innerText = position;

    //loads the player UI box onto the page
    const img = document.createElement('img');
    img.src = pictureResponse.config.url;
    computerUI.append(img,displayName,displayPosition);
    
    const playerID = responseData.id;
    computerSeasonAverages(playerID);
 

  } catch (error) {
    console.error(error.message);
  }
};


const playerForm = document.querySelector('form')
const playerSearch = document.querySelector('#player-search')

playerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await searchPlayer(playerSearch.value);
  await computerPlayer(playerNames[Math.floor(Math.random()*playerNames.length)]);
  playerSearch.value='';   
});