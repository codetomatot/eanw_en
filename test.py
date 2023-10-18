import pandas as pd
import numpy as np
import requests
import multiprocessing
import time

df = pd.DataFrame(pd.read_csv("./src/data/elements_list_w.csv"))
df_rew = pd.DataFrame(pd.read_csv("./src/data/nagradi_w.csv"))

# nan_text = [df.iloc[i,j] for i,j in zip(*np.where(pd.isnull(df_rew)))]

el_ru = [{"element": str(df.iloc[:,1][i]) + str(df.iloc[:,2][i]) + str(df.iloc[:,3][i])} for i in range(0,len(df))]

def map_titles(lang_code):
  return [{"p_text": requests.get("https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=ru&tl="+str(lang_code)+"&q="+str(df_rew.iloc[i,1])).content.decode().strip(']""[')} if lang_code != "ru" else {"p_text": str(df.iloc[i,1])} for i in range(0,len(df_rew))]

def mk_tr(language_code):
    el_lang = []
    for i in range(0,len(df)):
        msg = df.iloc[i,2]
        if msg != "":
          translate = requests.get("https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=ru&tl="+str(language_code)+"&q="+str(msg))
          el_lang.append({"element": str(df.iloc[:,1][i])+str(translate.content.decode().strip(']""['))+str(df.iloc[:,3][i])})
    return el_lang
def mk_tr_rew(language_code):
    extra = []
    for i in range(0,len(df_rew)):
        if df_rew.iloc[i,2] != "∅":
            we = requests.get("https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=ru&tl="+str(language_code)+"&q="+str(df_rew.iloc[i,3]))
            extra.append({"element": str(df_rew.iloc[i,2])+str(we.content.decode().strip(']""['))+str(df_rew.iloc[i,4])})
        else:
            extra.append({"element": str(df_rew.iloc[i,2])})
    return extra

#english thread
class Process(multiprocessing.Process):
    def __init__(self, id):
      super(Process, self).__init__()
      self.id = id
    def run(self):
      time.sleep(1)
      print(f"rnning thread {self.id}")

args = ["en", "de"]
def pool_create(func):
   new_pool = multiprocessing.Pool(processes=2)
   output = new_pool.map_async(func, args)
   if len(output.get()) != 0:
      new_pool.close()
      return output.get()

print(pool_create(map_titles))