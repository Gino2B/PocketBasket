const API = 'https://www.balldontlie.io/api/v1';
const pictureAPI = 'https://nba-players.herokuapp.com/';
const playerUI = document.querySelector('#player-user');
const actionBox = document.querySelector('#action-box');
const searchImageDiv = document.querySelector('#search-image');
const actionLog = document.querySelector('#moveused-text');
const computerUI = document.querySelector('#computer-user');
const playerHP = document.createElement('p');
const computerHP = document.createElement('p');
const playerUIContainer = document.querySelector('#playerUI-container');
const computerUIContainer = document.querySelector('#computerUI-container');
const playerImageContainer = document.querySelector('#playerImage-container');
const computerImageContainer = document.querySelector('#computerImage-container');
const computerHPText = document.createElement('p');
const userHPText = document.createElement('p');
const actionPrompt = document.querySelector('#action-prompt');

const baseDamageShoot = 3;
const baseDamagePass = 2;
const baseDamageSteal = 3;
const baseDamageRebound = 2;
const button = document.querySelector('#get-player');

//clear the inner html of all UI if user selects a new player
const clearUI = () =>  {
  playerUIContainer.innerHTML = '';
  searchImageDiv.innerHTML = '';
  actionLog.innerHTML ='';
  computerUIContainer.innerHTML = '';
  playerImageContainer.innerHTML = '';
  computerImageContainer.innerHTML = '';


  //setting up hp values
  userHPText.id = "playerHP-text";
  userHPText.innerText = "HP:";
  computerHPText.id = "computerHP-text";
  computerHPText.innerText = "HP:";
  playerHP.innerText = 33;
  playerHP.id = 'playerHP';
  playerUIContainer.append(userHPText,playerHP);
  computerHP.innerText = 33;
  computerHP.id = 'computerHP';
  computerUIContainer.append(computerHPText,computerHP);
  //setting up hp values

  actionBox.style.visibility ="hidden";
  playerUI.style.visibility ="hidden";
  computerUI.style.visibility = "hidden";
}; 

//Uses playerID to get season averages and data
const seasonAverages = async (playerID, playerName) => {
  try{  
    const response = await axios.get(`${API}/season_averages?season=2020&player_ids[]=${playerID}`);
    const responseData = response.data.data[0];
    const threePointPerc = responseData.fg3_pct;
    const threePointMade = responseData.fg3m;
    const move1 = document.querySelector('#move-1');

    actionPrompt.innerText = `What will ${playerName} do?`;

    const computerHP = await document.querySelector('#computerHP');
    let computerHPvalue = computerHP.textContent;

    //what happens if user clicks on move 1 "shoot"
    move1.addEventListener('click', () => {
      //checks if players 3pt% is above or equal to 42% (a good 3pt shooter) to see if the move should do more damage
      if(threePointPerc >= .42) {
        const damage = Math.floor((baseDamageShoot + Math.floor((threePointPerc*threePointMade))) * 1.5); //bonus damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
      }else {
        const damage = Math.floor((baseDamageShoot + Math.floor((threePointPerc*threePointMade)))); //standard damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
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
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
      }else {
        const damage = Math.floor((baseDamageSteal) + Math.floor((steals+blocks))); //standard damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use  
      }
    });

    //what happens if user clicks on move 3 "pass"
    const move3 = document.querySelector('#move-3');
    const assists = responseData.ast;
    move3.addEventListener('click', () => {
      if(assists >= 7){
        //checks if players assists is above or equal to 7 (a good passer) to see if the move should do more damage
        const damage = Math.floor((baseDamagePass + Math.floor((assists/2))) * 1.5); //bonus damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
      }else{
        const damage = Math.floor((baseDamagePass + Math.floor((assists/2)))); //standard damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
      }
    });

    //what happens if user clicks on move 4 "box-out"
    const move4 = document.querySelector('#move-4');
    const rebounds = responseData.reb;
    move4.addEventListener('click', () => {
      if(rebounds >= 7){
        const damage = Math.floor((baseDamageRebound + Math.floor((rebounds/2))) * 1.5); //bonus damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
      }else{
        const damage = Math.floor((baseDamageRebound + Math.floor((rebounds/2)))); //standard damage
        computerHPvalue -= damage; //updates the user health
        computerHP.innerText = computerHPvalue;//sets the users health for screen use
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
      actionBox.style.visibility = "visible";
      playerUI.style.visibility = "visible";
      computerUI.style.visibility = "visible";
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
    playerImageContainer.appendChild(img);
    playerUIContainer.append(displayName,displayPosition);
    
    const playerID = responseData.id;
    seasonAverages(playerID, fullName);
 

  } catch (error) {
    console.error(error.message);
  }
};


//repeat the same code above for the computer player. Make it so that after you click on any of the moves buttons it will then make the computer move like 1 second later

const computerSeasonAverages = async (playerID) => {
  try{  
    const response = await axios.get(`${API}/season_averages?season=2020&player_ids[]=${playerID}`);
    const responseData = response.data.data[0];
    const threePointPerc = responseData.fg3_pct;
    const threePointMade = responseData.fg3m;
    const playerHP = await document.querySelector('#playerHP');
    let playerHPvalue = playerHP.textContent;

    const move1 = document.querySelector('#move-1');
    const move2 = document.querySelector('#move-2');
    const steals = responseData.stl;
    const blocks = responseData.blk;
    const move3 = document.querySelector('#move-3');
    const assists = responseData.ast;
    const move4 = document.querySelector('#move-4');
    const rebounds = responseData.reb;

    const useMove = (num) => {
      if(num === 0) {
        if(threePointPerc >= .42) {
          //checks if players 3pt% is above or equal to 42% (a good 3pt shooter) to see if the move should do more damage
          const damage = Math.floor((baseDamageShoot + Math.floor((threePointPerc*threePointMade))) * 1.5); //bonus damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Shoot");
        }else {
          const damage = Math.floor((baseDamageShoot + Math.floor((threePointPerc*threePointMade)))); //standard damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Shoot");
        }
      }else if(num === 2){
        if(steals >= 2 || blocks >= 2) {
          //checks if the players steals or blocks is above or equal to 2 (a great defensive player) to see if the move should do more damage
          const damage = Math.floor((baseDamageSteal) + Math.floor((steals+blocks)) * 1.5); //bonus damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Defend");
        }else {
          const damage = Math.floor((baseDamageSteal) + Math.floor((steals+blocks))); //standard damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Defend");
        }
      }else if(num === 3){    //what happens if user clicks on move 3 "pass"
        if(assists >= 7){
          //checks if players assists is above or equal to 7 (a good passer) to see if the move should do more damage
          const damage = Math.floor((baseDamagePass + Math.floor((assists/2))) * 1.5); //bonus damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Pass");
        }else{
          const damage = Math.floor((baseDamagePass + Math.floor((assists/2)))); //standard damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Pass");
        }        
      }else{    //what happens if user clicks on move 4 "box-out"
        if(rebounds >= 7){
          const damage = Math.floor((baseDamageRebound + Math.floor((rebounds/2))) * 1.5); //bonus damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Box-out");
        }else{
          const damage = Math.floor((baseDamageRebound + Math.floor((rebounds/2)))); //standard damage
          playerHPvalue -= damage; //updates the user health
          playerHP.innerText = playerHPvalue;//sets the users health for screen use
          console.log("Used Box-out");
        }        
      }
    };
    
    move1.addEventListener('click', () => {
      useMove(Math.floor(Math.random() * 4));
    } ); 

    move2.addEventListener('click', () => {
      useMove(Math.floor(Math.random() * 4));
    } ); 

    move3.addEventListener('click', () => {
      useMove(Math.floor(Math.random() * 4));
    } ); 

    move4.addEventListener('click', () => {
      useMove(Math.floor(Math.random() * 4));
    } ); 

  }catch(error){
    console.error(error.message);
  } 
};



//hardcoding options for computer to select from the top 20 players (IMO)
const playerNames = ["Lebron James", "Kevin Durant", "James Harden", "Anthony Davis", "Giannis Antetokounmpo","Stephen Curry", "Kawhi Leonard", "Jimmy Butler", "Joel Embiid","Nikola Jokic", "Damian Lillard", "Bradley Beal", "Jayson Tatum", "Russell Westbrook", "Kyrie Irving", "Paul George", "Chris Paul", "Devin Booker", "Donovan Mitchell", "Karl-Anthony Towns" ]


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
    computerImageContainer.appendChild(img);
    computerUIContainer.append(displayName,displayPosition);
    
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
