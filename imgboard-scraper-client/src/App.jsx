import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const [newLink, setNewLink] = useState("")
    const [imgs, setImgs] = useState([])
    const [selectedImgs, setSelectedImgs] = useState([])

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
                console.log(res.data)
                setImgs(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    const handleOnImgClick = (img, i) => {
        console.log(img + " at index: " + i)

        const updated = selectedImgs
        if (!(updated.find((imgname) => imgname === img))) {
            // add image to selectedImgs
            updated.push(img)
        } else {
            // remove image from selectedImgs
            const i = updated.indexOf(img)
            if (i > -1) { // only splice array when item is found
                updated.splice(i, 1);
            }
        }
        setSelectedImgs(updated)
    }

    const handleOnDeleteSelectedImgs = () => {
        // e.preventDefault();
        axios.post(`http://127.0.0.1:8000/delete-imgs`, {
            "imgs": selectedImgs
        }).then((res) => {
            console.log(res)
            // setImgLinks(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {

    }, [selectedImgs])

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* <a href={newLink}><button onClick={() => handleOnGet()}>GOTO</button></a> */}
                <button onClick={() => console.log(selectedImgs)}>DEBUG: show selectedImgs</button>
                <button onClick={() => handleOnDeleteSelectedImgs()}>Delete Selected Images</button>
                <button onClick={(e) => handleOnPost(e)}>POST</button>
                <button onClick={(e) => handleOnShowFolder(e)}>show folder</button>
                <input type="text" style={{ width: "500px" }} onChange={(e) => setNewLink(e.target.value)}></input>
            </div>
            <div>
                <p>imgs</p>
                <div style={{ width: "100%", overflowX: "scroll", height: "500px" }}>
                    <div style={{ display: "flex" }}>
                        {/* <img style={{width: "500px"}}src={testimg}></img> */}
                        {imgs.map((img, i) => {
                            // const re = /(?:\.([^.]+))?$/
                            // const filetype = re.exec(img)[1]
                            const filetype = /(?:\.([^.]+))?$/.exec(img)[1]
                            // console.log(filetype)
                            if (filetype === "gif" || filetype === "png" || filetype === "jpg" || filetype === "jpeg") {
                                return (
                                    <div onClick={() => { handleOnImgClick(img, i); document.getElementById(img).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' }) }} id={img}>
                                        <div>
                                            <h3 style={selectedImgs.find((imgname) => imgname === img) && { color: "green" }}>checkhere</h3>
                                            {/* <p>filetype: {img} </p> */}
                                            {/* <img src={testimg}></img> */}
                                            <img style={{ width: "500px" }} src={"/download/" + img}></img>
                                        </div>
                                    </div>
                                )
                            }
                            else if (filetype === "webm") {
                                return (
                                    <div>
                                        {/* <video style={{ width: "500px" }} controls>
                                    <source src={"/download/" + img}></source>
                                </video> */}
                                        <p>video placeholder</p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default App
