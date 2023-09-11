import React, { useEffect, useState } from 'react'
import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getLanguage(gql_d => setData(gql_d));
  }, []);
  console.log(data);
  return (
    <div className="App">
      {/* nav here */}
      <div>
        {data.books && data.books.map((el) => (
            <p>{el.title}</p>
        ))}
        {data.ru && data.ru.map((el) => (
          <p>
            {el.text}
          </p>
        ))}
      </div>
      <p>hellow rold</p>
      <p>hello world!!!!</p>
      <h1>random text here to daty</h1>
      <Link to='/random'>ranodm</Link><br />
      <Link to="/test">test</Link>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}

function getLanguage(htmlF) {
  const query = `query {
    books {
      id
      title
    }
    ru {
      text
    }
  }`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/JSON',
    },
    body: JSON.stringify({
      query: query,
    })
  };
  return fetch("/graphql", options).then(res => res.json()).then(res => htmlF(res.data)).catch(console.error);
}

export default App;
