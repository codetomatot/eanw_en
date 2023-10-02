import React, {useState,useEffect} from "react";
import Img1 from "./img_data/img1.png";
import Vlad from "./img_data/vlad_tym.png";
import Farber from "./img_data/farber.png";

export default function En() {
    const [data, setData] = useState([]);
    useEffect(() => {
        getEnglish(gql_e => setData(gql_e));
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
  if(data.en) {
    for(let j = 0; j < data.en[0].el_en.length; j++) {
        if(data.en[0].el_en[j].element === '<!--θ-->') {
          indices.push(j);
        }
    }
    console.log(indices);
    const card_1 = data.en[0].el_en.slice(indices[0], indices[1]);
    const card_2 = data.en[0].el_en.slice(indices[1], indices[2]);
    const card_3 = data.en[0].el_en.slice(indices[2], data.en[0].el_en.length);
    card_list = [card_1, card_2, card_3];
  }
  return card_list;
}



function getEnglish(callBack) {
    const query = `query {
      en {
        el_en {
          element
        }
      }
    }`;
    return fetch("/graphql", {
      method: "POST",
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        query: query,
      })
    }).then(res => res.json()).then(res => callBack(res.data)).catch(err => console.error(err));
}