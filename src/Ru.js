import React, { useEffect, useState } from "react";
import "./Card.css";
import Img1 from "./img_data/img1.png";
import Vlad from "./img_data/vlad_tym.png";
import Farber from "./img_data/farber.png";
import { Link } from 'react-router-dom';



export default function Ru(props) {
    const [data, setData] = useState([]);
    useEffect(() => {
        getRussian(gql_d => setData(gql_d));
        // return function cleanup() {
        //     setTimeout(() => {
        //         const card_2 = document.getElementById("card_2");
        //         const card_3 = document.getElementById("card_3");
                
        //         if(card_2 != null && card_3 != null) {
        //             if(!document.getElementById("v_i") && !document.getElementById("f_i")) {
        //                 card_2.insertAdjacentHTML("afterbegin", `<img src="${Vlad}" id="v_i" />`);
        //                 card_3.insertAdjacentHTML("afterbegin", `<img src="${Farber}" id="f_i" />`);
        //             } else {
        //                 document.getElementById("v_i").remove();
        //                 document.getElementById("f_i").remove();
        //             }
        //         }
        //     }, 2000);
        // }
    }, []);
    console.log(data);
    const splits = splitIndices(data);
    console.log(splits);
    const cards_t = getCards(data, splits);
    console.log(cards_t);
    return (
        <div className="main_r">
            <img src={Img1} className="i_m" />
            {cards_t && cards_t.map((card, index) => {
                return (
                    <div key={index} className={"card_t-"+(index+1).toString()} id={"card_"+(index+1).toString()}>
                        {card.map((el,index_inner) => (
                            <div key={index_inner} dangerouslySetInnerHTML={{__html: el.element}}></div>
                        ))}
                    </div>
                )
            })
        }
        <div>
            <Link to="/rewards">rewards</Link>
            <Link to="/en/rewards">rewards english</Link>
        </div>
        </div>
    );
    
    
}
function getCards(data,splits) {
    let card_list = [];
    if(data.ru) {
        if(data.ru[0].el_ru) { // optimize this
            const card_1 = data.ru[0].el_ru.slice(splits[0], splits[1]);
            const card_2 = data.ru[0].el_ru.slice(splits[1], splits[2]);
            const card_3 = data.ru[0].el_ru.slice(splits[2], data.ru[0].el_ru.length);
            card_list = [card_1, card_2, card_3];
        }
    }
    return card_list;
}
function splitIndices(data) {
    let indices = [0];
    if(data.ru) {
        if(data.ru[0].el_ru) {
            for(let j = 0; j < data.ru[0].el_ru.length; j++) {
                if(data.ru[0].el_ru[j].element === '<!--θ-->') {
                    indices.push(j);
                }

            }
        }
    } else {
        console.error("contradiction")
        console.log(data);
    }
    return indices;
}


function getRussian(htmlF) {
    const query = `query {
        ru {
            el_ru {
                element
            }
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