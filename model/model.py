import numpy
import sys
import nltk
# nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer

def tokenize(text):
    tokenizer = RegexpTokenizer(r'\w+')
    tokens = tokenizer.tokenize(text)
    print(tokens)

    filtered = filter(lambda token: token not in stopwords.words('english'), tokens)
    # return list(filtered)
    return " ".join(filtered)
def main(): 
    text = open("../smallData.txt").read().lower()
    # text = open("../storyData.txt").read().lower()

    # print(len(text))
    # a=tokenize(text)
    # print(a)
    lenText = len(text)

    chars = sorted(list(set(text)))
    chatToIndices = dict((c, i) for i, c in enumerate(chars))
    indicesToChar = dict((i, c) for i, c in enumerate(chars))
    numChars = len(chars)
    # print(chars)
    print('Unique Chars:', numChars)
    # print(char_indices['h'])
    # print(indices_char[3])

    print("Text length (chars):",lenText)

  
if __name__=="__main__": 
    main() 
