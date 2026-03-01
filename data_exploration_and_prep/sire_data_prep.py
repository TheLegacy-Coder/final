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

listOfSires = read2019SaratogaJuv["SIRE"].unique()

allSpeedsAveragedForSire = []
allOffspring = []
for singleSire in listOfSires:
    print(singleSire)
    horseNames = read2019SaratogaJuv[read2019SaratogaJuv["SIRE"] == singleSire]["STARTER NAME"]
    times = read2019SaratogaJuv[read2019SaratogaJuv["SIRE"] == singleSire]["TIME"]
    distances = read2019SaratogaJuv[read2019SaratogaJuv["SIRE"] == singleSire]["DIST"]
    
    summedSpeed = 0
    for singleHorse, singleTime, singleDist in zip(horseNames, times, distances):
        # Referred to https://www.w3schools.com/python/ref_string_split.asp for properly splitting the time
        timeComponentsSplit = singleTime.split(":")
        firstTimeComponent = int(timeComponentsSplit[0])*60
        secondTimeComponent = float(timeComponentsSplit[1])
        timeConverted = firstTimeComponent + secondTimeComponent
        calculatedSpeed = float(singleDist)/timeConverted
        summedSpeed += calculatedSpeed
    allSpeedsAveragedForSire.append(summedSpeed/len(times))
    allOffspring.append(horseNames.unique())
    
# Referred to https://www.doubledtrailers.com/length-in-horse-racing/ to make sense of the units for average speed
averageSpeedsForSireDf = pd.DataFrame({"SIRE": listOfSires, "AVERAGE_SPEED_furlongs_a_second": allSpeedsAveragedForSire, "OFFSPRING": allOffspring})
# Referred to https://github.com/huggingface/datasets/issues/6778 for getting correct list format in CSV for jockeys
averageSpeedsForSireDf["OFFSPRING"] = averageSpeedsForSireDf["OFFSPRING"].apply(lambda arr: list(arr))
print(averageSpeedsForSireDf)

# Initially referred to https://stackoverflow.com/questions/34138634/pandas-groupby-how-to-get-top-n-values-based-on-a-column for grabbing the top 10 sires based on their average horse speeds (using nlargest)
# Then, used it just for sorting
averagedSpeedForSireSorted = averageSpeedsForSireDf.nlargest(len(listOfSires), "AVERAGE_SPEED_furlongs_a_second")

averagedSpeedForSireSorted.to_csv("2019_Saratoga_Juveniles_ALL_STARTERS_SPEED_FOR_SIRE.csv")