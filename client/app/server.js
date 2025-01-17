
//   XHR REQUEST MAIN CODE (from Workshop 6)
var token = 'eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSJ9'; // <-- Put your base64'd JSON token here
/**
 * Properly configure+send an XMLHttpRequest with error handling, authorization token,
 * and other needed properties.
 */
function sendXHR(verb, resource, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(verb, resource);
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);

  // The below comment tells ESLint that KukError is a global.
  // Otherwise, ESLint would complain about it! (See what happens in Atom if
  // you remove the comment...)
  /*global KukError*/

  // Response received from server. It could be a failure, though!
  xhr.addEventListener('load', function() {
    var statusCode = xhr.status;
    var statusText = xhr.statusText;
    if (statusCode >= 200 && statusCode < 300) {
      // Success: Status code is in the [200, 300) range.
      // Call the callback with the final XHR object.
      cb(xhr);
    } else {
      // Client or server error.
      // The server may have included some response text with details concerning
      // the error.
      var responseText = xhr.responseText;
      KukError('Could not ' + verb + " " + resource + ": Received " + statusCode + " " + statusText + ": " + responseText);
    }
  });

  // Time out the request if it takes longer than 10,000 milliseconds (10 seconds)
  xhr.timeout = 10000;

  // Network failure: Could not connect to server.
  xhr.addEventListener('error', function() {
    KukError('Could not ' + verb + " " + resource + ": Could not connect to the server.");
  });

  // Network failure: request took too long to complete.
  xhr.addEventListener('timeout', function() {
    KukError('Could not ' + verb + " " + resource + ": Request timed out.");
  });

  switch (typeof(body)) {
    case 'undefined':
      // No body to send.
      xhr.send();
      break;
    case 'string':
      // Tell the server we are sending text.
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(body);
      break;
    case 'object':
      // Tell the server we are sending JSON.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      // Convert body into a JSON string.
      xhr.send(JSON.stringify(body));
      break;
    default:
      throw new Error('Unknown body type: ' + typeof(body));
  }
}

export function removeRecipefromCalendar(userid, week, day, meal, cb) {
  sendXHR('DELETE', '/api/user/' + userid + '/calendar/' + week + "/" + day + "/" + meal, undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
      });
}


export function getProfileCalendarData(userid, week, cb) {
  sendXHR('GET', '/api/user/' + userid + '/calendar/' + week, undefined, (xhr) => {
    // Call the callback with the data.
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * @param user The id of the user
 * @param cb The callback function to be called at the end
 * Calls cb on a UserData object that is resolved except for the restriction references.
 */
export function getProfileData(user, cb) {
  sendXHR('GET', '/api/user/' + user, undefined, (xhr) => {
    // Call the callback with the data.
    cb(JSON.parse(xhr.responseText));
  });
}


//need functions to addFavorites, addRating, addMealstoCalendar, getRecipeInformation
//modifyRestrictions (for the profile)

export function getRecipe(recipeId, cb) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "/api/recipe/" + recipeId);
   xhr.addEventListener("load", function(){
      cb(JSON.parse(xhr.responseText));
   });
   xhr.send();
}

/**
 * @param user The id of the user
 * @param cb The callback function to be called at the end
 */
export function getUserRestrictions(user, cb) {
  sendXHR('GET', '/api/user/' + user + '/restriction', undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  })
}

/**
 * @param checkbox The DOM object triggering this call
 * @param userId The id of the user whose restrictions are to be modified
 * @param cb The callback function to be called at the end
 * Calls cb on an object holding the user's modified restrictions array (unresolved)
 * and the checkbox.
 */
export function addUserRestriction(restrictionId, userId, cb) {
  sendXHR('PUT', '/api/user/' + userId + '/restriction/' + restrictionId, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * @param restrictionId The id of the restriction to be removed
 * @param userId The id of the user whose restrictions are to be modified
 * @param cb The callback function to be called at the end
 * Calls cb on the user's modified restrictions array (unresolved)
 */
export function removeUserRestriction(restrictionId, userId, cb) {
  sendXHR('DELETE', '/api/user/' + userId + '/restriction/' + restrictionId, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * @param cb The callback function to be called at the end
 * Calls cb on either an empty array or an array of the current user's
 * restrictions, based on whether or not the user has an account.
 */
export function getCurrentUserRestrictions(cb) {
  sendXHR('GET', '/api/user/restrictions', undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * @param array of restrictions to not be included
 * @param cb, callback function
 * Emulates a REST call to get the feed data for a particular user.
 */
export function getFeedData(restrictions, cb) {
  sendXHR('PUT','/api/feed/', restrictions, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * Returns an array of the recipes whose names match the searched keyword.
 */
export function findRecipe(searchText, cb) {
  sendXHR('POST', '/api/results', searchText, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * Returns an array of the recipes whose ids match the list of recipe ids.
 */
export function findRecipesFromId(userId,recipeIDs, cb) {
  sendXHR('GET', '/api/user/' + userId + '/favorites/', undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
      });
}

/**
* The function that adds recipes to the user's list of favorites
*/
export function addFavorite(recipeId, userId, cb) {
   sendXHR("PUT", "/api/recipe/" + recipeId + "/favorites/user/" + userId, undefined, (xhr) => {
      cb(JSON.parse(xhr.responseText));
   });
}

/**
* The function that removes recipes from the user's list of favorites
*/
export function removeFavorite (recipeId, userId, cb) {
   sendXHR("DELETE", "/api/recipe/" + recipeId + "/favorites/user/" + userId, undefined, (xhr) => {
      cb(JSON.parse(xhr.responseText));
   });
}

/**
 * @param user The id of the user
 * @param cb The callback function to be called at the end
 */
export function checkUserFavorites(recipeId, userId, cb) {
   sendXHR("GET", "/api/recipe/" + recipeId + "/favorites/check/user/" + userId, undefined, (xhr) => {
      cb(JSON.parse(xhr.responseText));
   });
}

/**
* Adding a recipe to the user's calendar when given the user's id, the recipe's id,
* and the day you want to add the recipe to
*/
export function addRecipeToCalendar(recipeId, userId, week, day, meal, cb) {
   sendXHR("PUT", "/api/recipe/" +recipeId+ "/user/" +userId+ "/calendar/" + week + "/"+ day + "/"+ meal, undefined, (xhr) => {
      cb(JSON.parse(xhr.responseText));
   });

}

/**
* Looks through the user's weekly list of recipes and gives back a shopping
* list based on the calendar.
*/
export function getShoppingList(userId, cb) {
   sendXHR("GET", "/api/user/" +userId + "/shoppingList/",
   undefined, (xhr) => {
      cb(JSON.parse(xhr.responseText));
   })
}


/**
  * Gets the recipes that have the ingredients the user puts in
  * @param ingredientsList is the list of ingredients entered in instamode
  */
export function findRecipeByIngredients(ingredientsList, cb) {
    var ingredientString = "";
    for (var i = 0; i < ingredientsList.length; i++) {
      if (i===0) {
        ingredientString += ingredientsList[i];
      } else {
        ingredientString += '='+ingredientsList[i];
      }
    }
    sendXHR("POST", '/api/instaresults/'+ ingredientString, undefined, (xhr) => {
      cb(JSON.parse(xhr.responseText));
    })
}

/**
  * Gets the recipes that have the ingredients the user puts in
  * @param ingredientsList is the list of ingredients entered in instamode
  */
export function findRecipeByOnlyIngredients(ingredientsList, cb) {
  var ingredientString = "";
  for (var i = 0; i < ingredientsList.length; i++) {
    if (i===0) {
      ingredientString += ingredientsList[i];
    } else {
      ingredientString += '='+ingredientsList[i];
    }
  }
  sendXHR("POST", '/api/instaresults/ingredientsONLY/'+ ingredientString, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  })
}
