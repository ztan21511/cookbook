import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'whatwg-fetch';
import firebase from 'firebase/app';
import 'firebase/auth'; 

var config = {
    apiKey: "AIzaSyALcK8ab0g31hIuWsHrDQdeWLmQF_iIjzQ",
    authDomain: "recipe-impact-book.firebaseapp.com",
    databaseURL: "https://recipe-impact-book.firebaseio.com",
    projectId: "recipe-impact-book",
    storageBucket: "recipe-impact-book.appspot.com",
    messagingSenderId: "759268219582"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
