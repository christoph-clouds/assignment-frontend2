import $ from 'jquery';
import handlebars from 'hbsfy/runtime';
import players from './templates/players.json';
import playerprofile from './templates/playerprofile.hbs';
import playerlist from './templates/playerlist.hbs';
import contact from './templates/contact.hbs';
import index from './templates/index.hbs';
import missingpage from './templates/index.hbs';


$(document).ready(() => {
  $('a').click(function(event){
    event.preventDefault();
    let currentPath = event.currentTarget.pathname
    router(currentPath)
    history.pushState(currentPath, currentPath, currentPath)
  })

  let allPlayers = []
  allPlayers.push(players)



  const routes = [
    {
      route: '/players/:player',
      functionThatIShouldCall: function(name) {
        let displayedPlayer = allPlayers[0].allPlayers.find(function(player){
          if(player.name == name)return player;
        })
        $('#app').html(playerprofile({player:displayedPlayer}))
        console.log("i display a player now")
      }
    },
    {
      route: '/players',
      functionThatIShouldCall: function() {
        $('#app').html(playerlist({item: allPlayers[0].players}))
        console.log("i display the playerlist now")
      }
    },
    {
      route: '/contact',
      functionThatIShouldCall: function() {
        $('#app').html(contact)
        console.log("i display the contact now")
      }
    },
    {
      route: '/',
      functionThatIShouldCall: function() {
        $('#app').html(index)
        console.log("home")
      }
    },
    {
      route: '/home',
      functionThatIShouldCall: function() {
        $('#app').html(index)
        console.log("home")
      }
    },
    {
      route: '*',
      functionThatIShouldCall: function() {
        $('#app').html(missingpage)
        console.log("404")
      }
    }
  ];

  const routesRegularExpressionDynamic = routes
    .map(createRegularExpressionDynamicRoute);

  function createRegularExpressionDynamicRoute(route) {
    const regex = route
      .route
      .split('/')
      .map((part) => {
        if (part[0] === ':') {
          return '([a-z]+)';
        }

        if (part === '*') {
          return '.*';
        }
        return part;
      })
      .join('/');
    return {
      regex,
      route
    }
  }

  function router(path) {
    for (let route of routesRegularExpressionDynamic) {
      const result = path.match(route.regex)
      if (result) {
        const param = result[1]
        route.route.functionThatIShouldCall(param)
        return
      }
    }
  }

  let currentPath = document.location.pathname
  router(currentPath)
})


