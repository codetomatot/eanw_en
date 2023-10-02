import React, {useEffect,useState} from "react";
import Img1 from "./img_data/img1.png";

export default function De() {
    const [data, setData] = useState([]);
    useEffect(() => {
        getDeutsch(gql_e => setData(gql_e));
      //   return function cleanup() {
      //     setTimeout(() => {
      //         if(document.getElementById("card_2") != null && document.getElementById("card_3") != null) {
      //           const v_i = document.getElementById("v_i");
      //           const f_i = document.getElementById("f_i");
      //           if(!(v_i.parentNode === document.getElementById("card_2") && f_i.parentNode === document.getElementById("card_3"))) {
      //             v_i.insertAdjacentHTML("afterbegin", `<img src="${Vlad} id="v_i" />`);
      //             f_i.insertAdjacentHTML("afterbegin", `<img src="${Farber}" id="f_i" />`);
      //           }
      //         }
      //     }, 2000);
      // }
    }, []);
    console.log(data)
    const cards_t = getCards(data);
    // console.log(cards_t);
    
    return (
        <div className="main_r">
            <img src={Img1} className="i_m" />
            {cards_t && cards_t.map((card, index) => {
                return (
                    <div className={"card_t-"+(index+1).toString()} id={"card_"+(index+1).toString()}>
                        {card.map((el,index_inner) => (
                            <div key={index_inner} dangerouslySetInnerHTML={{__html: el.element}}></div>
                        ))}
                    </div>
                )
            })
        }
        </div>
    );
}
function getCards(data) {
    let indices = [0];
    let card_list = [];
    if(data.de) {
      for(let j = 0; j < data.de[0].el_de.length; j++) {
          if(data.de[0].el_de[j].element === '<!--θ-->') {
            indices.push(j);
          }
      }
      console.log(indices);
      const card_1 = data.de[0].el_de.slice(indices[0], indices[1]);
      const card_2 = data.de[0].el_de.slice(indices[1], indices[2]);
      const card_3 = data.de[0].el_de.slice(indices[2], data.de[0].el_de.length);
      card_list = [card_1, card_2, card_3];
    }
    return card_list;
  }
function getDeutsch(callback) {
    const query = `query {
        de {
            el_de {
                element
            }
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