'use strict';

let state = {
    userInfo : {
        userStatus:true,
        userName:'Guest',
        userEmail:'guest@gmail.com',
        userPassword:'apassword',

        favorites : [],
        recent : []
    },
    searchInfo : {
        searchBoxText : '',
        filterState : [] //{category : "", checked : boolean}
    }
};

// API url for searching recipes by name
const API_RECIPE_NAME = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Initializes page with interactivity
$('.index-page').css('display','block');
$('.find-a-recipe').css('display','none');
$('.product-page').css('display','none');
$('.recents-page').css('display','none');
$('.favorites-page').css('display','none');

$('.navbar img:nth-child(1)').click(renderHomePage);
$('.index-page .triple-box:nth-child(1) p').click(renderFavoritesPage);
$('.index-page .triple-box:nth-child(2) p').click(renderFindARecipePage);
$('.index-page .triple-box:nth-child(3) p').click(renderRecentsPage);
$('.product-page button').click(renderFindARecipePage);

$('#favoriteStatus img').click(addOrRemoveFavorites);
$('form button').click(function(event) {
    event.preventDefault();
    fetchRecipeData($('form input').val());
});

renderLatestList();
initFilterList();


// Adds functionality to add and remove recipe to favorites
function addOrRemoveFavorites() {
    let url = API_RECIPE_NAME + $('.product-page h1').text();
    fetch(url) 
    .then(function(response) {
        return response.json();
    })
    .then(function(recipe) {
        let recipeName = recipe.meals[0];
        if ($('#favoriteStatus img').attr('src') !== 'img/is-favorite.png') {
            $('#favoriteStatus img').attr('src','img/is-favorite.png');
            state.userInfo.favorites.push(recipeName);
        } else {
            $('#favoriteStatus img').attr('src','img/not-favorite.png');
            for (let i = 0; i < state.userInfo.favorites.length; i++) {
                if (state.userInfo.favorites[i].strMeal === recipeName.strMeal) {
                    state.userInfo.favorites.splice(i,1);
                }
            }
        }
    })
    .catch(function(error) {
        renderError(error);
    });
}

// Renders the latest recipes
function renderLatestList() {
    let uri = "https://www.themealdb.com/api/json/v1/1/latest.php";
    fetch(uri)
    .then(function(response) {
        return response.json();
    })
    .then(function(latestRecipes) {
        for (let i = 0; i < 6; i++) {
            renderLatestCardItem(latestRecipes.meals[i], i + 1);
        }
    })
    .catch(function(error) {
        renderError(error);
    });
}

// Renders a card item for latest recipes
function renderLatestCardItem(recipe, recipeNum) {
    let target = '.latest-meals .row .col:nth-child(' + recipeNum + ') .card';
    $(target).click(function() {
        state.userInfo.recent.push(recipe);
        renderProductPage(recipe);
    });
    $(target).addClass('cursor-point');
    $((target + ' img')).attr({'src':recipe.strMealThumb, 'alt':'meal card image'});
    $((target + ' div p')).text(recipe.strMeal);
}


// initializes the filters from API and then renders them to the page
function initFilterList() {
    let uri = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(uri)
       .then(function(response) {
            return response.json();
       })
       .then(function(categoryData) {
            for (let i = 0; i < categoryData.categories.length; i++) {
                    let newFilter = {};
                    newFilter.category = categoryData.categories[i].strCategory;
                    newFilter.checked = true;
                    state.searchInfo.filterState.push(newFilter);
            }
            return '';
       }).then(function() {
            renderFilterList();
       })
       .catch(function(error) {
           renderError(error);
       });
}

// Renders the filter list
function renderFilterList() {
    let table = $('.find-a-recipe table');
    table.empty();
    table.append('<tr><th>Filter</th><th>Select</th></tr>');
    $('tr').addClass('header');
    for (let i = 0; i < state.searchInfo.filterState.length; i++) {
        renderFilterItem(state.searchInfo.filterState[i]);
    }
}

// Takes a filter item and renders it to the filter list
function renderFilterItem(filter) {
    let newRow = $('table').append('<tr>');
    newRow = $('table tr:last-child');
    newRow.append('<td>' + filter.category + '</td>');
    newRow.append('<td>');
    $('tr:last-child td:last-child').append('<input>');
    let currInput = $('tr:last-child td:last-child input:last-child')
        .attr({'type':'checkbox', 'aria-label':'checkbox'});

    if (filter.checked) {
        currInput.attr({'checked' : filter.checked});
    }
    currInput.click(function() {
        filter.checked = !filter.checked;
        renderFilterList();
    });
}

// Renders search results to the page
function renderSearchResults(data) {
    // API doesn't enable pagination so cutting results at 25 max
    $('.search-results').html('');
    for (let i = 1; i < 25; i++) {
        renderCardItem(data[i], '.search-results');
    }
}

// Renders a card item to a target location
function renderCardItem(recipe, target) {
    let cardImg = $('<img class="card-img-top card-images">').attr({'src':recipe.strMealThumb, 'alt':'meal card image'});
    let cardTitle = $('<p class="card-title">').append(recipe.strMeal);
    let cardImpact = $('<div class="card-footer">').append('medium climate impact');
    cardImpact.addClass('bg-warning');
    let card = '<div class="col col-sm-12 col-md-4 my-2 d-flex"><div class="card"></div></div>';
    $(target).append(card);
    $((target + ' .card:last()')).append(cardImg);
    $((target + ' .card:last()')).append(cardTitle);
    $((target + ' .card:last()')).append(cardImpact);

    $((target + ' .card:last()')).click(function() {
        let isInRecent = false;
        for (let i = 0; i < state.userInfo.recent.length; i++) {
            if (state.userInfo.recent[i].strMeal === recipe.strMeal) {
                isInRecent = true;
            }
        }
        if (!isInRecent) {
            state.userInfo.recent.push(recipe);
        }
        renderProductPage(recipe);
    });
}

// GETs recipe data from API
function fetchRecipeData(searchTerm) {
    fetch((API_RECIPE_NAME + searchTerm))
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            renderSearchResults(data.meals);
        })
        .catch(function(error) {
            //$('.find-a-recipe .search-results')
            //    .html('<div class="alert alert-danger" role="alert">No recipes found, try again!</div>');
            renderError(error);
        });
}

// Renders the home page, and hides other pages
function renderHomePage() {
    $('.index-page').css('display','block');
    $('.find-a-recipe').css('display','none');
    $('.product-page').css('display','none');
    $('.recents-page').css('display','none');
    $('.favorites-page').css('display','none');
}

// Renders the Favorites page, and hides other pages
function renderFavoritesPage() {
    $('.index-page').css('display','none');
    $('.find-a-recipe').css('display','none');
    $('.product-page').css('display','none');
    $('.recents-page').css('display','none');
    $('.favorites-page').css('display','block');
    $('.favorites-page .favorites-results').html('');

    state.userInfo.favorites.forEach(function(recipe) {
        renderCardItem(recipe, '.favorites-results');
    });
}

// Renders the Recents page, and hides other pages
function renderRecentsPage() {
    $('.index-page').css('display','none');
    $('.find-a-recipe').css('display','none');
    $('.product-page').css('display','none');
    $('.favorites-page').css('display','none');
    $('.recents-page').css('display','block');
    $('.recents-page .recents-results').html('');

    state.userInfo.recent.forEach(function(recipe) {
        renderCardItem(recipe, '.recents-results');
    });
}

// Renders find a recipe page
function renderFindARecipePage() {
    $('.index-page').css('display','none');
    $('.find-a-recipe').css('display','block');
    $('.product-page').css('display','none');
    $('.recents-page').css('display','none');
    $('.favorites-page').css('display','none');

    $('.search-results').html('');
    renderFilterList();
}

// Renders a product page with the target recipe passed in
function renderProductPage(recipeName) {
    $('.index-page').css('display','none');
    $('.find-a-recipe').css('display','none');
    $('.product-page').css('display','block');
    $('.recents-page').css('display','none');
    $('.favorites-page').css('display','none');

    $('.product-page h1').text(recipeName.strMeal);
    $('.product-page .row:nth-child(2) img').attr({'src':recipeName.strMealThumb});
    
    let favoritesIcon = {'src':'img/not-favorite.png'};
    for (let i = 0; i < state.userInfo.favorites.length; i++) {
        if (state.userInfo.favorites[i].strMeal === recipeName.strMeal) {
            favoritesIcon = {'src':'img/is-favorite.png'};
            break;
        }
    }
    $('.product-page .row:nth-child(1) img').attr(favoritesIcon);

    // API numbers ingredients & amounts 1,2,3,...,20
    for (let i = 1; i < 21; i++) {
        let currIngredient = recipeName['strIngredient' + i];
        let currMeasure = recipeName[('strMeasure' + i)];
        if (currIngredient !== "" && currIngredient !== "null") {
            $('.product-page ul').append("<li>");
            $('.product-page ul li:last-child').text(currMeasure + " " + currIngredient);
        } else {
            break;
        }
    }
    $('.product-page .row:nth-child(2) p').text(recipeName.strInstructions);
}


// Render an error message on the page
function renderError(error) {
    let alert = '<p class="alert alert-danger>' + error.message + '</p>';
    $('.row').after(alert);
}

/*
NOT FOR STAGE-2

-------------------------

function applyFilter(recipe) {
    state.searchInfo.filterState.forEach(function(filterItem) {
        if (filterItem.category === recipe.strCategory) {
            return filterItem.checked;
        }
    });
}

function filterSearch(data) {
    data = data.filter(applyFilter);

    fetch('../data/climateImpact.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(data2) {
        let data2 = data2.forEach(function(recipe) {
            let highImpact = false;
            let mediumImpact = false;
            for (let i = 1; i < 21; i++) {
                let currIngredient = recipeData['meals'][0]['strIngredient' + i];
                if (climateData.highImpact.includes(currIngredient)) {
                    highImpact = true;
                }
                if (climateData.mediumImpact.includes(currIngredient)) {
                    mediumImpact = true;
                }
            }
            
            if (highImpact) {
                recipe.push('climateImpact','high climate impact');
            } else if (mediumImpact) {
                recipe.push('climateImpact','medium climate impact');
            } else {
                recipe.push('climateImpact','low climate impact');
            }
        });
        return data2;
    })
    .catch(function(error) {
        renderError(error);
    });
}
*/