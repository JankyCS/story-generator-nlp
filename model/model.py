import numpy as np
import sys
import nltk
# nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense, Dropout, LSTM
from tensorflow.keras.layers import Dense, Activation, LSTM, Dropout, GRU, TimeDistributed, BatchNormalization
from tensorflow.keras.optimizers import RMSprop
from tensorflow.keras.callbacks import ModelCheckpoint
import heapq
import random 

def tokenize(text):
    tokenizer = RegexpTokenizer(r'\w+')
    tokens = tokenizer.tokenize(text)

    filtered = filter(lambda token: token not in stopwords.words('english'), tokens)
    # return list(filtered)
    return " ".join(filtered)

def useModel():
    numChars = 78
    seqLen = 80

    model = Sequential()
    model.add(LSTM(numChars * 5, input_shape=(seqLen, numChars)))
    model.add(BatchNormalization())
    model.add(Activation('selu'))

    model.add(Dense(numChars * 2))
    model.add(BatchNormalization())
    model.add(Activation('selu'))

    model.add(Dense(numChars * 2))
    model.add(BatchNormalization())
    model.add(Activation('selu'))

    model.add(Dense(numChars))
    model.add(Activation('softmax'))

    optimizer = RMSprop(lr=0.001)

    filename = "model_weights_saved_80.hdf5"
    model.load_weights(filename)
    model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

    return model

def sample(preds, top_n=3):
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds)
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)

    return heapq.nlargest(top_n, range(len(preds)), preds.take)

def sampleRandom(preds, top_n=3):
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds)
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)
    sampleList = [100, 200, 300, 400, 500]
    randomList = random.choices(range(len(preds)), weights=preds) 
    return heapq.nlargest(top_n, range(len(preds)), preds.take)

def makePrediction(inputSequence, model, numWords):
    chars = [' ', '!', '"', '#', '$', '&', "'", '(', ')', '*', '+', ',', '-', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '?', '[', ']', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '}', '\xa0', '¢', '£', '¦', '§', '¨', '©', 'ª', '«', '®', '¯', '´', '¶', 'â', 'ã', 'ˆ', '—', '”', '…', '€']
    charToIndices = dict((c, i) for i, c in enumerate(chars))
    indicesToChar = dict((i, c) for i, c in enumerate(chars))
    numChars = len(chars)
    seqLen = 80
    
    original_text = inputSequence
    inputSequence = inputSequence.lower()
    filtered = ""
    for c in inputSequence:
        if c in chars:
            filtered+=c

    inputSequence = filtered

    if len(inputSequence)>80:
        inputSequence = inputSequence[-79:]

    while len(inputSequence) <80:
        inputSequence = " "+inputSequence

    completion = ''
    gop = True
    wordCount = 0

    while gop:
        x = np.zeros((1, seqLen, numChars))
        for t, char in enumerate(inputSequence):
            x[0, t, charToIndices[char]] = 1.
        preds = model.predict(x, verbose=0)[0]

        # The first letter of 1/10 words will be chosen randomly
        chance = random.randint(1,10)
        if chance == 1 and inputSequence[len(inputSequence)-1]==" ":
            op = sample(preds, top_n=5)
            rng = random.choices(op, weights=[0,16,8,4,2]) 
            next_index = rng[0]
        else:
            next_index = sample(preds, top_n=1)[0]
        next_char = indicesToChar[next_index]

        if next_char == ' ':
            wordCount+=1

        inputSequence = inputSequence[1:] + next_char
        completion += next_char
        
        if wordCount >= numWords or len(original_text + completion) > 1500:
            break

    return (original_text + completion, completion)

def train(): 
    # text = open("../smallData.txt").read().lower()
    text = open("../storyData.txt").read().lower()

    lenText = len(text)

    chars = sorted(list(set(text)))
    charToIndices = dict((c, i) for i, c in enumerate(chars))
    indicesToChar = dict((i, c) for i, c in enumerate(chars))
    numChars = len(chars)

    # arbitrary length for a sequence
    seqLen = 80
    stepSize = 4
    inputSeq = []
    outputChar = []
    dataPairs = []
    for i in range(0,lenText-seqLen, stepSize):
        inputSeq.append(text[i:i+seqLen])
        outputChar.append(text[i+seqLen])
        dataPairs.append((text[i:i+seqLen],text[i+seqLen]))

    X = np.zeros((len(inputSeq), seqLen, numChars), dtype=np.bool)
    y = np.zeros((len(inputSeq), numChars), dtype=np.bool)
  
    for i, seq in enumerate(inputSeq):
        for t, char in enumerate(seq):
            X[i, t, charToIndices[char]] = True
        y[i, charToIndices[outputChar[i]]] = True
    
    model = Sequential()
    model.add(LSTM(numChars * 5, input_shape=(seqLen, numChars)))
    model.add(BatchNormalization())
    model.add(Activation('selu'))

    model.add(Dense(numChars * 2))
    model.add(BatchNormalization())
    model.add(Activation('selu'))

    model.add(Dense(numChars * 2))
    model.add(BatchNormalization())
    model.add(Activation('selu'))

    model.add(Dense(numChars))
    model.add(Activation('softmax'))

    optimizer = RMSprop(lr=0.001)
    model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

    filepath = "model_weights_saved_80.hdf5"
    checkpoint = ModelCheckpoint(filepath, monitor='loss', verbose=1, save_best_only=True, mode='min')
    desired_callbacks = [checkpoint]

    model.fit(X, y, validation_split=0.05, batch_size=124, epochs=20, shuffle=True, callbacks=desired_callbacks)

if __name__=="__main__": 
    model = useModel()
    while True:
        choice = input("Enter 'T' to Train. Enter 'P' to make a prediction. Enter anything else to terminate.")
        if choice.lower() == 't':
            train()
        elif choice.lower() == 'p':
            inputSequence = input("Enter your input sentence/sequence:")
            makePrediction(inputSequence.lower(), model, 50)
        else:
            print("Terminating")
            break
    makePrediction()
