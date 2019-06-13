
# coding: utf-8

# In[371]:


#import packages

import numpy as np
import csv #using csv module is much more efficient
import json
import os 
import pandas as pd
from pprint import pprint


# In[409]:


import numpy as np
import csv #using csv module is much more efficient
import json
import os 
import pandas as pd
from pprint import pprint
#print(dir(csv))


path = "borda4.csv"
csvfile = open(path,newline='')
csvreader =csv.reader(csvfile)

#header line
candidates = np.array(next(csvreader)) # read the header line

#  ['Voter', 'Nathalie Arthaud', 'François Asselineau', 'Jacques Cheminade', 'Nirowas Dupont-Aignan', 
#   'François Fillon', 'Benoît Hamon', 'Jean Lassalle', 'Marine Le Pen', 'Emmanuel Macron', 
#   'Jean-Luc Mélenchon', 'Philippe Poutou', 'official_vote']

# print(header)
csvdata = []
# reading the data
for row in csvreader:
    #  NOTE: csvdata.append(row) before addingto the list we need to convert them their proper datatype

    voter = row[0].replace('Voter ','')
    NA  = float (row[1] or  0)
    FA  = float(row[2] or 0) 
    JC  = float(row[3] or 0)
    NDA = float(row[4] or 0) 
    FF  = float(row[5] or 0) 
    BH  = float(row[6] or 0) 
    JL  = float(row[7] or 0 ) 
    MLP = float(row[8] or 0) 
    EM  = float(row[9] or 0)
    JLM = float(row[10] or 0 )      
    PP  = float(row[11] or 0) 
    OV  = row[12].strip() 
    
    csvdata.append([voter,NA,FA,JC,NDA,FF,BH,JL,MLP, EM,JLM, PP, OV])
    

# print(header)
# print(csvdata) #This is a list

d = np.array(csvdata)
# d = d[:, 1:-1]
# print((d))

# print(d)
dicdata={}

#here we count the number of voters for each candidates who are been scored 
def count_nonzeroelement(array):
    return np.count_nonzero( array.astype(float) )

def return_nonzeroelement(array):
      return [x for x in array.astype(float) if x > 0]
    
#We create a Json data type correspondint to our data
dicdata ={'candidates': []}
for idx, candidate  in enumerate(candidates[1:11] ,1 ):
    
    keys = ["Name", "ArrayOfScores", "NofVoters4each", "TScores"]
    nonzerosscores = return_nonzeroelement(d[:,idx])
    values = [candidate,nonzerosscores , len(nonzerosscores),np.sum(nonzerosscores) ]
    tmp = dict(zip( keys,values))
    
    #tmp["ArrayOfScores"] = return_nonzeroelement(d[:,idx])
#     tmp["ArrayOfScores"] = return_nonzeroelement(d[:,idx]),
#     tmp["NofVoters4each"] = len(tmp["ArrayOfScores"])
#     tmp["SumOfScores"] =  np.sum(tmp["ArrayOfScores"]) #sum up the scores
#     dic["Normalized1234"] = [x-7 for x in dic["ArrayOfScores"] ] 
    dicdata['candidates'].append(tmp)

#     pprint(dicdata)    
    


with open('borda4.json', 'w') as json_file:
    json.dump(dicdata, json_file, indent = 4)
    json_file.close()
    
     

# # dicdata1 = json.dumps(dicdata,indent = 4)
# # jsonbordajson = json.loads(dicdata1)

# # pprint(jsonCandidates)
with open('borda4.json', 'r') as my_data_file: 
        jsondata = json.load(my_data_file)
#         pprint(jsondata)
        my_data_file.close()
    
#parsing over the json data   
for p in jsondata['candidates']:
    my_string = "  Name = {} <=> Total_Score =  {} <=> NumberOfVoters = {} "

    print(my_string.format(p['Name'], p['TScores'], p['NofVoters4each']))
# print(jsondata['candidates'])


# In[ ]:





# In[230]:


for c in jsonCandidates:
    pprint(c)    
     
# print(type(candidates))
# print("typeof d= ", type(d))

# print(type("type of csvdatat = ", csvdata))

# float(s)
# print( s.replace(' ', ''))


# In[66]:


from pprint import pprint
   
data1 =    {
   "firstName": "Jane",
   "lastName": "Doe",
   "hobbies": ["running", "sky diving", "singing"],
   "age": 35,
   "children": [
       {
           "firstName": "Alice",
           "age": 6
       },
       {
           "firstName": "Bob",
           "age": 8
       }
   ]
}

data = {
'name' : 'ACME',
'shares' : 100,
'price' : 542.23
}
json_str = json.dumps(data, indent=4) #to be nocely formatted

json_str = json.loads(json_str)

json_str["name":"price"]


# In[249]:



x = np.array( [ 2,3,4.6])

x.astype(int)
# my_json_string = json.dumps(my_list)
# my_json_string

