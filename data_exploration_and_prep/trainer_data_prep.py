import pandas as pd

allData = pd.read_csv("data/average_speeds.csv")

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

# Referred to https://www.doubledtrailers.com/length-in-horse-racing/ to make sense of the units for average speed
trainerDf = pd.DataFrame({"TRAINER": trainerList, "AVERAGE_SPEED_furlongs_a_second": averageSpeedList, "HORSES": horsesList})
# Referred to https://github.com/huggingface/datasets/issues/6778 for getting correct list format in CSV for jockeys
trainerDf["HORSES"] = trainerDf["HORSES"].apply(lambda arr: list(arr))

trainerDf.to_csv("data/all_trainer_data.csv")

# Initially referred to https://stackoverflow.com/questions/34138634/pandas-groupby-how-to-get-top-n-values-based-on-a-column for grabbing the top 10 sires based on their average horse speeds (using nlargest)
# Then, used it just for sorting
trainerTop10 = trainerDf.nlargest(len(trainerList), "AVERAGE_SPEED_furlongs_a_second")

trainerTop10.to_csv("data/trainer_sorted.csv")