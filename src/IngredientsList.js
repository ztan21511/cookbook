import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase/app';

export class IngredientsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredientsList: [],
            item: 0
        }
    }

    componentDidMount() {
        if (this.props.firebaseUser) {
            this.ingredientsList = firebase.database().ref(this.props.firebaseUser.uid).child('ingredientsList');
            this.fireRef = firebase.database().ref(this.props.firebaseUser.uid);
            this.fireRef.on('value', (snapshot) => {
                let ingredientsList = snapshot.child('ingredientsList');
                this.setState({ ingredientsList: ingredientsList.val() }, () => {
                    if (this.state.ingredientsList) {
                        let ingredientsKey = Object.keys(this.state.ingredientsList);
                        let ingredientsList = ingredientsKey.map((key) => {
                            let ingredient = this.state.ingredientsList[key];
                            return ingredient;
                        })
                        this.setState({ ingredientsList: ingredientsList })
                    }
                });
            });
        }
    }

    componentWillUnmount() {
        if (this.props.firebaseUser){
            this.ingredientsList.off('value');
            this.fireRef.off('value');
        }
    }

    removeItem = (item) => {
        this.fireRef.on('value', (snapshot) => {
            let ingredientsList = snapshot.child('ingredientsList');
            let list = ingredientsList.val();
            let objects = Object.keys(list);
            for (let i = 0; i < objects.length; i++) {
                if (item.target.textContent === list[objects[i]]) {
                    this.ingredientsList.child(objects[i]).remove()
                }
            }

        });
    }

    render() {
        let ingreArray = this.state.ingredientsList;
        let renderArray = [];
        // add key and on click remove that key
        if (ingreArray != null) {
            for (let i = 0; i < ingreArray.length; i++) {
                renderArray.push(<li onClick={this.removeItem} className="list-style" key={i}>{ingreArray[i]}</li>)
            }
        }
        if (this.props.firebaseUser) {
            return (
                <main className="find-a-recipe" >
                    <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
                        <div className="container shade-bg">
                            <h1 className="display-4">Ingredients List</h1>
                            <p>Got your item? Remove item by clicking on it</p>
                        </div>
                    </div>

                    <div className="light-bg">
                        <div className="container">
                            <div className="text-center shade-bg div-style">
                                {renderArray}
                            </div>
                        </div>
                    </div>
                </main >
            )
        } else {
            return (
                <main className="find-a-recipe" >
                    <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
                        <div className="container shade-bg">
                            <h1 className="display-4">Ingredients List</h1>
                        </div>
                    </div>
                    <div className="light-bg">
                        <div className="container">
                            <div className="mx-auto col col-sm-6 col-md-4 d-flex">
                                <div className="shade-bg">
                                    <p>Log in to add ingredients to this list!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            )
        }
    }
}