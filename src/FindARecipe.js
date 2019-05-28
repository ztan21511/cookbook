import React, { Component } from 'react';
import './App.css';
import { RecipeCardList } from './App.js';
import { Button } from 'reactstrap';

export class FindARecipe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            currentSearch: ""
        }
    }

    inputState = (text) => {
        this.setState({ currentSearch: text.target.value });
    }

    // fetch when search is pressed
    onSearchClick = (event) => {
        event.preventDefault();
        let uri = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + this.state.currentSearch;
        fetch(uri)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({ searchResults: data.meals }); // array of recipe setails objects
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <main className="find-a-recipe">
                <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
                    <div className="container shade-bg">
                        <h1 className="display-4">Find a Recipe</h1>
                    </div>
                </div>

                <div className="light-bg">
                    <div className="container">
                        <div className="row">

                            <div className="col">
                                <div className="row text-left m-3">
                                    <form method="GET" action="https://www.themealdb.com/api/json/v1/1/search.php?s=">
                                        <input onChange={this.inputState} type="text" placeholder="Search.." name="search" />
                                        <Button type="submit" className="fa fa-search primary" onClick={this.onSearchClick}>search!</Button>
                                    </form>
                                </div>
                                <div className="row search-results">
                                    <RecipeCardList recipeData={this.state.searchResults}
                                        firebaseUser={this.props.firebaseUser} numCards={25} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}