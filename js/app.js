let count = 0;
let starCount = 3;
let match = 0;
let flag = false;
let start, end;
let duration = 0;
let timer;


/*
 * Create a list that holds all of your cards
 */

var cardList = [];
var cards = document.getElementsByClassName('card');
Array.from(cards).forEach(function(card) {
  cardList.push(card.innerHTML);
});


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//display cards
const display = () => {

  shuffle(cardList);
  var li = $("ul.deck li");
  for (var i = 0; i < 16; i++) {
    li.eq(i).html(cardList[i]);
    li.eq(i).attr('class', 'card');
  }
};

// reset game
const reset = () => {

  $('span.moves').text(0);
  var star = $("ul.stars li");
  for (var j = 0; j < 3; j++) {
    star.eq(j).html('<i class="fa fa-star"></i>');
  }

  match = 0;
  count = 0;
  duration = 0;
  flag = false;
  $('.timer').text(0);
  $('.rating#star').html('');
};


// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// show and open cards
const show = (card) => {
  card.toggleClass('show');
  card.toggleClass('open');
};

// increment counter, change display
const counter = () => {
  count++;
  $('span.moves').text(count);
  if (count > 12 && starCount > 2 ) {
    starCount = 2;
    $('.stars li').eq(0).html('<i class="fa fa-star-o"></i>');
  }
  if (count > 16 && starCount > 1 ) {
    starCount = 1;
    $('.stars li').eq(1).html('<i class="fa fa-star-o"></i>');
  }
};

// match
const matched = (card) => {
  card.toggleClass('match');
};

// not match
const notMatch = (card) => {
  card.toggleClass('not-match');
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var setTimer = () => {
  timer = setTimeout(() => {
    end = new Date();
    $('.timer').text(Math.floor((end.getTime()-start.getTime())/1000));
  }, 1000);
}


$('.card').click(function() {

  if(flag===false){
    start = new Date();
    flag=true;
  }

  setTimer();

  show($(this));
  var openCard = $('.open');

  if (openCard.length === 2) {
    let curr = openCard.eq(1);
    let opened = openCard.eq(0);

    if (opened[0].innerHTML === curr[0].innerHTML) {
      matched(opened);
      matched(curr);
      show(opened);
      show(curr);
      match += 2;
    } else {
      setTimeout(function() {
        show(opened);
        show(curr);
        notMatch(opened);
        notMatch(curr);
      }, 300);
      notMatch(opened);
      notMatch(curr);
    }
    counter();
  }

  // match all 8 pairs of cards, show modal page
  if (match === 16) {
    clearTimeout(timer);
    let second = $('.timer').text();
    $('div.duration').text('You used ' + second + ' seconds');
    console.log(starCount);
    for(var s=0;s<starCount;s++){
      $('.s-stars').append('<li><i class="fa fa-star"></i></li>')
    }

    $('.modal').css('display', 'block');
    // $('.container').css('display', 'none');
  }
});

//access localStorage for scores
const updateScore = (name, time) => {
  var scores_storage = localStorage.getItem('list_score');

  if (scores_storage === 'undefined') {
    var scores = [];
    scores.push({
      name: name,
      time: time
    });
    localStorage.setItem("list_score", JSON.stringify(scores));
    display(scores);
  } else {
    var scores = JSON.parse(scores_storage);
    scores.push({
      name: name,
      time: time
    });
    localStorage.setItem("list_score", JSON.stringify(scores));
    displayScore(scores);
  }
};

//display score
const displayScore = (scores) => {
  if (scores.length > 1) {
    scores.sort(function(a, b) {
      var x = a.time;
      var y = b.time;
      return x < y ? -1 : (x > y ? 1 : 0);
    });
  }
  var table = $('#score-table');
  for (var i = 0; i < scores.length; i++) {
    table.append('<tr><td>' + i + '</td><td>' + scores[i].name + '</td><td>' + scores[i].time + '</td></tr>');
  }
};

//submit username
$('form.board').submit(function(event) {
  event.preventDefault();
  var username = $('input:first').val();
  updateScore(username, duration / 1000);
  $('#score').css('visibility', 'visible');
});

//play again
$('button.play-again').click((e) => {
  $('.modal').css('display', 'none');
  // $('.container').css('display', 'flex');
  reset();
  display();
});

//restart game
$('div.restart').click(() => {
  reset();
  display();
});

//shortcut for restart game: shift+r
var isShift = false;
$(document).keyup(function(e) {
  if (e.which === 16) {
    isShift = false;
  }
}).keydown(function(e) {
  if (e.which === 16) {
    isShift = true;
  }
  if (e.which === 82 && isShift) {
    display();
  }
});
