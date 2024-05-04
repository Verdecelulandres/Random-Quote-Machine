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
      author: ""
    }
    this.generateNewQuote= this.generateNewQuote.bind(this);
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
      quote: newQuote.text,
      author: newQuote.auth
    }));
  } 
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {this.state.quote}
          </p>
          <cite>
            - {this.state.author}
          </cite>
          <button onClick={this.generateNewQuote}>Next Quoute</button> {/*Button for changing the quoute in the state*/}
        </header>
      </div>
    );
  }
};

export default App;
