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
    const [currentIdx, setCurrentIdx] = useState(0)

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

        // NOTE: this code won't run because updated contains the *reference* to selectedImgs
        // and selectedImgs reference didn't change - hance rerender not occurring
        // const updated = selectedImgs

        // using the spread operator fills up the new reference with values instead of sending a reference itself
        const updated = [...selectedImgs]
        if (!(updated.find((imgname) => imgname === img))) {
            // add image to selectedImgs
            updated.push(img)
        } else {
            // remove image from selectedImgs
            console.log("removing")
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

    const handleOnScrollToImg = (e, i, next) => {
        // if I don't add this, then either getElementById or scrollIntoView just "break"
        // no idea why it was working previously without any hitches
        e.preventDefault()
        e.stopPropagation()


        // console.log(imgs[currentIdx])
        // console.log(i)
        // console.log(imgs[i])

        // console.log(document.getElementById(imgs[i + 1]))

        // console.log(i)
        console.log(currentIdx)
        console.log(imgs[currentIdx])
        console.log(document.getElementById(imgs[currentIdx]))

        if (next) {
            if (currentIdx === i) {
                document.getElementById(imgs[currentIdx + 1]).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
                setCurrentIdx(currentIdx + 1)
            } else {
                document.getElementById(imgs[i + 1]).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
                setCurrentIdx(i + 1)
            }
        } else {
            if (currentIdx === i) {
                console.log("prev")
                document.getElementById(imgs[currentIdx - 1]).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
                setCurrentIdx(currentIdx - 1)
            } else {
                document.getElementById(imgs[i - 1]).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
                setCurrentIdx(i - 1)
            }
        }
    }

    useEffect(() => {
        const handleKeydown = (e) => {
            console.log(e.key)
            if (e.key === "ArrowRight") {
                handleOnScrollToImg(e, currentIdx, true)
            }
            if (e.key === "ArrowLeft") {
                handleOnScrollToImg(e, currentIdx, false)
            }
            if (e.key === "ArrowUp") {
                handleOnImgClick(imgs[currentIdx], currentIdx)
            }
        }

        window.addEventListener("keydown", handleKeydown)
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };

    }, [imgs, currentIdx, selectedImgs])


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
                                    <div id={img} >
                                        <div onClick={() => handleOnImgClick(img, i)}>
                                            {selectedImgs.find((imgname) => imgname === img) ?
                                                <h2>DELETING</h2> :
                                                <h2>SAVING</h2>}
                                        </div>
                                        <p>{img}</p>
                                        <div>
                                            <button onClick={(e) => handleOnScrollToImg(e, i, false)}>prev</button>
                                            <button onClick={(e) => handleOnScrollToImg(e, i, true)}>next</button>
                                        </div>
                                        {/* <div onClick={() => document.getElementById(img).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })}> */}
                                        <div>
                                            {/* <div > */}
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
                                        <div onClick={() => handleOnImgClick(img, i)}>
                                            {selectedImgs.find((imgname) => imgname === img) ?
                                                <h2>DELETING</h2> :
                                                <h2>SAVING</h2>}
                                        </div>
                                        <div>
                                            <button onClick={() => handleOnScrollToImg(0)}>prev</button>
                                            <button onClick={() => document.getElementById(imgs[i + 1]).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })}>next</button>
                                        </div>
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
