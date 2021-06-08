# Project Overview
## Project Name
Poké-Ballin
## Project Description
Allows users to pick a basketball player of their choice and battle against a randomly generated player choice in pokemon style! Determines the damage from the moves based off their stats from last season!
## API and Data Sample
https://www.balldontlie.io/#introduction
``` JSON
data: [
  {
  id: 115,
  first_name: "Stephen",
  height_feet: 6,
  height_inches: 3,
  last_name: "Curry",
  position: "G",
  team: {
  id: 10,
  abbreviation: "GSW",
  city: "Golden State",
  conference: "West",
  division: "Pacific",
  full_name: "Golden State Warriors",
  name: "Warriors"
  },
  weight_pounds: 190
  }
],

```
https://nba-players.herokuapp.com/
Using this to only retrieve pictures of players.

## Wireframes
[Wireframe](https://imgur.com/bS4AJk5)
### MVP/PostMVP
#### MVP
- Axios call on the balldontlie API
- Get data and use the data to determine damage of moves
- Include photos of the players
- Display name,hp,and position
- Show damage done player and then computer
#### PostMVP 
- Make a pokemon battle style field that incorporates basketball'
- Make a logo
- Instead of decrementing number values for hp, make an hp bar
## Project Schedule
|  Day | Deliverable | Status
|---|---| ---|
|June 6-7| Prompt / Wireframes / Priority Matrix / Timeframes | Complete
|June 7| Project Approval | Complete
|June 8| Core Application Structure (HTML, CSS, etc.) | Incomplete
|June 10| Initial Clickable Model  | Incomplete
|June 11| MVP | Incomplete
|June 14| Presentations/Project Submission | Incomplete
## Priority Matrix
[Priority matrix] https://imgur.com/hysHqTc

## Timeframes
| Component | Priority | Estimated Time | Time Invested | 
| --- | :---: |  :---: | :---: | :---: |
| Initial HTML setup | H | 2hrs|  |  
| Axios set up | H | 7hrs|  |  
| Render results | H | 6hrs| |  
| Other JS | H | 6hrs|  |  
| CSS for basic layout | M | 1hrs|  |  
| CSS for results | M | 5hrs|  |  
| Image placement | M | 2hrs|  |  
| Media query | H | 3hrs|  |  
| General Research | H | 6hrs|  |  
| Debugging | H | 6hrs|  |  
| Total | H | 44hrs|  |  

## example api call 
This call will get the season averages stats of a player using their player ID and will be used to determine the damage and health of players.
https://www.balldontlie.io/api/v1/season_averages?season=2020&player_ids[]=115
```JSON
data: [
{
games_played: 63,
player_id: 115,
season: 2020,
min: "34:08",
fgm: 10.44,
fga: 21.67,
fg3m: 5.35,
fg3a: 12.71,
ftm: 5.75,
fta: 6.27,
oreb: 0.46,
dreb: 5.03,
reb: 5.49,
ast: 5.76,
stl: 1.21,
blk: 0.13,
turnover: 3.37,
pf: 1.89,
pts: 31.98,
fg_pct: 0.482,
fg3_pct: 0.421,
ft_pct: 0.916
}
]
```

The 4 moves for each player will be 
Shoot uses fg3_pct and fg3m
Pass uses assists
steal uses stl
box-out uses reb
Health uses min
