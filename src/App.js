import React from 'react';
import './App.scss';
import { colorArray, rgbaArray, getThreeColors } from './background.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
  let debug = true;

  //This URL is a Quote DB in JSON and its used by the original FCC project
  const quoteURL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quoteList: [],
      quote: 'Get a random quote clicking the button below!',
      author: 'Andrew DaGreen',
      quoteIndexList: [],
      currentIndex: -1,
      backColors: ['rgb(63,94,251)','rgba(63,94,251,1)', 'rgba(252,70,107,1)', 'radial', 'circle'] // base, color1, color2, line or circle, orientation
    }
    this.generateNewQuote= this.generateNewQuote.bind(this);
    this.getPrevQuote = this.getPrevQuote.bind(this);
  };
  //async method to load the quote list into the program and set the state
 getQuotes = async (URL) => {
  try {
    const response = await fetch(URL);
    const parsedResponse = await response.json();
    const { quotes } = parsedResponse;
    this.setState(state =>({
      quoteList: quotes,

    })); 
    
  } catch (exception) {
    console.error('An exception ocurred while fetching the quotes. Try refreshing or check your internet conection', exception);
  }
  }

  componentDidMount() {
    this.getQuotes(quoteURL);
  }

  //This function changes the quote and author
  generateNewQuote = () => { 

    if(debug) console.log("Clicked next quote btn", this.state.currentIndex);
    //If we are not in the last generated quote then we just want to advance
    if(this.state.currentIndex > 0 && this.state.currentIndex !== this.state.quoteIndexList.length -1 ){
      
      let newQuote = {
        text: this.state.quoteList[this.state.currentIndex+1].quote,
        auth: this.state.quoteList[this.state.currentIndex+1].author    
      };          
      this.setState(state =>({
        quote: newQuote.text,
        author: newQuote.auth,
        currentIndex: this.state.currentIndex +1
      }));
      if(debug) console.log("if index is not 0 or the last in the list", this.state.currentIndex);
    } else {
      if(debug) console.log("Index should be 0 or the last", this.state.currentIndex);
      this.changeColors();
    //Gets a random index from the quotelist lenght
    let randomIndex = Math.floor(Math.random()*this.state.quoteList.length); 
    //Created an object to hold the values of the new quote and its author. 
    //I needed to access the info this way because trying to get the quoteList from state in the setState function gave me an error
      var updatedIndexList;
    if(this.state.currentIndex === -1) {updatedIndexList =[randomIndex];}
    else { updatedIndexList = this.state.quoteIndexList.concat(randomIndex);}
    let newQuote = {
          text: this.state.quoteList[randomIndex].quote,
          auth: this.state.quoteList[randomIndex].author    
        };            
    this.setState(state =>({
       //previous quote and author attributes will preserve the current quote before generating a new one in case the user wants to go back
 //   prevQuote: this.state.quote,
//    prevAuth: this.state.author,
      quote: newQuote.text,
      author: newQuote.auth,
      //We keep track of the indexes in case we want to go back or forward
      quoteIndexList: updatedIndexList,
      currentIndex: this.state.currentIndex +1
    }));
  }
  if(debug) console.log("Index after functions ended: ", this.state.currentIndex);
  if(debug) console.log("Index array:  ", this.state.quoteIndexList);
}
  
getPrevQuote = () => {
  if (this.state.currentIndex !== 0) {
    const prevIndex = this.state.currentIndex - 1;
    const newQuote = {
      text: this.state.quoteList[this.state.quoteIndexList[prevIndex]].quote,
      auth: this.state.quoteList[this.state.quoteIndexList[prevIndex]].author    
    };          
    this.changeColors();
    this.setState({
      quote: newQuote.text,
      author: newQuote.auth,
      currentIndex: prevIndex
    });
    if (debug) console.log("prev quote fetched ", prevIndex);
  }
}

changeColors = () => {
  let randomThreeColors = getThreeColors(rgbaArray);
  let newColors = [...randomThreeColors];
  let lineOrCircle = Math.random();

  console.log(newColors);

  if(lineOrCircle > 0.5){ //case if line
    newColors.push('linear');
    let verticalOrHorizontal = Math.random();
    if(verticalOrHorizontal>0.5){ //case vertical
      newColors.push('90deg');
    } else { // case horizontal
      newColors.push('0deg');
    }
  } else { // circle
    newColors.push('radial');
    newColors.push('circle');
  }
  this.setState({
    backColors: newColors
  });
}
  
  render() {
  /*  if(this.state.currentIndex === 0){
      document.getElementById("previous-quote").disabled = true;
    } else {
      document.getElementById("previous-quote").disabled = false;
    }*/
    return (
      <div className="App">
        <header className="App-header" style={{
          background: this.state.backColors[0],
          background: `${this.state.backColors[3]}-gradient(${this.state.backColors[4]}, ${this.state.backColors[1]} 0%, ${this.state.backColors[2]} 100%)`
        }}>
          <div id="quote-box">
            <div id="text-container">
            <FontAwesomeIcon icon={faQuoteLeft} id="quote-simbol"/> 
              <p id="text"> {this.state.quote} </p>
              <cite id="author">
                - {this.state.author}
              </cite> 
            </div>
            <div className="row" id="btn-container">
              <div className="col-xs-4">
               <button className="btn btn-primary" id="previous-quote" onClick={this.getPrevQuote}><FontAwesomeIcon icon={faArrowLeft} /> Last Quote</button>
              </div>
              <div className="col-xs-4">
              <a id="tweet-quote" href={encodeURI(`https://twitter.com/intent/tweet?text= ${this.state.quote} - ${this.state.author}`)} target="_blank"><FontAwesomeIcon icon={faXTwitter} style={{color: this.state.backColors[0]}}/></a>
              </div>
              <div className="col-xs-4">
              <button className="btn btn-primary" id="new-quote" onClick={this.generateNewQuote}>Next Quoute <FontAwesomeIcon icon={faArrowRight} /></button> {/*Button for changing the quote in the state*/}
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
};

export default App;
