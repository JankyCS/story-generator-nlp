import requests
import bs4
import re
import sys

#return bs4 object
def getPage(url,headers):
    res = requests.get(url, headers=headers)
    try:
        res.raise_for_status()
    except:
        pass

    pageHtml=bs4.BeautifulSoup(res.text,'html.parser')
    return pageHtml

#check if previous scrape already contained the given listing
def getStoryText(link):
    # f = open("trainingData12.txt", "a", encoding='utf-8')

    regex = re.compile(r'[\n\r\t]')
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    pageHtml=getPage(link,headers)

    elems = pageHtml.find_all("div", class_="StoryPara")
    totalText = ""
    for e in elems:
        totalText += regex.sub(" ", e.text.strip())
        # totalText += '\n'

        # print(e.text.strip())
    print(totalText)
    # f.write(totalText)
    # f.close()
    
    return totalText

# Returns an array of dcitionaries - turnip listings
def getListings(old=[]):

    badTitles = {'tlrm','fiddler','frog','ItalianMaster','luck'}
    f = open("storyData.txt", "a", encoding='utf-8')

    url = "http://www.classicshorts.com/bib.html"
    headers = {'User-Agent': 'Mozilla/5.0'}
    storyUrls = []
    storyTexts = []
    rawText = ""

    pageHtml=getPage(url,headers)
    elems = pageHtml.find_all("div", class_="biolisting")

    # print(elems)

    for e in elems:
        # print(e.attrs['onclick'][11:-2])
        currentUrl = "http://www.classicshorts.com/stories/"+e.attrs['onclick'][11:-2]+".html"
        if e.attrs['onclick'][11:-2] not in badTitles:
            pog = getStoryText(currentUrl).lower()
            storyTexts.append(pog)
            # rawText += "------------------\n"
            # rawText += e.attrs['onclick'][11:-2]
            # rawText += '\n'
            rawText += pog
            # rawText += '\n'
        
        # storyUrls.append("http://www.classicshorts.com/stories/"+e.attrs['onclick'][11:-2]+".html")

    print(storyTexts)
    f.write(rawText)
    f.close()

    # for i in range(1):
    #     pageHtml=getPage(url,headers)
    #     elems = pageHtml.find_all("a", class_="biolisting")
    #     url=pageHtml.find("span",class_="next-button").find("a" , recursive=False)['href'] 
    #     for j in range(len(elems)):
    #         link="https://old.reddit.com"+elems[j]['href']
    #         if alreadyHas(old,link):
    #             break
    #         try:
    #             addListing(link,tListings,headers)
    #         except:
    #             pass
    # for i in range(len(old)):
    #     if checkActivity(old[i]['url'],headers):
    #         prev.append(old[i])
    
    
    # tListings=tListings+prev
    # print (tListings)
    # return tListings

getListings()
# getStoryText('http://www.classicshorts.com/stories/fiddler.html')