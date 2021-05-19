from bs4 import BeautifulSoup as bsp
from bs4 import Comment
import requests

url = "https://www.ettoday.net/news/20210505/1975272.htm"
result = requests.get(url)
result.encoding = 'utf8'

soup = bsp(result.text, 'lxml')

delete_tags = ['style', 'script', 'head']
for tag in delete_tags:
    for target in soup.select(tag):
        target.extract()
    
for div in soup.findAll(['div', 'body']):
    for element in div(text=lambda text: isinstance(text, Comment)):
        element.extract()

for x in soup.findAll():
    if len(x.get_text(strip=True)) == 0:
        x.extract()

text_tags = ['A', 'abbr', 'acronym', 'address', 'area', 'aside', 'b', 'base', 'basefont', 'bdi',
            'bdo', 'big', 'br', 'caption', 'cite', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dt', 'dir', 'em',
            'embed', 'figcaption', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'ins', 'kbd',
            'keygen', 'legend', 'li', 'link', 'mark', 'menuitem', 'meta', 'meter', 'noframes', 'noscripts', 'optgroup',
            'option', 'output', 'p', 'param', 'pre', 'q', 'rp', 'rt', 's', 'samp', 'script', 'small', 'source', 'span',
            'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'tfoot', 'th', 'thead', 'time', 'title', 'track', 'tt',
            'u', 'var', 'video', 'wbr']

block_tags = ['applet', 'article', 'audio', 'body', 'button', 'canvas', 'center', 'code', 'datalist', 'div', 'dl',
              'fieldset', 'figure', 'footer', 'form', 'frame', 'frameset', 'header', 'html', 'iframe', 'section',
              'select', 'table', 'tbody', 'textarea', 'ul', 'etc']


# print(soup.prettify())
def recursiveNode(child):
    return

i = 1
for tag in text_tags:
    split = False
    subtext_set = soup.findAll(tag, recursive=True)
    if len(subtext_set) == 0:
        continue
    # print(subtext)
    for subtext in subtext_set:
        for child in subtext.findAll():
            if child.name in block_tags:
                split = True
                recursiveNode(child)
                # split
            elif child.name in text_tags and split == False:
                if child.has_attr('class') and not child.has_attr('NoSplit'):
                    subtext['class'].append('NoSplit')
                else:
                    subtext['class'] = ['NoSplit']
        if split == False:
            if subtext.has_attr('class') and not child.has_attr('Block' + str(i)):
                subtext['class'].append('Block' + str(i))
            else:
                subtext['class'] = ['Block' + str(i)]

