$(function() {
  // Add click listener for movies not on page yet
  // TODO: toggle animation on click -- make it go back
  $('body').on('click', '.movie', function() {
    if ($(this).hasClass('wide')) {
      animateHide($(this));

    } else {
      animateShow($(this));
    }
  });

  // Add click listener to add button
  $('#addButton').on('click', function(){
    getMovieObject($('input').val());
    $('input').val('');
  });

  addBaseTitles();
});

function animateShow(movieArticle) {
  movieArticle.addClass('wide');
  movieArticle.find('.detailListing').show();
  movieArticle.find('img').removeClass('thumb').addClass('detailThumb');
  movieArticle.animate({
    width: '80%',
    padding: '+=28px'
  });
}

function animateHide(movieArticle) {
  movieArticle.removeClass('wide');
  movieArticle.find('.detailListing').hide();
  movieArticle.find('img').removeClass('detailThumb').addClass('thumb');
  movieArticle.animate({
    width: '15%',
    padding: '-=28px'
  });
}

function addBaseTitles() {
  // Display these titles by default
  getMovieObject('Muppet Movie', 'The Film That I Tried to Recreate On Roadtrips Forever After');
  getMovieObject('Labyrinth', 'I Really, Really Wanted to Be that Girl. Also, Bowie.');
  getMovieObject('Spirited Away', 'The Only DVD I Own');
  getMovieObject('Lagaan', 'Longest Film I Ever Loved');
  getMovieObject('Business of Being Born', 'Why My Baby Was Born at Home');
  getMovieObject('Fat Sick Nearly Dead', 'Why I Drink a Green Smoothie Every Day');
  getMovieObject('The Sound of Music', 'The One That I Can Sing Along with Every Word');
  getMovieObject('The Matrix', 'The Only Movie I Ever Watched Twice -- In A Row');
  getMovieObject('Memento', 'The One I Waited At Least Three Hours to See At Sundance Film Festival');
  getMovieObject('Blade Runner', 'MMmmm, Dystopia ...');
  getMovieObject('The Exorcist', 'The Scariest Movie I Ever Saw On TV When I Was Home Alone and Way Too Young -- And Why The Hell Was A Rated R Movie Showing at that Time, Anyway?');
}

function getMovieObject(title, significance) {
  // Makes ajax call and retrieves movie Object
  $.ajax ({
    url: getApiCall(title),
    type: 'GET'

  }).done(function(response) {
    // If response returns without error
    addTitleDisplay(response, significance);

  }).fail(function(response) {
    // If there is a server error
    alert('Server error');
  })
}

function stringifyTitleForOMDB(stringTitle) {
  // Takes string from text input as argument
  // Returns lowercase string with spaces replaced with +
  var newString = '';
  for (var i = 0; i < stringTitle.length; i++) {
    // Replace spaces with plus signs
    if (stringTitle[i] == ' ') {
      newString += '+';

    } else {
      newString += stringTitle[i];
    }
  }
  return newString.toLowerCase();
}

function getApiCall(title) {
  // Takes title and returns api call for OMDB
  var htmlPrefix = 'http://www.omdbapi.com/?t=';
  var htmlSuffix = '&y=&plot=full&r=json';
  return htmlPrefix + stringifyTitleForOMDB(title) + htmlSuffix;
}

function addTitleDisplay(movieObject, significance) {
  // Called by getMovieObject function
  // Appends movie article to HTML

  // Retrieve wanted data from movie object & format in html
  var imageHtml = '<img class="thumb" src="' + movieObject.Poster + '" alt="movie poster"/>';
  var titleHtml = '<h2>' + movieObject.Title + '</h2>';
  if (significance) {
    titleHtml += '<h3>' + significance + '</h3>';
  }
  var bodyHtml = '';

  var keysForNeededShortDetailText = ['Director', 'Year', 'Rated', 'Runtime'];
  for (it in keysForNeededShortDetailText) {
    var key = keysForNeededShortDetailText[it];
    bodyHtml += '<p><b>' + key + ':</b>' + '&#032;&#032;&#032;' + movieObject[key] + '</p>';
  }

  var keysForNeededLongDetailText = ['Writer', 'Actors', 'Genre', 'Plot'];
  for (it in keysForNeededLongDetailText) {
    var key = keysForNeededLongDetailText[it];
    bodyHtml += '<h4>' + key + '</h4>';
    bodyHtml += '<p>' + movieObject[key] + '</p>';
  }

  // Append it all to the DOM
  $('.movieListing').append('<article class="movie">' + imageHtml + '</article>');
  $('.movieListing').children().last().append('<div class="detailListing"></div>');
  $('.movieListing').children().last().find('div').append(titleHtml);
  $('.movieListing').children().last().find('div').append(bodyHtml);

  // Hide detail text
  $('.movieListing').children().last().find('.detailListing').hide();
}
