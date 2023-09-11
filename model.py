from ariadne import QueryType, MutationType
from googletrans import Translator
from bs4 import BeautifulSoup
from bs4.element import Comment
import asyncio
from pyppeteer import launch
import requests

t_r = Translator()

query = QueryType()
mutation = MutationType()

def tags(element):
    if element.parent.name in ['html','style','script','head','title','meta','[document]', 'noscript']:
        return False
    if isinstance(element, Comment):
        return False
    return True
def find_txt(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_text = filter(tags, texts)
    return [t.strip() for t in visible_text]

async def get_page_html():
    browser = await launch(executablePath="/usr/bin/google-chrome")
    page = await browser.newPage()
    await page.goto('http://localhost:3000')

    html = await page.content()
    await browser.close()
    return html

html = asyncio.get_event_loop().run_until_complete(get_page_html())
text = list(filter(None, find_txt(html)))

text_dict_arr = []
for msg in text:
    text_dict_arr.append({"text": t_r.translate(str(msg), src=t_r.detect(str(msg)).lang, dest='ru').text, "path": "/"})
print(text_dict_arr)
@query.field("ru")
def resolve_hello(_, info):
    return text_dict_arr

contents = [
    {"text": "whatever beauftiful soup gives", "path": "the url"}
]
@query.field("en")
def resolve_en(_,info):
    return contents

books = [{"id": 1, "title": "Fellowship of the ring"},
        {"id": 2, "title": "Two Towers"},
        {"id": 3, "title": "The Return of the King"}]

@query.field("books")
def resolve_book(_,info):
    return books 


