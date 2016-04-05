// Implement your server in this file.
// We should be able to run your server with node src/server.js
// Imports the express Node module.

var express = require('express');
// Creates an Express server.
var app = express();

//importing methods from the database
var database = require('./database');
var readDocument = database.readDocument;
var writeDocument = database.writeDocument;
app.use(express.static('../client/build'));

// HTTP REQUEST FUNCTIONS GO HERE

/*
* Given a recipe ID, returns a recipe object with references resolved.
* Internal to the server, since it's synchronous.
* Comes directly from the old server.js.
*/
function getRecipeSync(recipeId) {
   var recipe = readDocument('recipe', recipeId);
   return recipe;
}


/*
* This method replaces "getRecipe" from the old server.
* It gives recipe data from the database given a recipe * id.
*/
app.get('/recipe/:recipeid/', function(req, res) {
   //get the recipe id out of the url
   var recipeid = req.params.recipeid;
   //send the response
   res.send(getRecipeSync(recipeid));
});


/*
* This function adds a recipe to a user's list of
* favorites. Replacement of addFavorite.
*/
app.put('/recipe/:recipeid/favorites/user/:userid', function(req, res) {
   console.log("in the favoriting method");
   var userid = req.params.userid;
   var user = readDocument("users", userid);
   var recipeid = req.params.recipeid;
   user.favorites.push(recipeid);
   writeDocument("users", user);
   res.send(user);
});

/*
* This function removes a recipe from the user's list
* of favorites. Replacement of removeFavorite.
*/
app.delete("/recipe/:recipeid/favorites/user/:userid", function(req, res) {
   console.log("in the unfavoriting method");
   var userid = req.params.userid;
   var user = readDocument("users", userid);
   var recipeid = req.params.recipeid;
   var favoriteIndex = user.favorites.indexOf(recipeid);
   if (favoriteIndex !== -1) {
      user.favorites.splice(favoriteIndex, 1);
   }
   writeDocument("users", user);
   res.send(user);
});

/*
* This function checks the user's favorites to see if
* a given recipe already exists in their list of
* favorites.
*/
app.put("/recipe/:recipeid/favorites/check/user/:userid", function(req, res) {
   console.log("in the server side checkUserFavorites");
   var userid = req.params.userid;
   var recipeid = req.params.recipeid;
   var user = readDocument("users", userid);
   var favorites = user.favorites;
   var isRecipeIn = false;
   if (favorites.includes(recipeid)) {
      isRecipeIn = true;
   }
   res.send(isRecipeIn);
});


// Starts the server on port 3000
app.listen(3000, function () {
  console.log('Kuk server listening on port 3000!');
});
