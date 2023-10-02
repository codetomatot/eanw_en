import React, { useState, useEffect } from "react";
import "./RewS.css";
import { AiOutlineClose } from "react-icons/ai";

export default function Rewards() {
    console.log(window.innerWidth)
    const [data,setData] = useState([]);
    const [popup, setPopup] = useState(false);
    const [img, setImg] = useState("");
    const [imgIdx, setImgIdx] = useState(0);
    useEffect(() => {
        getRussianRewards(rew_ru => setData(rew_ru));
    },[]);

    const images = require.context('../img_data/nagradi', false);
    const imageList = images.keys().map(image => images(image));

    return (
        <div className="main_reward"> 
            {window.location.pathname === "/rewards" ?
            <div> 
                <h1>Памятные медали и почетные награды Академии</h1>
                <div className="reward_grid">
                    {mapImages(imageList, "ru", data, setPopup, setImg, setImgIdx)}
                    {popup ? 
                        <>{exec(data, img, imgIdx, "ru", popup, setPopup)}</>
                    : null}
                </div>
            </div>
            : ( window.location.pathname === "/en/rewards" ? 
            <div>
                <h1>Commemorative medals and honorary awards of the Academy</h1>
                <div className="reward_grid">
                    {mapImages(imageList, "en", data, setPopup, setImg, setImgIdx)}</div>
                    {popup ? 
                        <>{exec(data, img, imgIdx, "en", popup, setPopup)}</>
                    : null}
                </div> 
            : <div>
                <h1>Gedenkmedaillen und Ehrenpreise der Akademie</h1>
                <div className="reward_grid">{mapImages(imageList, "de", data, setPopup)}</div>
            </div>) }
        </div>
    );
}
const exec = (data, currentImg, idx, lang, pop_state, setPopState) => {
    if(data.ru && lang === "ru" && pop_state) {
        return (
            <div>
                <div className="pos"></div>
            <div className="popup-container">
                <button className="closer" onClick={() => setPopState(false)}><AiOutlineClose /></button>
                <img src={currentImg} style={{display: 'inline-flex'}} className="new_img_ext" />
                <div dangerouslySetInnerHTML={{__html: data.ru[0].rewards_ru[idx].element}}></div>
            </div>
            </div>
        )
    } else if(data.en && lang === "en" && pop_state) {
        console.log("en click")
        return (
            <div>
                <div className="pos"></div>
                <div className="popup-container">
                    <button className="closer" onClick={() => setPopState(false)}><AiOutlineClose /></button>
                    <img src={currentImg} style={{display: 'inline-flex'}} className="new_img_ext" />
                    <div dangerouslySetInnerHTML={{__html: data.en[0].rewards_en[idx].element}}></div>
                </div>
            </div>
            
        )
    } else if(data.de && lang === "de" && pop_state) {
        return (
            <div>
                <div className="pos"></div>
                <div className="pop-container">
                <button className="closer" onClick={() =>  setPopState(false)}><AiOutlineClose /></button>
                <img src={currentImg} style={{display: 'inline-flex'}} className="new_img_ext" />
                <div dangerouslySetInnerHTML={{__html: data.de[0].rewards_de[idx].element}}></div>
            </div>
            </div>
        )
    } 
}

function mapImages(image_list, lang, data, pop_state, img_state, setImgIdx) {
    const spec_indices = [4,7,13,17,30,31,34,38,40];
    return image_list.map((img, index) => {
        return (
            <div key={index} id={`img_${index}`} className="all_img_rew">
                <img key={index} src={img} alt={img.default} style={{width: '250px', height: '350px'}} />
                <>{data.ru && lang === "ru" ? 
                (spec_indices.includes(index) ? <p style={{display: 'inline-flex', textDecoration: 'underline', cursor: "pointer"}} onClick={() => {pop_state(true); img_state(img); setImgIdx(index);}}>{data.ru[0].dpr[index].p_text}</p> : <p style={{display: 'inline-flex'}}>{data.ru[0].dpr[index].p_text}</p> )
                :
                (data.en && lang === "en" ? 
                (spec_indices.includes(index) ? <p style={{display: 'inline-flex', textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {pop_state(true); img_state(img); setImgIdx(index);}}>{data.en[0].dpe[index].p_text}</p> : <p style={{display: 'inline-flex'}}>{data.en[0].dpe[index].p_text}</p> )
                : 
                (data.de && lang === "de" ? 
                (spec_indices.includes(index) ? <p style={{display: 'inline-flex', textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {pop_state(true); img_state(img); setImgIdx(index);}}>{data.de[0].dpd[index].p_text}</p> : <p style={{display: 'inline-flex'}} onClick={() => {pop_state(true); img_state(img); setImgIdx(index);}}>{data.de[0].dpd[index].p_text}</p> )
                : null)) }</>
            </div>
        )
    });
}


function getRussianRewards(cb) { //no async
    const query = `
    query {
        ru {
            dpr {
                p_text
            }
            rewards_ru {
                element
            }
        }
        en {
            dpe {
                p_text
            }
            rewards_en {
                element
            }
        }
        de {
            dpd {
                p_text
            }
            rewards_de {
                element
            }
        }
    }
    `;
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
    }).then(res => res.json()).then(res => cb(res.data))
}