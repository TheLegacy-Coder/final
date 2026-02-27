import pandas as pd

read2019SaratogaJuv = pd.read_csv("2019_Saratoga_Juveniles_ALL_STARTERS.csv")
print(read2019SaratogaJuv)

read2019SaratogaJuv["RACE_ID"] = 0

dateTracking = ""
raceTracking = 0
classTracking = ""
raceID = 1

# General statement: Also gained the intuition to use loc instead of iloc from https://stackoverflow.com/questions/50938519/trying-to-change-a-single-value-in-pandas-dataframe

for i in range(len(read2019SaratogaJuv)):
    if i == 0:
        dateTracking = read2019SaratogaJuv.loc[i, "DATE"]
        raceTracking = read2019SaratogaJuv.loc[i, "RACE"]
        classTracking = read2019SaratogaJuv.loc[i, "CLASS"]
    if ((read2019SaratogaJuv.loc[i, "DATE"] != dateTracking) or (read2019SaratogaJuv.loc[i, "RACE"] != raceTracking) or (read2019SaratogaJuv.loc[i, "CLASS"] != classTracking)):
        dateTracking = read2019SaratogaJuv.loc[i, "DATE"]
        raceTracking = read2019SaratogaJuv.loc[i, "RACE"]
        classTracking = read2019SaratogaJuv.loc[i, "CLASS"]
        raceID += 1
    # Referred to https://stackoverflow.com/questions/50938519/trying-to-change-a-single-value-in-pandas-dataframe for updating the value at the index
    read2019SaratogaJuv.loc[i, "RACE_ID"] = raceID
    print(read2019SaratogaJuv.iloc[i])

read2019SaratogaJuv.to_csv("updated_2019_Saratoga_Juveniles_ALL_STARTERS.csv")

listOfHorses = read2019SaratogaJuv["STARTER NAME"].unique()

allSpeedsAveraged = []
allTrainers = []
allSires = []
allJockeys = []
for singleHorse in listOfHorses:
    print(singleHorse)
    times = read2019SaratogaJuv[read2019SaratogaJuv["STARTER NAME"] == singleHorse]["TIME"]
    distances = read2019SaratogaJuv[read2019SaratogaJuv["STARTER NAME"] == singleHorse]["DIST"]
    trainers = read2019SaratogaJuv[read2019SaratogaJuv["STARTER NAME"] == singleHorse]["TRAINER"]
    sires = read2019SaratogaJuv[read2019SaratogaJuv["STARTER NAME"] == singleHorse]["SIRE"]
    jockeys = read2019SaratogaJuv[read2019SaratogaJuv["STARTER NAME"] == singleHorse]["JOCKEY"]
    
    summedSpeed = 0
    for singleTime, singleDist, singleTrainer, singleSire in zip(times, distances, trainers, sires):
        # Referred to https://www.w3schools.com/python/ref_string_split.asp for properly splitting the time
        timeComponentsSplit = singleTime.split(":")
        firstTimeComponent = int(timeComponentsSplit[0])*60
        secondTimeComponent = float(timeComponentsSplit[1])
        timeConverted = firstTimeComponent + secondTimeComponent
        calculatedSpeed = float(singleDist)/timeConverted
        summedSpeed += calculatedSpeed
    allSpeedsAveraged.append(summedSpeed/len(times))
    allTrainers.append(singleTrainer)
    allSires.append(singleSire)
    allJockeys.append(jockeys.unique())

# Referred to https://www.doubledtrailers.com/length-in-horse-racing/ to make sense of the units for average speed
averageSpeedsDf = pd.DataFrame({"STARTER_NAME": listOfHorses, "AVERAGE_SPEED_furlongs_a_second": allSpeedsAveraged, "TRAINERS": allTrainers, "SIRES": allSires, "JOCKEYS": allJockeys})
print(averageSpeedsDf)
averageSpeedsDf.to_csv("average_speeds.csv")

# Referred to https://stackoverflow.com/questions/34138634/pandas-groupby-how-to-get-top-n-values-based-on-a-column for grabbing the top 200 horses by speed (using nlargest)
averagedSpeedTop200 = averageSpeedsDf.nlargest(200, "AVERAGE_SPEED_furlongs_a_second")

averagedSpeedTop200.to_csv("2019_Saratoga_Juveniles_ALL_STARTERS_TOP_200_SPEED.csv")