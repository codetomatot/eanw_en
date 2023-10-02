from googletrans import Translator
import pandas as pd

df_rew = pd.DataFrame(pd.read_csv("./src/data/nagradi.csv"))
# print(df.iloc[:,1]) # second index is for column number
# print(str(df.iloc[:,1][0])+str(df.iloc[:,2][0]))
t_r = Translator()

print(df_rew.iloc[:, 1].head())
# el_ru = [{str(df.iloc[:,0][i]): str(df.iloc[:,1][i]) + str(df.iloc[:,2][i]) + str(df.iloc[:,3][i])} for i in range(0,len(df))]

# def mk_tr(language_code):
#     el_lang = []
#     for i in range(0,len(df)):
#         msg = df.iloc[:,2]
#         translate = t_r.translate(msg[i], src="ru", dest=language_code).text
#         el_lang.append({"element": str(df.iloc[:,1][i])+str(translate)+str(df.iloc[:,3][i])})
#     return el_lang

# print(mk_tr("en"))

def map_titles(lang_code):
    return [t_r.translate(df_rew.iloc[i,1], src="ru", dest=lang_code).text for i in range(0,len(df_rew))]
print(map_titles("en"))

def mk_tr_rew(langauge_code):
    extra = []
    for i in range(0, len(df_rew)): #offsets of two indices
        if df_rew.iloc[i, 2] != "∅": # i will be the row in which the p tags are found
            extra.append({"element": str(df_rew.iloc[i, 2])+str(t_r.translate(df_rew.iloc[i, 3], src="ru", dest=langauge_code).text)+str(df_rew.iloc[i, 4])})
    return extra

# print(mk_tr_rew("en"))