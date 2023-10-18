from ariadne import QueryType, MutationType
from googletrans import Translator
from threading import Thread
import time
import pandas as pd
from httpcore import SyncHTTPProxy
import requests
from httpcore import ReadTimeout, ConnectError, ConnectTimeout

#https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=en&q=bonjour

t_r = Translator()

query = QueryType()
mutation = MutationType()

# df = pd.DataFrame(pd.read_csv("./src/data/el_ru.csv"))
df = pd.DataFrame(pd.read_csv("./src/data/elements_list.csv"))
df_rew = pd.DataFrame(pd.read_csv("./src/data/nagradi.csv"))

el_ru = [{"element": str(df.iloc[:,1][i]) + str(df.iloc[:,2][i]) + str(df.iloc[:,3][i])} for i in range(0,len(df))]

class ThreadValue(Thread):
    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}):
        Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)

    def join(self, *args):
        Thread.join(self, *args)
        return self._return
    


def mk_tr(language_code):
    el_lang = []
    for i in range(0,len(df)):
        # if df.iloc[i,1]:
        msg = df.iloc[:,2]
        translate = t_r.translate(msg[i], dest=language_code, src="ru").text
        t_r.raise_exception = True
        el_lang.append({"element": str(df.iloc[:,1][i])+str(translate)+str(df.iloc[:,3][i])})
    return el_lang




def run_threads_preserve(lc):
    while True:
        try:
            output_collect = []
            x = ThreadValue(target=mk_tr, args=(lc,))
            x.start()
            output_collect.append(x.join())
            y = ThreadValue(target=mk_tr_rew, args=(lc,))
            y.start()
            output_collect.append(y.join())
            z = ThreadValue(target=map_titles, args=(lc,))
            z.start()
            output_collect.append(z.join())
            return output_collect
        except (ReadTimeout, ConnectError, ConnectTimeout) as err:
            print("error in thread: translation did not complete")
        break


preload = []
ent = ThreadValue(target=run_threads_preserve, args=("en",))
ent.start()
preload.append(ent.join())
det = ThreadValue(target=run_threads_preserve, args=("de",))
det.start()
preload.append(det.join())
# for transtype in preload[1]:
#     if transtype == None:
#         print("thread error: rerunning...")
#         preload.clear()

@query.field("ru")
def resolve_ru(_, info):
    return [{"el_ru": el_ru, "rewards_ru": mk_tr_rew("ru"), "dpr": map_titles("ru")}]


# @query.field("en")
# def resolve_en(_,info):
#     return [{"el_en": preload[0][0], "rewards_en": preload[0][1], "dpe": preload[0][2]}]

# # print(preload)

# @query.field("de")
# def resolve_de(_,info):
#     return [{"el_de": preload[1][0], "rewards_de": preload[1][1], "dpd": preload[1][2]}]

books = [{"type1": [{"id": 1, "title": "Fellowship of the ring"}, {"id": 2, "title": "Two Towers"}, {"id": 3, "title": "The Return of the King"}],
        "type2": [{"id": 4, "title": "The silmarillion"}],
        "type3": [{"id": 5, "title": "The fall of gondolin"}]
        }]

@query.field("books")
def resolve_book(_,info):
    return books 

