function assert (actual, expected) {
  if ( expected !== actual ) {
    throw new Error(`Assertion Failed!\nExpected: ${expected}\nActual: ${actual}`)
  }
}



//
// Exercise #1: Abstraction
//
// Use find, filter, and map to abstract away all the
// tedious `for` loops in the following code.
//
// NOTE: See data.js for the actual data you are working with.
//


console.log("[Exercise #1]")

//
// Finds all games by alice that were won by 50 points or more.
//
function findDominatingAliceGameScores () {
  // First find alice
  var alice = Data.players.filter(function(x) { return x.name === 'Alice';})
  console.log('alice:', alice)
console.log('alice.id:', alice[0].id)


  // Next, find all games where alice won
  var aliceGames = Data.games.filter(function(game) {
    return game.player1_id === alice[0].id && game.player1_score === 100
      || game.player2_id === alice[0].id && game.player2_score === 100 })

  console.log('Alice games:', aliceGames)


  // Next, filter for dominating games and add differences
  var dominating = aliceGames.filter(function(game){ return Math.abs(game.player1_score - game.player2_score) >= 50})

  console.log('dominating games:', dominating);

  var result = dominating.map(function(game){
    return Math.abs(game.player1_score - game.player2_score);
  })

    console.log('result:', result);


  return result

}

//
// Tests
//
var testRun = findDominatingAliceGameScores();
assert( testRun.length, 2 );
assert( testRun[0], 57 );
assert( testRun[1], 97 );
console.log("All good!");

//
// Exercise #2: Extract
//
// 1. Copy/paste your function down here and name it findDominatingAliceGameScores2.
//
// 2. Extract the callbacks you pass into map and filter into their own, curried functions.
//    You'll find a couple written for you.
//
// 3. Refactor your findDominatingAliceGameScores2 to use your new functions.
//
// NOTE: Feel free to use the solution code for the previous exercise.
//

function findDominatingAliceGameScores2 () {
  // First find alice
  var alice = Data.players.filter(hasName("Alice"))

  console.log('alice2:', alice)
  console.log('alice2.id:', alice[0].id)


  // Next, find all games where alice won
  var aliceGames = Data.games.filter(isWinningGameFor(alice[0].id))

  console.log('Alice games2:', aliceGames)


  // Next, filter for dominating games and add differences
  var dominating = aliceGames.filter(greaterThanOrEqualTo(50))

  console.log('dominating games:', dominating);

  var result = dominating.map(function(game){
    return Math.abs(game.player1_score - game.player2_score);
  })

    console.log('result:', result);

  return result

}

function hasName (name) {
  return function (person) {
    return person.name === 'Alice';
  };
}

function isWinningGameFor (playerId) {
  return function (game) {
    return game.player1_id === playerId && game.player1_score === 100
        || game.player2_id === playerId && game.player2_score === 100;
  };
}



function greaterThanOrEqualTo (amount) {
  return function toPlayerScoreDifference (game) {
     return Math.abs(game.player1_score - game.player2_score) >= amount
  }
}

console.log("[Exercise #2]")

var testRun2 = findDominatingAliceGameScores2();
assert( testRun2.length, 2 );
assert( testRun2[0], 57 );
assert( testRun2[1], 97 );
console.log("All good!");


//
// Exercise #3: Build
//
// WARNING: THIS IS A DIFFICULT TASK
//
// Write a function that returns the following type for a given clan id:
//
//   { clanId: Number, winCount: Number, strongWinCount: Number }
//
// where strongWinCount is any winning clan game with a point difference greater than 35.
//
// You should only calculate games that are against other clans,
// i.e. games that are not between two members of the given clan.
//

// Hint: This might be useful in your solution :)
Array.prototype.any = function (matchFn) {
  for (var i=0; i < this.length; i++) {
    var isMatch = matchFn(this[i]);
    if ( isMatch ) { return true; }
  }
  return false;
}

function clanStats (clanName) {
  // TODO: Implement this function.
  //       See if you can re-use a function or two from the previous exercise :)

  //Find clan id with given name
  var clanId = Data.clans.filter(function(clan) {
    return clan.name === clanName;
  })
  console.log('clanId:', clanId[0].id)


  //Find players who are members of the clan


  var members = Data.memberships.filter(function(id) {
    return id.clan_id === clanId[0].id;
  })

  console.log('members:', members);

  var memberID = members.map(function(member) {
    return member.player_id;
  })
  console.log('memberID', memberID)

  //Find games with members of the clan


  var memberGames = Data.games.filter(function(game) {
    return (game.player1_id === memberID[0] && game.player1_score === 100
        || game.player2_id === memberID[0] && game.player2_score === 100) &&
        ( game.player1_id !== memberID[1] && game.player2_id !== memberID[1] );
  })

  var memberGames2 = Data.games.filter(function(game) {
    return (game.player1_id === memberID[1] && game.player1_score === 100
        || game.player2_id === memberID[1] && game.player2_score === 100) &&
        ( game.player1_id !== memberID[0] && game.player2_id !== memberID[0] );
  })

  var memberGamesTogether = memberGames.concat(memberGames2)

  console.log('combined games:', memberGamesTogether)

  var winCount = memberGamesTogether.length
  console.log('Win count:', winCount)

  var strongWin = memberGamesTogether.filter(greaterThanOrEqualTo(35))

  console.log('strong wins:', strongWin.length)

  return { clanId: clanId[0].id, winCount: winCount, strongWinCount: strongWin.length }

}

// Helper function
function isMemberOfClan (clanId) {
  return function (playerId) {
    return !! Data.memberships.find( mem =>
      mem.player_id === playerId && mem.clan_id === clanId
    );
  }
}

console.log("[Exercise #3]");

var testRun3 = clanStats('Iron Rockstars');
assert( testRun3.clanId, 20 );
assert( testRun3.winCount, 15 );
assert( testRun3.strongWinCount, 11 );

var testRun4 = clanStats('24k Ninjas');
assert( testRun4.clanId, 21 );
assert( testRun4.winCount, 15 );
assert( testRun4.strongWinCount, 10 );
console.log("All good!");
