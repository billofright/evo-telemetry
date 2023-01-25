import './App.css';
import io from "socket.io-client";
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import { useEffect, useState } from 'react';

const socket = io.connect('http://localhost:3001');

function App() {
  const [message, setMessage] = useState([]);
  useEffect(() => {
    socket.on("data", (data) => {
      setMessage(currentData => [...currentData, data]);
    });
  }, [socket]);


  return (
    <div className="App">
      <h1>Current temperature</h1>
      <LineChart width={500} height={300} data={message}>
        <XAxis type='number' dataKey='time' allowDecimals='false' domain={['dataMax - 10', 'auto']}/>
        <YAxis/>
        <Line type='monotone' dataKey='value' stroke="#8884d8"/>
      </LineChart>
    </div>
  );
}

export default App;
