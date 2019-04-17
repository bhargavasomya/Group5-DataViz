---
title: Visualizing Quora Duplicate Question
layout: post
---

**Motivation:**

In order to build a high-quality knowledge base, it's important that Q&A platforms like Quora and Stack Exchange  ensure each unique question exists only once. The writers for such platforms shouldn't have to write the same answer to multiple versions of the same question, and readers should be able to find a single non-duplicate page with the question they're looking for. For example, Quora would consider questions like “What are the best ways to lose weight?”, “How can a person reduce weight?”, and “What are effective weight loss plans?” to be duplicate questions. To prevent duplicate questions from existing on such Knowledge bases, our goal is to develop machine learning and natural language processing system to automatically identify when questions with the same intent have been asked multiple times. Our visualization aims to provide users an insight into how these machine learning models perform and to provide a comparison between the duplication result of a neural network and a simple cosine similarity.

***Mathematical formulation***

Our problem of duplicate detection can be defined mathematically as follows: given two questions q1,q2 find a model that learns the function: f(q1, q2) → 0 or 1 where 0 is non-duplicate and 1 is duplicate.

**Data Analysis:**

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

**Task Analysis**

| Index | Domain Task                              | Analytic Task | Search Task | Analysis Task |
|-------|------------------------------------------|---------------|-------------|---------------|
| 1     | Discovering pattern in the training data | Encode        | Browse      | Discover      |
| 2     | Examine the pattern in,input queries     | Import/Derive | Lookup      | Present       |

Task Summary:

Our visualizations are primarily developed for the “Discover” and “Present” analysis task. From the dataset, we generated features from text such as vectors for the sentences, cosine similarity etc. and used PCA (truncated SVD) to visualize the data in lower dimensions. This would belong to the “Discover” consumption. 

Along with detection of duplicacy in the user input question pair, we also want the user to have a better understanding of how our machine learning models can identify the meaning of text rather than just sticking with sementic similarity.

We have a scatterplot where user can see their input questions with respect to points in our training set in 2 Dimensional space. They can then browse through the dataset by choosing the cosine similarity or model probabilities from the bins of histograms present right next to the scatterplot. 

They can then "look up" the top ten questions of each bin of histogram with the help of sankey plot where the width of each node "present" the weight by our models for the selected questions and user input.

We also present the degree of similarity between the top 10 questions with each other using a heatmap to give user a better understanding of the functionality of our ML models. 

Machine Learning Part (Title can be changed):

Exploratory Data Analysis:

Some of the observations made during EDA were:

We have only 290654 unique questions in question1 and 299364 unique questions in question2 features. The distribution of the labels is skewed with numbers of non duplicate question pairs being in majority. But the ratio was nothing drastic and hence resampling was not required.

Then we wanted to know what is the general distribution of the length of sentences in our dataset. By plotting a simple histogram we found that most of the questions have a length of around 25 words. This helped us decide the size of the padding for the deep learning as we needed uniform length inputs.

Since



  

