import json


def calculate(distance):
    return round(-0.237035714285714 * distance + 1001.46547619048)


def rep_string(mil, distance):
    return f"{distance[0]} - {distance[1]}: {mil}"


data = {}
crr = 0

for i in range(100, 1601):
    res = calculate(i)
    if res != crr:
        data[res] = [i, 0]
        crr = res
        if res + 1 in data:
            data[res + 1][1] = i - 1

data[622][1] = 1600

meta = {}

for i in data:
    section = int(str(data[i][0])[:-2]) * 100
    if section not in meta:
        meta[section] = []
    start = data[i][0]
    end = data[i][1]
    if end >= section + 100:
        meta[section].append([i, [start, section + 99]])
        meta[section + 100] = [[i, [section + 100, end]]]
    else:
        meta[section].append([i, data[i]])

del meta[1600]
meta[1500][-1][1][1] = 1600

refined = {}
crr = 0
for section in meta:
    refined[section] = [[]] * 4
    for subsection in range(4):
        # [start, end, [[mil, points], [mil, points]]]
        refined[section][subsection] = [[]] * 5
        for j in range(5):
            start = section + subsection * 25 + j * 5
            end = section + subsection * 25 + (j + 1) * 5

            # get the mils associated with these distances
            mils = [calculate(start + i) for i in range(5)]
            loop = sorted(set(mils), key=mils.index)

            calc = [[mil, mils.count(mil)] for mil in loop]

            refined[section][subsection][j] = [start, end, calc]


print(json.dumps(refined))


for ran in refined:
    print(f"Range: {ran}")
    for sec in refined[ran]:
        for val in sec:
            print(f"{val[0]} - {val[1]}: {val[2]}")
        print()


for section in meta:
    print(section)
    for entry in meta[section]:
        print(rep_string(entry[0], entry[1]))
