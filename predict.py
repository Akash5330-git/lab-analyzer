import sys
import pickle

# read input values
values = list(map(float, sys.argv[1:]))

# load model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# predict
prediction = model.predict([values])[0]

print(int(prediction))