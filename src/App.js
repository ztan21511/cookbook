import React, { Component } from 'react';
import './App.css';
import { FindARecipe } from './FindARecipe.js';
import { HomePage } from './HomePage';
import { Product } from './Product';
import { Favorites } from './Favorites';
import { Recents } from './Recents';
import { IngredientsList } from './IngredientsList';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import _ from 'lodash';

import { Button, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faList } from '@fortawesome/free-solid-svg-icons';
library.add(faUser);
library.add(faList);

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latestMeals: [],
      firebaseUser: {},
    };
  }

  // GETs latest reciepts and sets firebase user state
  componentDidMount() {
    let uri = "https://www.themealdb.com/api/json/v1/1/latest.php";
    fetch(uri)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ latestMeals: data.meals });
      })
      .catch((error) => {
        console.log(error);
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ firebaseUser: user });
      } else {
        this.setState({ firebaseUser: null });
      }
    });
  }

  addList = (newin) => {
    let oldingre = this.state.ingredients;
    let newingre = oldingre.concat(newin);
    this.setState({ ingredients: newingre })
  }

  render() {
    return (
      <Router>
        <>
          <Route path="/" render={(props) => (
            <Header {...props} />
          )} />

          <Route exact path="/" render={(props) => (
            <HomePage {...props} firebaseUser={this.state.firebaseUser} state={this.state} />
          )} />
          <Route path="/Product/:id" render={(props) => (
            <Product {...props} state={this.state}
              addList={this.addList} firebaseUser={this.state.firebaseUser} />
          )} />
          <Route path="/Favorites" render={(props) => (
            <Favorites {...props} firebaseUser={this.state.firebaseUser} />
          )} />
          <Route path="/Recent" render={(props) => (
            <Recents {...props} firebaseUser={this.state.firebaseUser} state={this.state} />
          )} />
          <Route path="/FindARecipe" render={(props) => (
            <FindARecipe {...props} state={this.state} firebaseUser={this.state.firebaseUser} />
          )} />
          <Route path="/IngredientsList" render={(props) => (
            <IngredientsList {...props} state={this.state} firebaseUser={this.state.firebaseUser}/>
          )} />
          <Route path="/" component={Footer} />
        </>
      </Router>
    );
  }
}

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      errorMessage: null
    };
  }

  // this and following handle login/out and sign up
  componentDidMount() {
    this.authUnRegFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { //if exists, then we logged in
        this.setState({ user: firebaseUser });
      } else {
        this.setState({ user: null });
      }
    });
  }

  //A callback function for registering new users
  handleSignUp = () => {
    this.setState({ errorMessage: null }); //clear any old errors

    /* sign up user */
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        let user = userCredentials.user; //access the newly created user
        user.updateProfile({
          displayName: this.state.username
        })
        return user;
      })
      .catch((error) => { //report any errors
        this.setState({ errorMessage: error.message });
      });
  }

  //A callback function for logging in existing users
  handleSignIn = () => {
    this.setState({ errorMessage: null }); //clear any old errors

    /* sign in user */
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(err => this.setState({ errorMessage: err }));
  }

  //A callback function for logging out the current user
  handleSignOut = () => {
    this.setState({ errorMessage: null }); //clear any old errors
    this.setState({ username: null, email: null, password: null }); //clear user info

    /* sign out user */
    firebase.auth().signOut()
      .catch(err => this.setState({ errorMessage: err }));
  }

  //toggles the dropdown
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }



  render() {
    let currErr = [];
    if (this.state.errorMessage) {
      currErr = <p className="alert alert-danger">{this.state.errorMessage.message}</p>;
    }

    let currUser = [];
    if (this.state.user !== null) {
      currUser = this.state.username;
    }

    return (
      <header>
        <div className="container-fluid">
          <div className="navbar">
            <Link className="nav-link" to="/">
              <img src="img/chef-hat.png" alt="chef hat icon" className="header-img cursor-point" />
            </Link>
            <div>
              <Link className="nav-link d-inline-block align-top" to="/IngredientsList">
                <FontAwesomeIcon icon="list" size="2x" className="" />
              </Link>
              <span className="lead">
                {currUser}
              </span>
              {/* shows sign in box if use is not signed in. shows log out if signed in */}
              {this.state.user !== null ?
                <Button className="btn btn-primary ml-4" onClick={this.handleSignOut}>Sign Out</Button>
                :
                <Dropdown className="login-box mt-2 d-inline-block" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle className="rounded mx-3" caret>
                    Log In
                  </DropdownToggle>
                  <DropdownMenu right>
                    {currErr}
                    <form>
                      <div className="username">
                        <label>Username: </label>
                        <input onChange={(event) => this.setState({ username: event.target.value })} />
                      </div>
                      <div className="email">
                        <label>Email: </label>
                        <input onChange={(event) => this.setState({ email: event.target.value })} />
                      </div>
                      <div className="password">
                        <label>Password: </label>
                        <input onChange={(event) => this.setState({ password: event.target.value })} type="password" name="password" />
                      </div>
                      <Button color="primary" onClick={this.handleSignIn} className="sign-in">Sign In</Button>
                      <Button color="secondary" onClick={this.handleSignUp} className="sign-up">Sign up</Button>
                    </form>
                  </DropdownMenu>
                </Dropdown>
              }
            </div>
          </div>
        </div>
      </header>
    );

  }
}

export class Footer extends Component {

  render() {
    return (
      <footer className="container-fluid text-black pt-2 border-top">
        <div className="row">
          <div className="col col-md-4 text-center">
            <cite><p>Images obtained gratefully from <a href="https://unsplash.com">Unisplash</a></p></cite>
          </div>
        </div>
      </footer>
    );
  }
}

// Renders a Recipe Card. Accepts recipeDetails as prop
export class RecipeCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mediumImpact: [],
      highImpact: [],
    }
  }

  // Callback to add product to recents if clicked
  onProductClick = () => {
    if (this.props.firebaseUser) {
      firebase.database().ref(this.props.firebaseUser.uid).child('recents')
        .child(this.props.recipeDetails.idMeal).set(this.props.recipeDetails);
    }
  }

  // gets climate data and sets state
  componentDidMount() {
    this.climateRef = firebase.database().ref('climateImpact');
    this.climateRef.on('value', (snapshot) => {
      let medium = snapshot.child('mediumImpact');
      let high = snapshot.child('highImpact');
      this.setState({ mediumImpact: medium.val(), highImpact: high.val() });
    });
  }

  // cleans up promises
  componentWillUnmount() {
    this.climateRef.off('value');
  }

  render() {
    let rating = (
      <div className="card-footer bg-success">
        Low climate impact
      </div>
    );
    if (this.props.recipeDetails) {
      for (let i = 1; i < 21; i++) {
        let currIngredient = this.props.recipeDetails['strIngredient' + i];
        let isMedium = _.find(this.state.mediumImpact, (ing) => {
          return currIngredient === ing;
        });
        let isHigh = _.find(this.state.highImpact, (ing) => {
          return currIngredient === ing;
        });
        if (typeof isHigh !== 'undefined') {
          rating = (
            <div className="card-footer bg-danger">
              High climate impact
          </div>
          );
        } else if (typeof isMedium !== 'undefined') {
          rating = (
            <div className="card-footer bg-warning">
              Medium climate impact
          </div>
          );
        }
      }
    }

    return (
      <div onClick={this.onProductClick} className="col col-sm-6 col-md-4 d-flex">
        <Link className="nav-link" to={"/Product/" + this.props.recipeDetails.idMeal}>
          <div className="card my-3">
            <img className="card-img-top card-images" src={this.props.recipeDetails.strMealThumb} alt={"card for " + this.props.recipeDetails.strMeal + " recipe"} />
            <div className="card-body">
              <p className="card-title">{this.props.recipeDetails.strMeal}</p>
            </div>
            {rating}
          </div>
        </Link>
      </div>
    );
  }
}

export class RecipeCardList extends Component {

  render() {
    let recipeCards = [];
    if (this.props.recipeData !== null) {
      let index = 0;
      while (index < this.props.recipeData.length && this.props.numCards > index) {
        recipeCards.push(<RecipeCard recipeDetails={this.props.recipeData[index]}
          firebaseUser={this.props.firebaseUser} key={this.props.recipeData[index].strMeal} />);
        index++;
      }
      return recipeCards;
    } else {
      return (
        <div className="col col-sm-6 col-md-4 d-flex">
          <div className="jumbotron">
            <p>No recipes found!</p>
          </div>
        </div>
      )
    }
  }
}