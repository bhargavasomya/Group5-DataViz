---
title: Visualizing Quora Duplicate Question
layout: post
author: Group 5
---

# Motivation

In order to build a high-quality knowledge base, it's important that Q&A platforms like Quora and Stack Exchange  ensure each unique question exists only once. The writers for such platforms shouldn't have to write the same answer to multiple versions of the same question, and readers should be able to find a single non-duplicate page with the question they're looking for. For example, Quora would consider questions like “What are the best ways to lose weight?”, “How can a person reduce weight?”, and “What are effective weight loss plans?” to be duplicate questions. To prevent duplicate questions from existing on such Knowledge bases, our goal is to develop machine learning and natural language processing system to automatically identify when questions with the same intent have been asked multiple times. Our visualization aims to provide users an insight into how these machine learning models perform and to provide a comparison between the duplication result of a neural network and a simple cosine similarity.

# Mathematical formulation

Our problem of duplicate detection can be defined mathematically as follows: given two questions q1,q2 find a model that learns the function: f(q1, q2) → 0 or 1 where 0 is non-duplicate and 1 is duplicate.

# Data Analysis

Quora is a question-and-answer website where questions are asked, answered, edited, and organized by its community of users in the form of opinions. Our dataset for the project is a collection of question pairs from Quora along with their associated attributes. This dataset is readily available on Kaggle.
A brief description of the features present in our data is as follows:


| Feature              | Description                                                                                                  | Type                                                    |
|----------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| Id                   | The id of a training set question pair                                                                       | Categorical/ordinal                                     |
| qid1, qid2           | Unique ids of each question (only available in train.csv)                                                    | Categorical/ordinal                                     |
| question1, question2 | The full text of each question                                                                               | Text data eventually represented as Quantitative values |
| is_duplicate         | The target variable, set to 1 if question1 and question2 have essentially the same meaning, and 0 otherwise. | Categorical                                             |


Here’s an excerpt of the raw data being used:


| id | qid1 | qid2 | question1                                                                              | question2                                                                                  | is_duplicate |
|----|------|------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|--------------|
| 0  | 1    | 2    | What is the step by step guide to invest in share market in india?                     | What is the step by step guide to invest in share market?                                  | 0            |
| 5  | 11   | 12   | Astrology: I am a Capricorn Sun Cap moon and cap rising...what does that say about me? | I'm a triple Capricorn (Sun, Moon and ascendant in Capricorn) What does this say about me? | 1            |

## Exploratory Data Analysis:

Some of the observations made during EDA were:

We have only 290654 unique questions in question1 and 299364 unique questions in question2 features. The distribution of the labels is skewed with numbers of non duplicate question pairs being in majority. But the ratio was nothing drastic and hence resampling was not required.

Then we wanted to know what is the general distribution of the length of sentences in our dataset. By plotting a simple histogram we found that most of the questions have a length of around 25 words. This helped us decide the size of the padding for the deep learning as we needed uniform length inputs.

Since understanding the affect of sementic similarity is one of the goals of our project, we calculated the ratio of the number of common words by total length of the sentences and then compared them by our target labels. Here, we discovered that the question pairs with lower ratio tend to belong to the not duplicate (or label 0) while the higher ratio belonged to duplicate (or label 1) but there was a considerable amount of overlap in the middle.


# Preprocessing 
The following steps were taken to preprocess the data:
1. Removed stop words and every non alphanumeric characters
2. Normalized text by converting everything to lower case
3. Converted shorten words to their seperated version for example can't became cannot, she'll became she will and so on
4. Encoded the text into vectors using Glove model 
5. Padded the vectors to 25 words for deep learning
6. Performed Dimensionality Reduction using truncated SVD to convert our sentence vectors to 2 Dimensional space

# Modeling 
## Random Forest Classifier (Baseline)
## Neural Network

# Task Analysis

| Index | Domain Task                              | Analytic Task | Search Task | Analysis Task |
|-------|------------------------------------------|---------------|-------------|---------------|
| 1     | Discovering pattern in the training data | Encode        | Browse      | Discover      |
| 2     | Examine the pattern in,input queries     | Import/Derive | Lookup      | Present       |


## Task Summary

Our visualizations are primarily developed for the “Discover” and “Present” analysis task. From the dataset, we generated features from text such as vectors for the sentences, cosine similarity etc. and used PCA (truncated SVD) to visualize the data in lower dimensions. This would belong to the “Discover” consumption. 

Along with detection of duplicacy in the user input question pair, we also want the user to have a better understanding of how our machine learning models can identify the meaning of text rather than just sticking with sementic similarity.

We have a scatterplot where user can see their input questions with respect to points in our training set in 2 Dimensional space. They can then browse through the dataset by choosing the cosine similarity or model probabilities from the bins of histograms present right next to the scatterplot. 

They can then "look up" the top ten questions of each bin of histogram with the help of sankey plot where the width of each node "present" the weight by our models for the selected questions and user input.

We also present the degree of similarity between the top 10 questions with each other using a heatmap to give user a better understanding of the functionality of our ML models. 

# Design Process
As like software development process, visualization is also an iterative process, an agile process. Now we can see our top-down approach.

## Initial Sketches
![Sketches](./sketches.png)

Based on our task analysis, we try to come up with an idea to encode a text classification problem into a data visualization. 
From here, we select some sketches for the next iteration. The first sketch is very intuitive,  a scatterplot of 2-D representation of the sentence which we reduce it by doing a PCA. We also include the histogram of the probability and the heatmap for the next iteration. All of them are being used to address the task we mention earlier: discovering pattern, examine the pattern in input queries.

## Final Sketches
![Final Sketches](./final-sketches.png)

There are many feedbacks we receive during the iterations, one of them is from our instructors. The feedback was to use the histogram to filter the scatterplot. In this one, we also implement one more visual encoding: a sankey diagram. The purpose of the sankey is similar with the heatmap, the difference is the encoding, for example instead of color we use size as a channel

# Final Visualization

![scatter](./scatter.png)

1. We realized that there are occlusions on the scatterplot, therefore we need zoom. This is not the end, after we implement the zoom, we realize that we need to reset the zoom. We when we click this we will reset the zoom back, this will help with the orientation
2. We realize the point can be small, we add a visual help to guide the user where they hover. In this one, we implement Steven Braun feedback, so when you don't hover anything you will get a hand cursor, and then when you click it will change to grab cursor and if you hover to the point, it will still be default
3. Out input data: We make it bigger to give an initial clue of where the input is located on the histogram
4. Histogram of cosine similarity, which we use it for filtering: Once you click, you can filter the points
5. To address the Lookup task we then show the text when the user hover. We add one feedback from our classmate, where previously the text was hard to notice, therefore now we put it in the box
6. We can also change the number of points we want to show, we can change it to something bigger, the bigger the number the slower it gets.

![sankey](./sankey.png)

1. Here we can also filter based on the model
2. As the previous visualization, we can also filter based on the dim
3. his is the highest top 10 text in the bin
4. The band of the probability


![heatmap](./sankey.png)

1. The color is the probability: like the Sankey it is another way to encode the value
2. The triangle will move once we hover it, this will help user know where in the range the value falls

The 10 quesitions are from the selected bin as like the sankey.

In the end, we realize that a good clue from a simple Human Computer Interaction will help the user understands the plot better


## Package used

Server: 

```
nltk==3.3
numpy==1.15.4
scipy==1.1.0
Flask_RESTful==0.3.7
Keras==2.2.4
boto3==1.9.47
Flask_Cors==3.0.7
Flask==1.0.2
tqdm==4.28.1
pandas==0.23.4
tensorflow==1.13.1
boto==2.49.0
scikit_learn==0.20.3
```

Visualization:

```
d3 + (d3-sankey)
bootstrap
```

![Link to the final](http://group5-dataviz.herokuapp.com/) _Please note, the link should use http not https_



  

