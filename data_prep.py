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