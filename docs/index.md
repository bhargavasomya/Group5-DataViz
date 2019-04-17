---
title: Visualizing Quora Duplicate Question
author: Anak Agung Ngurah Bagus Trihatmaja, Shishir Kurhade, Somya Bhargava, Sriram Jayaraman
layout: post
---

# Motivation

In order to build a high-quality knowledge base, it's important that Q&A platforms like Quora and Stack Exchange  ensure each unique question exists only once. The writers for such platforms shouldn't have to write the same answer to multiple versions of the same question, and readers should be able to find a single non-duplicate page with the question they're looking for. For example, Quora would consider questions like “What are the best ways to lose weight?”, “How can a person reduce weight?”, and “What are effective weight loss plans?” to be duplicate questions. To prevent duplicate questions from existing on such Knowledge bases, our goal is to develop machine learning and natural language processing system to automatically identify when questions with the same intent have been asked multiple times. With the help of this project, we wanted our users to develop a deeper understanding of how these models work. Our aim is to address the issue that sometimes the sentences with considerable sementic similarity may not have the exact same meaning. 

# Data Summary

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

# Model Description

# Design Process

# Final Visualization

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
vanilla js
d3 + (d3-sankey)
bootstrap
```

![Link to the final](http://group5-dataviz.herokuapp.com/) _Please note, the link should use http not https_

# Conclusion
