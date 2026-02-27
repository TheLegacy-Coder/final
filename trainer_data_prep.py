import pandas as pd

allData = pd.read_csv("average_speeds.csv")

trainerList = allData["TRAINERS"].unique()
horsesList = []
averageSpeedList = []

for trainer in trainerList:
    averageSpeeds = allData[allData["TRAINERS"] == trainer]["AVERAGE_SPEED_furlongs_a_second"]
    horses = allData[allData["TRAINERS"] == trainer]["STARTER_NAME"]
    speedsAvg = 0
    for averageSpeed in averageSpeeds:
        speedsAvg += averageSpeed
    
    speedsAvg /= len(averageSpeeds)
    horsesList.append(horses.unique())
    averageSpeedList.append(speedsAvg)

trainerDf = pd.DataFrame({"TRAINER": trainerList, "AVERAGE_SPEED_furlongs_a_second": averageSpeedList, "HORSES": horsesList})
trainerDf.to_csv("all_trainer_data.csv")

trainerTop10 = trainerDf.nlargest(len(trainerList), "AVERAGE_SPEED_furlongs_a_second")

trainerTop10.to_csv("trainer_sorted.csv")