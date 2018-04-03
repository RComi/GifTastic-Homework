// api key from giphy
var apiKey = "3b2SrvZDQP8Itasl5nakpnUrsCvMCChn";
// sports button variable 
var sports = ["Football", "Baseball", "Basketball", "Hockey", "Rugby",
    "Lacrosse", "Soccer", "Golf", "Archery", "Tennis"];
// Limit API to 10 gifs
var limit = "10";

// search function and event handler with enter key
$(document).ready(function () {
    createButtons();
    $('#giphy-imgs').on('click', '.gif-img-area', toggleGif);
    $('#search-btn').on('click', search);
    $('#search-input').keypress(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });
});

// Giphy url 
function getGiphyURL(searchTerm) {
    return 'https://api.giphy.com/v1/gifs/search?q=' + searchTerm + "&limit=" + limit + '&api_key=' + apiKey;
}
// creates buttons from the array and attaches an onclick function
function createButtons() {
    for (var i = 0; i < sports.length; i++) {
        $("#giphy-btns").append($('<button/>', {
            text: sports[i],
            id: sports[i],
            class: 'btn btn-warning',
            click: function () {
                $('#giphy-imgs').empty();
                var term = $(this).attr('id');
                var apiURL = getGiphyURL(term);
                setUpGifs(apiURL);
            }
        })
        );
    }
}
// ajax call to get giphy images, with ratings by sport title
// and then creates the divs
function setUpGifs(apiURL) {
    $.ajax({
        url: apiURL,
        method: 'GET',
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var currentStillURL = response.data[i].images.fixed_height_still.url;
                var currentMovingURL = response.data[i].images.fixed_height.url;
                var currentRating = response.data[i].rating;
                var currentTitle = response.data[i].title;

                //check for a rating
                if (currentRating == "") {
                    currentRating = "none";
                }
                // add container to hold gif title rating
                var gifContainer = $('<div/>', {
                    class: "gif-container col-sm-4",
                    text: currentTitle
                });
                // div to hold images keeps track of clicked or not
                var imgDiv = $('<div/>', {
                    class: "gif-img-area",
                    'data-value': "unclicked"
                });

                // rating for image
                var ratingDiv = $('<div/>', {
                    class: "gif-rating-area"
                });

                // creates image tag for the still gif and binds the url to src.
                var currentGifImg = $('<img/>', {
                    class: 'gif still-gif',
                    src: currentStillURL,
                });
                imgDiv.append(currentGifImg);

                // creates animated gif and hides until clicked
                var currentAnimatedGif = $('<img>', {
                    class: 'gif animated-gif',
                    src: currentMovingURL,
                    hide: true
                });
                imgDiv.append(currentAnimatedGif);

                // creates the div for the gif rating.
                var currentGifRating = $('<h3>', {
                    class: 'gif-rating',
                    text: "Rating: " + currentRating
                });
                ratingDiv.append(currentGifRating);

                // appends images and ratings to the container
                $(gifContainer).append(imgDiv);
                $(gifContainer).append(ratingDiv);
                // appends the container to the div id
                $('#giphy-imgs').append(gifContainer);
            }
        }
    });
}

//on click image hides the still and displays the animated and updates data value.
function toggleGif() {
    var clickStatus = $(this).attr('data-value');
    if (clickStatus == "unclicked") {
        var gifChildren = $(this).children();
        $(gifChildren[0]).hide();
        $(gifChildren[1]).show();
        $(this).attr('data-value', "clicked");
    }
    else {
        var gifChildren = $(this).children();
        $(gifChildren[1]).hide();
        $(gifChildren[0]).show();
        $(this).attr('data-value', "unclicked");
    }
}

//gets input value and adds to the array and empties the buttons and images and recreates the buttons gets the new gifs
function search() {
    var newTerm = $('#search-input').val();
    if (newTerm != "") {
        sports.push(newTerm);
        $('#giphy-btns').empty();
        $('#giphy-imgs').empty();
        createButtons();
        var url = getGiphyURL(newTerm);
        setUpGifs(url);
    }
    //clears the input
    $('#search-input').val("");
}

