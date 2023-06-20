from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
import urllib.request
from bs4 import BeautifulSoup


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


@app.get("/goto-link")
def goto_link(URL: str):
    return {URL}


@app.post("/post-link")
async def post_link(payload: dict = Body(...)):
    # print("test")
    # print(payload["gotoURL"])
    URL_to_scrape = payload["gotoURL"]
    if (URL_to_scrape != ""):
        img_links = get_image_links(URL_to_scrape)
        print(img_links)
        return img_links
    else:
        return "URL required"

#TODO: snag hrefs from that reference to media
def get_image_links(URL: str):
    all_img_links = []
    html_doc = read_html_response(URL)
    soup = BeautifulSoup(html_doc, 'html.parser')
    links = soup.find_all("a", class_="fileThumb")
    for link in links:
        _link = "https:"+link.get("href")
        # print(_link)
        all_img_links.append(_link)
    # I have all the image links
    # print(all_img_links)
    # now to save the links into a folder
    return all_img_links


def read_html_response(URL: str):
    req = urllib.request.Request(
        URL, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    html_doc = response.read()
    return html_doc
