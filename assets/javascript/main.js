var apiKey = "3b2SrvZDQP8Itasl5nakpnUrsCvMCChn";
 
var sports = ["Football", "Baseball", "Basketball", "Rugby", "Bowling",
    "Golf", "Curling", "Tennis", "Lacrosse", "Hockey"];
 
var limit = "10";
 
$(document).ready(function () {
    createButtons();
    $('#giphy-imgs').on('click', '.gif-img-area', toggleGif);
    $('#search-btn').on('click', search);
});
 
function getGiphyURL(searchTerm) {
    return 'https://api.giphy.com/v1/gifs/search?q=' + searchTerm + "&limit=" + limit + '&api_key=' + apiKey;
}
 
function createButtons() {
    for (var i = 0; i < sports.length; i++) {
 
        $("#giphy-btns").append($('<button/>', {
            text: sports[i],
            id: sports[i],
            class: 'btn btn-primary',
            click: function () {
                $('#giphy-imgs').empty();
                var term = $(this).attr('id');
                var queryURL = getGiphyURL(term);
                setUpGifs(queryURL);
            }
        })
        );
    }
}
 
function setUpGifs(queryURL) {
    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var currentStillURL = response.data[i].images.fixed_height_still.url;
                var currentMovingURL = response.data[i].images.fixed_height.url;
                var currentRating = response.data[i].rating;
 
                if (currentRating == "") {
                    currentRating = "none";
                }
                var gifContainer = $('<div/>', {
                    class: "gif-container col-sm-4"
                });

                var imgDiv = $('<div/>', {
                    class: "gif-img-area",
                    'data-value': "unclicked"
                });
 
                var ratingDiv = $('<div/>', {
                    class: "gif-rating-area"
                });
 
                var currentGifImg = $('<img/>', {
                    class: 'gif still-gif',
                    src: currentStillURL,
                });
                imgDiv.append(currentGifImg);
 
                var currentAnimatedGif = $('<img>', {
                    class: 'gif animated-gif',
                    src: currentMovingURL,
                    hide: true
                });
                imgDiv.append(currentAnimatedGif);
 
                var currentGifRating = $('<h3>', {
                    class: 'gif-rating',
                    text: "Rating: " + currentRating
                });
                ratingDiv.append(currentGifRating);
                
                $(gifContainer).append(imgDiv);
                $(gifContainer).append(ratingDiv);
                $('#giphy-imgs').append(gifContainer);
            }
        }
    });
}
 
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
    $('#search-input').val("");
}

