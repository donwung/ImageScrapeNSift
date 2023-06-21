import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const [newLink, setNewLink] = useState("")
    const [imgLinks, setImgLinks] = useState([])

    const handleOnGet = () => {
        axios.get(`http://127.0.0.1:8000/goto-link?URL=${newLink}`)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            });
    }

    const handleOnPost = (e) => {
        e.preventDefault();
        axios.post(`http://127.0.0.1:8000/post-link`, {
            "gotoURL": newLink
        }).then((res) => {
            console.log(res)
            setImgLinks(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleOnShowFolder = (e) => {
        e.preventDefault();
        axios.get(`http://127.0.0.1:8000/show-folder`)
            .then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <a href={newLink}><button onClick={() => handleOnGet()}>GOTO</button></a>
            <button onClick={(e) => handleOnPost(e)}>POST</button>
            <button onClick={(e) => handleOnShowFolder(e)}>show folder</button>
            <input type="text" style={{ width: "500px" }} onChange={(e) => setNewLink(e.target.value)}></input>
            <div>
                <p>imglinks</p>
                <img src="https://i.4cdn.org/v/1687281098418245.png"></img>
                {/* {imgLinks.map((imgLink) => {
                    return <img src={imgLink} crossOrigin="anonymous"></img>
                })} */}
            </div>
        </div>
    )
}

export default App
