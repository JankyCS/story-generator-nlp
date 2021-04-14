# Writing Buddy

WRITING BUDDY is an AI powered collaborative writing tool, served as a Discord Bot, and as a React App. DEMO VIDEO AND LINK TO ADD THE BOT TO YOUR SERVER SOON.

## How It Works/Tech Stack

### Model

The text is generated at a character-level, using a Long Short-Term Memory (LSTM) Recurrent Neural Network (RNN), built on Keras/TensorFlow. Following the recurrent layer are a few dense layers with a Scaled Exponential Linear Unit (SELU) activation function, and regularized by batch normalization.

### Data/Preprocessing

The dataset is comprised of 153 short stories, scraped from [Classic Shorts](www.classicshorts.com/bib.html) using BeautifulSoup. It contains 3422389 characters and 611454 words, which ultimately amounts to 855649 training examples for the neural network.

The dataset was divided into input strings, and output characters—the character immediately after the input string. The data is encoded using one hot encryption.

### Webapp

The text prediction is served as a Flask server, which is served to the end-user through a Discord Bot, or a ReactJS frontend.

## Limitations

Ultimately, the project is more of a proof-of-concept, than a polished, viable solution for authors. Although the text generates correct English words and generally uses correct grammar, it still struggles to maintain a cohesive thought, and can sometimes get stuck in "word loops". It also has phrases/ words that it frequents, such as "country", "consul", and "sun".

These limitations are a product of both the small training data provided, as well as its character-level text generation. Word-level text generation with word embeddings/vectors may be more effective, but requires a larger dataset than we had on hand.

## License
[MIT](https://choosealicense.com/licenses/mit/)
