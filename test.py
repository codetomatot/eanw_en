
import asyncio
from pyppeteer import launch
from bs4 import BeautifulSoup

async def main():
    browser = await launch(executablePath="/usr/bin/google-chrome")
    page = await browser.newPage()
    await page.goto('https://quotes.toscrape.com/')

    html = await page.content()
    await browser.close()
    return html

html_element = asyncio.get_event_loop().run_until_complete(main())

soup = BeautifulSoup(html_element, "html.parser")
title = soup.find('h1').text
print('title: ' + str(title))