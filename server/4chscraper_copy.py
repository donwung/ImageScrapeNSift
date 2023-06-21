from bs4 import BeautifulSoup
from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from flask import Flask, render_template, redirect, request
from requests import get
import re
import os
import urllib.request
from os import walk
import shutil
import sys


app = FastAPI()

####### get around CORS ####
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
############################


# reads url, puts it into soup, returns all hrefs ie web files
def parse_url(thread_URL):
    req = urllib.request.Request(
        thread_URL, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    html_doc = response.read()
    # print(response)
    soup = BeautifulSoup(html_doc, 'html.parser')
    links = soup.find_all("a", class_="fileThumb")
    return links

# downloads file into downloads folder
def download(url, file_name):
    with open("./../imgboard-scraper-client/public/download/"+file_name, "wb") as file:
        res = get(url)
        file.write(res.content)

# after getting a regex match array, this flattens an array of characters
def flattenPostNumArr(arr):
    res = ""
    for i in range(1, len(arr)):
        res = res + arr[i]
    return res


@app.post("/post-link")
async def post_link(payload: dict = Body(...)):
    allImgs = []
    URL_to_scrape = payload["gotoURL"]

    links = parse_url(URL_to_scrape)
    for link in links:
        _link = "https:"+link.get("href")
        # print(_link)

        postNum = re.findall("[0123456789]", _link)
        postNum = flattenPostNumArr(postNum)

        fileExt = re.findall("\.[a-z]+", _link)
        fileExt = fileExt[1]

        oneFile = [postNum, fileExt]
        allImgs.append(oneFile)
        fileName = postNum + fileExt

        # this downloads one file named as the post number
        if not os.path.exists(f"./../imgboard-scraper-client/public/download/{fileName}"):
            download(_link, fileName)
    return


@app.get("/show-folder")
async def show_folder():
    print("def show-folder")
    filenames = next(walk("./../imgboard-scraper-client/public/download/"), (None, None, []))[2]  # [] if no file
    # print(filenames)
    return filenames
