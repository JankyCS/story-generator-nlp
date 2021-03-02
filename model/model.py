import numpy as np
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
    # text = open("../smallData.txt").read().lower()
    text = open("../smallData.txt").read().lower()

    # print(len(text))
    # a=tokenize(text)
    # print(a)
    lenText = len(text)

    chars = sorted(list(set(text)))
    charToIndices = dict((c, i) for i, c in enumerate(chars))
    indicesToChar = dict((i, c) for i, c in enumerate(chars))
    numChars = len(chars)
    # print(chars)
    print('Unique Chars:', numChars)
    print("Text length (chars):",lenText)

    # arbitrary length for a sequence
    seqLen = 20
    stepSize = 2
    inputSeq = []
    outputChar = []
    dataPairs = []
    for i in range(0,lenText-seqLen, stepSize):
        inputSeq.append(text[i:i+seqLen])
        outputChar.append(text[i+seqLen])
        dataPairs.append((text[i:i+seqLen],text[i+seqLen]))
        # print(text[i:i+seqLen])
        # print(text[i+seqLen])
        # print("------------")
    # print(dataPairs[3][1])
    # print(len(inputSeq))

    # one hot encoding
    X = np.zeros((len(inputSeq), seqLen, numChars), dtype=np.bool)
    y = np.zeros((len(inputSeq), numChars), dtype=np.bool)
  
    for i, seq in enumerate(inputSeq):
        for t, char in enumerate(seq):
            X[i, t, charToIndices[char]] = True
        y[i, charToIndices[outputChar[i]]] = True
    
    print(X.shape)
    print(y.shape)
if __name__=="__main__": 
    main() 
