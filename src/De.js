import React, {useEffect,useState} from "react";


export default function De() {
    const [data,setData] = useState([]);
    useEffect(() => {
        getDeutsch(ded => setData(ded));
    }, []);
    // if(document.getElementById("en_content") != null) {
    //     document.getElementById("en_content").style.display="none";
    // }
    return (
        <div className="main-de">
            {data.de && data.de.map((el) => (
                <div dangerouslySetInnerHTML={{__html: el.element}}></div>
            ))}
        </div>
    );
}
function getDeutsch(callback) {
    const query = `query {
        de {
            element
        }
    }
    `;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query: query,})
    }
    return fetch("/graphql", options).then(res => res.json()).then(res => callback(res.data)).catch(err => console.error(err));
}