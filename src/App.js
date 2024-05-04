import React from 'react';
import './App.scss';


  //This URL is a Quote DB in JSON and its used by the original FCC project
  const quoteURL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quoteList: [],
      quote: "",
      author: "",
      prevQuote: "",
      prevAuth: "",
      quoteIndexList: []
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
      quote: 'Get a random quote clicking the button below!',
      author: 'Andrew DaGreen'
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
    //Gets a random index from the quotelist lenght
    let randomIndex = Math.floor(Math.random()*this.state.quoteList.length); 
    //Created an object to hold the values of the new quote and its author. 
    //I needed to access the info this way because trying to get the quoteList from state in the setState function gave me an error
    let newQuote = {
          text: this.state.quoteList[randomIndex].quote,
          auth: this.state.quoteList[randomIndex].author    
        };            
    this.setState(state =>({
      //We keep track of the indexes in case we want to go back or forward
      quoteIndexList: [...this.state.quoteIndexList, randomIndex],
       //previous quote and author attributes will preserve the current quote before generating a new one in case the user wants to go back
      prevQuote: this.state.quote,
      prevAuth: this.state.author,
      quote: newQuote.text,
      author: newQuote.auth
    }));
  }
  
  getPrevQuote = () => {

  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="quote-box">
            <div id="text-container">
              <p id="text">
                {this.state.quote}
              </p>
              <cite id="author">
                - {this.state.author}
              </cite> 
            </div>
            <div className="row" id="btn-container">
              <div className="col-xs-4">
               <button className="btn btn-default" id="previous-quote" onClick={this.getPrevQuote}>Last Quote</button>
              </div>
              <div className="col-xs-4">
              <a id="tweet-quote" href={encodeURI(`https://twitter.com/intent/tweet?text= ${this.state.quote} - ${this.state.author}`)} target="_blank">Tweet it!</a>
              </div>
              <div className="col-xs-4">
              <button className="btn btn-default" id="new-quote" onClick={this.generateNewQuote}>Next Quoute</button> {/*Button for changing the quoute in the state*/}
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
};

export default App;
