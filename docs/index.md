---
title: Visualizing Quora Duplicate Question
layout: post
---

**Motivation:**

**Data Summary:**

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

