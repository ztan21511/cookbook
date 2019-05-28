import React, { Component } from 'react';
import './App.css';
import { RecipeCardList } from './App.js';
import firebase from 'firebase/app';

export class Favorites extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: []
        }
    }

    // Sets favorites state
    componentDidMount() {
        if (this.props.firebaseUser) {
            this.favRef = firebase.database().ref(this.props.firebaseUser.uid).child('favorites');
            this.favRef.on('value', (snapshot) => {
                this.setState({ favorites: snapshot.val() });
            });
        }
    }

    // cleans up promises
    componentWillUnmount() {
        if (this.props.firebaseUser) {
            this.favRef.off('value');
        }
    }

    render() {
        let favArray = [];
        if (this.state.favorites) {
            let favKeys = Object.keys(this.state.favorites);
            favArray = favKeys.map((key) => {
                return this.state.favorites[key];
            });
        }

        let result = [];
        if (this.props.firebaseUser) {
            result = (
                <RecipeCardList recipeData={favArray} firebaseUser={this.props.firebaseUser} numCards={25} />
            );
        } else {
            result = (
                <div className="mx-auto col col-sm-6 col-md-4 d-flex">
                <div className="shade-bg">
                    <p>Log in to view favorites!</p>
                </div>
            </div>
            );
        }
        return (
            <main className="favorites-page">
                <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
                    <div className="container shade-bg">
                        <h1 className="display-4">Favorites</h1>
                    </div>
                </div>

                <div className="light-bg">
                    <div className="container">
                        <div className="row favorites-results">
                            {result}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
