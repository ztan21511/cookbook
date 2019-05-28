import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { RecipeCardList } from './App.js';

export class HomePage extends Component {

    render() {
      return (
        <main className="index-page">
          <div className="jumbotron jumbotron-fluid text-white text-center banner-1">
            <div className="container shade-bg">
              <h1 className="display-4">Recipe Impact Book</h1>
              <p className="lead">Reframe your cooking.</p>
              <p className="lead">Know the environmental impact of your meals.</p>
            </div>
          </div>
  
          <div className="container-fluid">
  
            <div className="row">
  
              <div className="col col-sm-12 col-md-4 d-flex triple-box">
                <p role="button" aria-label="button" className="cursor-point"><Link className="nav-link" to="/Favorites">Favorites</Link></p>
              </div>
  
              <div className="col col-sm-6 col-md-4 d-flex triple-box">
                <p role="button" aria-label="button" className="cursor-point"><Link className="nav-link" to="/FindARecipe">Find a Recipe</Link></p>
              </div>
  
              <div className="col col-sm-6 col-md-4 d-flex triple-box">
                <p role="button" aria-label="button" className="cursor-point"><Link className="nav-link" to="/Recent">Recent</Link></p>
              </div>
  
            </div>
  
          </div>
  
          <div className="jumbotron jumbotron-fluid text-black banner-2">
            <div className="container text-center shade-bg">
              <h2>Why is this important?</h2>
              <p>Agriculture and related land use is responsible for as much as 24 to 31 percent of greenhouse gas emissions.</p>
              <p>We are not eating sustainably.</p>
              <p>The problem is that a large population of the world does not recognize this. With a little more transparency in our global agricultural supply chain, we can encourage everyone to eat planet friendly.</p>
            </div>
          </div>
  
          <div className="light-bg">
            <div className="jumbotron jumbotron-fluid banner-3">
              <div className="container text-center">
                <h2 className="display-4">What are you looking for?</h2>
                <p className="lead">Eat local. Eat sustainably. Eat healthy.</p>
                <p className="lead">Browse the newest additions to our catalog!</p>
              </div>
            </div>
            <div className="row">
              <RecipeCardList state={this.props.state} recipeData={this.props.state.latestMeals} 
                firebaseUser={this.props.firebaseUser} numCards={6} />
            </div>
          </div>
        </main >
      );
    }
  }