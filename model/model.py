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

def tokenize(text):
    tokenizer = RegexpTokenizer(r'\w+')
    tokens = tokenizer.tokenize(text)
    print(tokens)

    filtered = filter(lambda token: token not in stopwords.words('english'), tokens)
    # return list(filtered)
    return " ".join(filtered)

def useModel():
    filename = "model_weights_saved.hdf5"
    model.load_weights(filename)
    model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

def sample(preds, top_n=3):
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds)
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)

    return heapq.nlargest(top_n, range(len(preds)), preds.take)

def main(): 
    # text = open("../smallData.txt").read().lower()
    text = open("../storyData.txt").read().lower()

    # print(len(text))
    # a=tokenize(text)
    # print(a)
    lenText = len(text)

    chars = sorted(list(set(text)))
    charToIndices = dict((c, i) for i, c in enumerate(chars))
    indicesToChar = dict((i, c) for i, c in enumerate(chars))
    numChars = len(chars)
    print(chars)
    print('Unique Chars:', numChars)
    print("Text length (chars):",lenText)

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
    if False:
        filepath = "model_weights_saved_80.hdf5"
        checkpoint = ModelCheckpoint(filepath, monitor='loss', verbose=1, save_best_only=True, mode='min')
        desired_callbacks = [checkpoint]

        model.fit(X, y, validation_split=0.05, batch_size=124, epochs=20, shuffle=True, callbacks=desired_callbacks)
    else:
        filename = "model_weights_saved_80.hdf5"
        model.load_weights(filename)
        model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

        # start = numpy.random.randint(0, len(x_data) - 1)
        pattern = "i am very tired and"
        pattern = [charToIndices[char] for char in pattern]

        testInput = "he was a quiet, calculating man. many people wanted to "

        while len(testInput) <80:
            testInput = " "+testInput

        original_text = testInput
        completion = ''
        print(original_text)
        print("pogers1")
        while True:
            # print("pogers3")
            # x = prepare_input(text)
            x = np.zeros((1, seqLen, numChars))
            for t, char in enumerate(testInput):
                # print(char)
                x[0, t, charToIndices[char]] = 1.
            preds = model.predict(x, verbose=0)[0]
            next_index = sample(preds, top_n=1)[0]
            next_char = indicesToChar[next_index]
            if len(testInput) > 79:
                testInput = testInput[1:] + next_char
            else:
                testInput = testInput + next_char
            completion += next_char

            if len(original_text + completion) > 1500:
                break

            # print(testInput)    
            if len(original_text + completion) > len(original_text)+2 and next_char == ' ':
                print(original_text + completion)

        print(original_text + completion)
        print("pogers2")

        # for i in range(1000):
        #     x = np.reshape(pattern, (1, len(pattern), 1))
        #     x = x / float(numChars)
        #     prediction = model.predict(x, verbose=0)
        #     index = numpy.argmax(prediction)
        #     result = indicesToChar[index]

        #     sys.stdout.write(result)

        #     pattern.append(index)
        #     pattern = pattern[1:len(pattern)]
        

if __name__=="__main__": 
    main() 
