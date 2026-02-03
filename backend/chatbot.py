import pandas as pd

faq = pd.read_csv("data/plant_faq.csv")

def get_answer(question):
    q = question.lower()
    for _, row in faq.iterrows():
        if row["question"].lower() in q:
            return row["answer"]
    return None
