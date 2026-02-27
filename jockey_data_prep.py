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
        timeSplit = time.split(":")
        speedsSum += float(distance) / ((int(timeSplit[0])*60) + float(timeSplit[1]))
    
    averageSpeedList.append(speedsSum / len(times))
    horsesList.append(horses.unique())

jockeysDf = pd.DataFrame({"JOCKEY": jockeyList, "AVERAGE_SPEED_furlongs_a_second": averageSpeedList, "HORSES": horsesList})
jockeysDf.to_csv("all_jockey_data.csv")

jockeySorted = jockeysDf.nlargest(len(jockeyList), "AVERAGE_SPEED_furlongs_a_second")

jockeySorted.to_csv("jockey_sorted.csv")
