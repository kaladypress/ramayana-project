import re
d=open('scratch/v18s.htm',encoding='utf8',errors='replace').read()
ps=re.findall(r'<p class="SanSloka">\s*([^<]*?)<br>\s*(.*?)\|\|\s*१-१८-([०-९]+)',d,re.S)
tr=str.maketrans('०१२३४५६७८९','0123456789')
out=[(int(n.translate(tr)),a.strip(),b.strip()) for a,b,n in ps]
print('site verses',len(out))
open('scratch/v18-valmiki.txt','w',encoding='utf8').write(''.join(f'{n}.\n{a}\n{b} ||\n\n' for n,a,b in out))
lines=[l.strip() for l in open('source/devanagari/bala-kanda/sarga-018.txt',encoding='utf8').read().split('\n')]
lv={}
for i,l in enumerate(lines):
    m=re.match(r'^(\d+)\.$',l)
    if m: lv[int(m.group(1))]=lines[i+1]
print('local verses',len(lv))
norm=lambda s:re.sub(r'[\s|।॥]','',s)
for n,a,b in out:
    hit=[k for k,v in lv.items() if norm(v)==norm(a)]
    print(n,hit,end='; ')

