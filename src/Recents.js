import React, { Component } from 'react';
import './App.css';
import { RecipeCardList } from './App.js';
import firebase from 'firebase/app';

export class Recents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recents: []
        }
    }

    // Sets recents in state
    componentDidMount() {
        if (this.props.firebaseUser) {
            this.recentRef = firebase.database().ref(this.props.firebaseUser.uid).child('recents');
            this.recentRef.on('value', (snapshot) => {
                this.setState({ recents: snapshot.val() });
            });
        }
    }

    // cleans up promises
    componentWillUnmount() {
        if (this.props.firebaseUser) {
            this.recentRef.off('value');
        }
    }

    render() {
        let recentArray = [];
        if (this.state.recents) {
            let recentKeys = Object.keys(this.state.recents);
            recentArray = recentKeys.map((key) => {
                return this.state.recents[key];
            });
        }

        let result = [];
        if (this.props.firebaseUser) {
            result = (
                <RecipeCardList recipeData={recentArray} firebaseUser={this.props.firebaseUser} numCards={25} />
            );
        } else {
            result = (
                <div className="mx-auto col col-sm-6 col-md-4 d-flex">
                    <div className="shade-bg">
                        <p>Log in to view recents!</p>
                    </div>
                </div>
            );
        }

        return (
            <main className="recents-page">
                <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
                    <div className="container shade-bg">
                        <h1 className="display-4">Recents</h1>
                    </div>
                </div>

                <div className="light-bg">
                    <div className="container">
                        <div className="row recents-results">
                            {result}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}