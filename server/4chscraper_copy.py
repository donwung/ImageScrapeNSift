from bs4 import BeautifulSoup
from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from flask import Flask, render_template, redirect, request
from requests import get
import re
import os
import urllib.request
from os import walk
import threading
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


def dl_img_at_indices(links, all_imgs, increment, start):
    for link_i in range(start - 1, len(links), increment):
        _link = "https:"+links[link_i].get("href")

        postNum = re.findall("[0123456789]", _link)
        postNum = flattenPostNumArr(postNum)

        fileExt = re.findall("\.[a-z]+", _link)
        fileExt = fileExt[1]

        oneFile = [postNum, fileExt]
        all_imgs.append(oneFile)
        fileName = postNum + fileExt

        # this downloads one file named as the post number
        if not os.path.exists(f"./static/{fileName}"):
            download(_link, fileName)
    return all_imgs


@app.post("/post-link")
async def post_link(payload: dict = Body(...)):
    URL_to_scrape = payload["gotoURL"]
    all_imgs = []
    number_of_threads = 8
    links = parse_url(URL_to_scrape)

    # don't know enough yet lol
    t1 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 1))
    t2 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 2))
    t3 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 3))
    t4 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 4))
    t5 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 5))
    t6 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 6))
    t7 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 7))
    t8 = threading.Thread(
        target=dl_img_at_indices, args=(links, all_imgs, number_of_threads, 8))

    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t5.start()
    t6.start()
    t7.start()
    t8.start()

    t1.join()
    t2.join()
    t3.join()
    t4.join()
    t5.join()
    t6.join()
    t7.join()
    t8.join()
    return


@app.get("/show-folder")
async def show_folder():
    filenames = get_file_names()
    return filenames


def get_file_names():
    # print("def show-folder")
    filenames = next(walk("./../imgboard-scraper-client/public/download/"),
                     (None, None, []))[2]  # [] if no file
    # print(filenames)
    return filenames


@app.post("/delete-imgs")
def delete_imgs(payload: dict = Body(...)):
    # print("deleting")
    imgs_to_delete = payload["imgs"]
    # print(imgs_to_delete)
    delete_imgs_from_folder(imgs_to_delete)


def delete_imgs_from_folder(imgs):
    # print(imgs)
    for img in imgs:
        if img in get_file_names():
            print("removing" + img)
            os.remove("./../imgboard-scraper-client/public/download/"+img)
