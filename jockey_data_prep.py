import pandas as pd

allData = pd.read_csv("2019_Saratoga_Juveniles_ALL_STARTERS.csv")

jockeyList = allData["JOCKEY"].unique()
horsesList = []
averageSpeedList = []

for jockey in jockeyList:
    distances = allData[allData["JOCKEY"] == jockey]["DIST"]
    times = allData[allData["JOCKEY"] == jockey]["TIME"]
    horses = allData[allData["JOCKEY"] == jockey]["STARTER NAME"]

    speedsSum = 0
    for distance, time in zip(distances, times):
        # Referred to https://www.w3schools.com/python/ref_string_split.asp for properly splitting the time
        timeSplit = time.split(":")
        speedsSum += float(distance) / ((int(timeSplit[0])*60) + float(timeSplit[1]))
    
    averageSpeedList.append(speedsSum / len(times))
    horsesList.append(horses.unique())

# Referred to https://www.doubledtrailers.com/length-in-horse-racing/ to make sense of the units for average speed
jockeysDf = pd.DataFrame({"JOCKEY": jockeyList, "AVERAGE_SPEED_furlongs_a_second": averageSpeedList, "HORSES": horsesList})
# Referred to https://github.com/huggingface/datasets/issues/6778 for getting correct list format in CSV for jockeys
jockeysDf["HORSES"] = jockeysDf["HORSES"].apply(lambda arr: list(arr))
jockeysDf.to_csv("all_jockey_data.csv")

# Initially referred to https://stackoverflow.com/questions/34138634/pandas-groupby-how-to-get-top-n-values-based-on-a-column for grabbing the top 10 sires based on their average horse speeds (using nlargest)
# Then, used it just for sorting
jockeySorted = jockeysDf.nlargest(len(jockeyList), "AVERAGE_SPEED_furlongs_a_second")

jockeySorted.to_csv("jockey_sorted.csv")
