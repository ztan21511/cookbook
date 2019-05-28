import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/database';

import isFavoriteImg from './img/is-favorite.png';
import notFavoriteImg from './img/not-favorite.png';

export class Product extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            added: false
        }
    }

    // callback to add or remove favorites with click on star img
    addOrRemoveFavorites = () => {
        if (this.props.firebaseUser) {
            if (this.isFav) {
                this.favRef.child(this.state.productPage[0].idMeal).remove();
            } else {
                this.favRef.child(this.state.productPage[0].idMeal).set(this.state.productPage[0]);
            }
            this.favRef.on('value', (snapshot) => {
                this.setState({ favorites: snapshot.val() })
            });
        }
    }

    // GETs meal details and sets state for product and favorites
    componentDidMount() {
        let uri = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + this.props.match.params.id;
        fetch(uri)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({ productPage: data.meals });
            })
            .catch((error) => {
                console.log(error);
            });

        if (this.props.firebaseUser) {
            this.favRef = firebase.database().ref(this.props.firebaseUser.uid).child('favorites');
            this.fireRef = firebase.database().ref(this.props.firebaseUser.uid);
            this.fireRef.on('value', (snapshot) => {
                let favs = snapshot.child('favorites');
                this.setState({ favorites: favs.val() });
            });
        }
    }

    // cleans up promises
    componentWillUnmount() {
        // LEAVING THESE COMMENTED OUT WILL = PERFECT APP, UNCOMMENTING WILL BREAK 
        // IF U ARE SIGNED OUT -> GO TO A PRODUCT PAGE -> LOG IN -> GO TO INGREDIENTS LIST
            // this.fireRef.off('value');
            // this.favRef.off('value');
    }

    render() {
        // initialize variables to insert because on first render, the productPage info may be null
        this.isFav = false;
        let title = [];
        let ingredients = [];
        let instructions = [];
        let image = [];
        let ingredientsList = [];
        let favoriteImg = notFavoriteImg;
        if (this.state.productPage) {
            instructions.push(this.state.productPage[0]['strInstructions']);
            title.push(this.state.productPage[0]['strMeal']);
            image.push(this.state.productPage[0]['strMealThumb']);


            if (this.state.favorites) { // .length !== 0
                let favObj = Object.keys(this.state.favorites);
                for (let i = 0; i < favObj.length; i++) {
                    if (favObj[i] === this.state.productPage[0].idMeal) {
                        favoriteImg = isFavoriteImg;
                        this.isFav = true;
                        break;
                    }
                }
            }

            for (let i = 1; i < 21; i++) {
                let currIngredient = this.state.productPage[0]['strIngredient' + i];
                let currMeasure = this.state.productPage[0]['strMeasure' + i];
                if (currIngredient !== "" && currIngredient !== "null") {
                    ingredients.push(
                        <li key={currIngredient + currMeasure}>{currMeasure + " " + currIngredient}</li>
                    );
                    ingredientsList.push(currMeasure + " " + currIngredient);
                } else {
                    break;
                }
            }
        }

        let addList = () => {
            if (this.props.firebaseUser) {
                let fireRef = firebase.database().ref(this.props.firebaseUser.uid).child('ingredientsList');
                ingredientsList.forEach((ingredient) => {
                    fireRef.push(ingredient);
                });
                this.setState({ added: true });
            }
        }

        let addedButton = () => {
            if (this.props.firebaseUser) {
                if (this.state.added) {
                    return <Button onClick={addList} className="border rounded mb-2">Added!</Button>
                }
                else {
                    return <Button onClick={addList} className="border rounded mb-2">Add to Ingredients List</Button>
                }
            } else {
                return <p className="text-light bg-dark text-center mb-2">Log in to add these to your own list!</p>
            }
        }

        return (
            <main className="product-page">
                <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
                    <div className="container shade-bg">
                        <h1 className="display-4">{title}</h1>
                    </div>
                </div>

                <div className="light-bg">
                    <div className="container">
                        <div className="row py-2">
                            <div className="col col-sm-2 col-md-2">
                                <Link className="nav-link" to="/FindARecipe">
                                    <Button role="button" className="btn btn-primary">back to search!</Button>
                                </Link>
                            </div>
                            <div className="col col-md-auto" id="favoriteStatus">
                                <img src={favoriteImg} alt="favorite icon" aria-label="button" role="button" onClick={this.addOrRemoveFavorites} />
                            </div>
                        </div>
                        <div className="row py-2">
                            <div className="col col-sm-12 col-md-4">
                                <img src={image} alt="recipe thumbnail" className="card-images" />
                            </div>
                            <div className="col col-sm-6 col-md-4 shade-bg">
                                <h2>Ingredients</h2>
                                {addedButton()}
                                <ul>
                                    {ingredients}
                                </ul>
                            </div>
                            <div className="col col-sm-6 col-md-4 shade-bg">
                                <h2>Instructions</h2>
                                <p>{instructions}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}