import re
d=open('scratch/valmiki-cache/bala-kanda-018.htm',encoding='utf8').read()
for n in (8,11,18,19,21,22,34,35,50,51,53,54):
    i=d.find('name="Verse%d"'%n)
    print('=====',n,i)
    if i>0:
        seg=d[i:i+1600]
        seg=re.sub(r'<audio.*?</audio>','',seg,flags=re.S)
        print(seg[:650])

