# ImageScrapeNSift

An webpage image scraper, doubling as a sifting tool (if desired).

Uses the React framework as a front-end, with FastAPI as a Python back-end.

The scraping part is pretty straightforward. This uses Beautiful Soup 4 to download all images from a webpage.

The sifting tool is to only download select images instead of all of them.

For example:

Some webpages have a lot of cool images you want to keep. But a lot of other images, you don't want.

So this tool offers a convenient, mouseless sifting tool to pick and choose what you want without having to right-click -> delete one image at a time after scraping something.

~~If you only want to use the sifting tool, it is also available to use on a folder of your choosing.~~ WIP
