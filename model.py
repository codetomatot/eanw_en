from ariadne import QueryType, MutationType
from googletrans import Translator
import re
import pandas as pd

t_r = Translator()

query = QueryType()
mutation = MutationType()

df = pd.DataFrame(pd.read_csv("./src/data/el_ru.csv"))
df_rew = pd.DataFrame(pd.read_csv("./src/data/nagradi.csv"))

el_ru = [{str(df.iloc[:,0][i]): str(df.iloc[:,1][i]) + str(df.iloc[:,2][i]) + str(df.iloc[:,3][i])} for i in range(0,len(df))]

def map_titles(lang_code):
    return [{"p_text": t_r.translate(df_rew.iloc[i,1], src="ru", dest=lang_code).text} if lang_code != "ru" else {"p_text": df_rew.iloc[i,1]} for i in range(0,len(df_rew))]

def mk_tr(language_code):
    el_lang = []
    for i in range(0,len(df)):
        msg = df.iloc[:,2]
        translate = t_r.translate(msg[i], src="ru", dest=language_code).text
        el_lang.append({"element": str(df.iloc[:,1][i])+str(translate)+str(df.iloc[:,3][i])})
    return el_lang

def mk_tr_rew(langauge_code):
    extra = []
    for i in range(0, len(df_rew)): #offsets of two indices
        if df_rew.iloc[i, 2] != "∅" and langauge_code != "ru": # i will be the row in which the p tags are found
            extra.append({"element": str(df_rew.iloc[i, 2])+str(t_r.translate(df_rew.iloc[i, 3], src="ru", dest=langauge_code).text)+str(df_rew.iloc[i, 4])})
        else:
            extra.append({"element": str(df_rew.iloc[i, 2])+str(df_rew.iloc[i, 3])+str(df_rew.iloc[i, 4])})
    return extra


rewards_ru = mk_tr_rew("ru")
display_titles_ru = map_titles("ru")
@query.field("ru")
def resolve_ru(_, info):
    return [{"el_ru": el_ru, "rewards_ru": rewards_ru, "dpr": display_titles_ru}]

# #en
el_en = mk_tr('en')
rewards_en = mk_tr_rew('en')
display_titles_en = map_titles("en")
@query.field("en")
def resolve_en(_,info): 
    return [{"el_en": el_en, "rewards_en": rewards_en, "dpe": display_titles_en}]

# #de
el_de = mk_tr('de')
rewards_de = mk_tr_rew('de')
display_titles_de = map_titles("de")
@query.field("de")
def resolve_de(_,info):
    return [{"el_de": el_de, "rewards_de": rewards_de, "dpd": display_titles_de}]

books = [{"type1": [{"id": 1, "title": "Fellowship of the ring"}, {"id": 2, "title": "Two Towers"}, {"id": 3, "title": "The Return of the King"}],
        "type2": [{"id": 4, "title": "The silmarillion"}],
        "type3": [{"id": 5, "title": "The fall of gondolin"}]
        }]

@query.field("books")
def resolve_book(_,info):
    return books 


