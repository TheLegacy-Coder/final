import pandas as pd
import matplotlib.pyplot as plt

read2019SaratogaJuv = pd.read_csv("2019_Saratoga_Juveniles_ALL_STARTERS.csv")
print(read2019SaratogaJuv)

# Referred to https://www.statology.org/pandas-plot-value-counts/ for calling .plot() on value_counts()
# Also referred to https://stackoverflow.com/questions/32244019/how-to-rotate-x-axis-tick-labels-in-a-pandas-plot for rotating the axis labels

surfaceCounts = read2019SaratogaJuv["SURF"].value_counts()
print(surfaceCounts)
surfaceCounts.plot(kind="bar", rot=0)
plt.title("Horse Race Surface Distribution")
plt.xlabel("Surface Type")
plt.ylabel("Count")
plt.show()

distanceCounts = read2019SaratogaJuv["DIST"].value_counts()
print(distanceCounts)
distanceCounts.plot(kind="bar", rot=0)
plt.title("Horse Race Distance Distribution")
plt.xlabel("Distance Category")
plt.ylabel("Measure")
plt.show()