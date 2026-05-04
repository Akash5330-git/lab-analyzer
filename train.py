import pandas as pd
from sklearn.linear_model import LogisticRegression
import pickle

# load dataset
df = pd.read_csv("data.csv")

# features and labels
X = df[["hemoglobin","sugar","cholesterol","age","gender"]]
y = df["risk"]

# train model
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

# save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("done")