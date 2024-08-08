import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptLogoImg from './assets/chatgptLogo.svg';
import { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const msgEnd = useRef(null);
  const [input, setInput] = useState('');
  const [aiOutput, setAiOutput] = useState([{ text: 'Hi, I am ChatGPT, a state-of-the-art language model developed by OpenAI. I am designed to understand and generate human-like text based on the input I receive. You can ask me questions, have conversations, seek information, or even request assistance with various tasks. Just let me know how I can help you!', isBot: true }]);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [aiOutput]);

  const sendRequest = async (e) => {
    e.preventDefault();

    // Add user's question to the chatbox
    setAiOutput(prevOutput => [
      ...prevOutput,
      { text: input, isBot: false }
    ]);

    setInput(''); // Clear the input field

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const text = await result.response.text();

      console.log(text);

      // Add AI's response to the chatbox
      setAiOutput(prevOutput => [
        ...prevOutput,
        { text, isBot: true }
      ]);
    } catch (error) {
      console.error("Error sending request to Gemini API:", error);

      setAiOutput(prevOutput => [
        ...prevOutput,
        { text: "Error occurred while fetching response from AI.", isBot: true }
      ]);
    }
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') await sendRequest(e);
  }

  const handleQuery = async (e) => {
    const query = e.target.value;

    setAiOutput(prevOutput => [
      ...prevOutput,
      { text: query, isBot: false }
    ]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(query);
      const text = await result.response.text();

      console.log(text);

      setAiOutput(prevOutput => [
        ...prevOutput,
        { text, isBot: true }
      ]);
    } catch (error) {
      console.error("Error sending request to Gemini API:", error);

      setAiOutput(prevOutput => [
        ...prevOutput,
        { text: "Error occurred while fetching response from AI.", isBot: true }
      ]);
    }
  }

  const renderMessage = (msg) => {
    // Check if the message contains code block (e.g., ```code```)
    if (msg.text.includes('```')) {
      const parts = msg.text.split(/```/);
      return parts.map((part, index) => (
        index % 2 === 1
          ? <pre key={index} className="code-block"><code>{part}</code></pre>
          : <p key={index} className='txt'>{part}</p>
      ));
    }

    return <p className='txt'>{msg.text}</p>;
  }

  return (
    <div className="App">
      <div className='sideBar'>
        <div className='upperSide'>
          <div className='upperSideTop'>
            <img src={gptLogo} alt='Logo' className='logo' />
            <span className='brand'>ChatGPT</span>
          </div>
          <button className='midBtn' onClick={() => { window.location.reload() }}>
            <img src={addBtn} alt='new chat' className='addBtn' />New Chat
          </button>
          <div className='upperSideBottom'>
            <button className='query' onClick={handleQuery} value={'What is Programming?'}><img src={msgIcon} alt='Query' />What is Programming?</button>
            <button className='query' onClick={handleQuery} value={'How to use an API?'}><img src={msgIcon} alt='Query' />How to use an API?</button>
          </div>
        </div>
        <div className='lowerSide'>
          <div className='listItems'><img src={home} alt='' className='listItemsImg' />Home</div>
          <div className='listItems'><img src={saved} alt='' className='listItemsImg' />Saved</div>
          <div className='listItems'><img src={rocket} alt='' className='listItemsImg' />Upgrade To Pro</div>
        </div>
      </div>
      <div className='main'>
        <div className='chats'>
          {aiOutput.map((msg, index) => (
            <div className={`chat ${msg.isBot ? 'bot' : ''}`} key={index}>
              <img className='chatImg' src={msg.isBot ? gptLogoImg : userIcon} alt={msg.isBot ? 'Bot' : 'User'} />
              {renderMessage(msg)}
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className='chatFooter'>
          <div className='inp'>
            <input
              type='text'
              placeholder='Send a message'
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className='send' onClick={sendRequest}>
              <img src={sendBtn} alt='' />
            </button>
          </div>
          <p className='t'>ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT August 24 Version</p>
        </div>
      </div>
    </div>
  );
}

export default App;
