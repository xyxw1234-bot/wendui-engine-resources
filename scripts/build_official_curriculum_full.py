#!/usr/bin/env python3
from __future__ import annotations
import json, time, re, urllib.request, urllib.error, concurrent.futures
from pathlib import Path
from datetime import datetime, timezone

OUT=Path('/opt/data/wendui_engine_work/resources/bjzx/official-curriculum.json')
RAW=Path('/opt/data/wendui_engine_work/tmp_smartedu_full')
RAW.mkdir(parents=True, exist_ok=True)
HOSTS=['https://s-file-1.ykt.cbern.com.cn','https://s-file-2.ykt.cbern.com.cn']
INDEX_PATH='/zxx/ndrs/national_lesson/teachingmaterials/version/data_version.json'
PART_PATH='/zxx/ndrs/national_lesson/teachingmaterials/{part}'
TREE_PATH='/zxx/ndrv2/national_lesson/trees/{id}.json'
DETAIL_PATH='/zxx/ndrs/national_lesson/teachingmaterials/details/{id}.json'
TAG_PATH='/zxx/ndrs/tags/national_lesson_tag.json'

def fetch(path_or_url, timeout=20):
    urls=[path_or_url] if path_or_url.startswith('http') else [h+path_or_url for h in HOSTS]
    last=None
    for url in urls:
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 curriculum-audit'})
            with urllib.request.urlopen(req,timeout=timeout) as r:
                data=r.read()
            return data,url
        except Exception as e:
            last=e
    raise last

def jfetch(path_or_url):
    data,url=fetch(path_or_url)
    return json.loads(data.decode('utf-8')),url

def pick(d,*keys):
    if not isinstance(d,dict): return None
    for k in keys:
        if k in d and d[k] not in (None,''):
            return d[k]
    return None

def walk_find_strings(o, hits=None):
    # not used in final; useful for schema drift
    return hits or []

def flatten_list(o):
    if isinstance(o,list): return o
    if isinstance(o,dict):
        for k in ['data','items','list','records','result','rows','teachingmaterials']:
            if isinstance(o.get(k),list): return o[k]
    return []

def extract_parts(ver):
    parts=[]
    def rec(o):
        if isinstance(o,dict):
            for v in o.values(): rec(v)
        elif isinstance(o,list):
            for x in o: rec(x)
        elif isinstance(o,str) and re.search(r'part_\d+\.json$',o):
            parts.append(o.split('/')[-1])
    rec(ver)
    return sorted(set(parts), key=lambda x:int(re.search(r'(\d+)',x).group(1)))

def guess_meta(m):
    title=str(pick(m,'title','name','teaching_material_name','resource_name','tm_name') or '')
    # actual meta often exists as tag_name fields; collect all strings
    vals=[]
    def rec(o):
        if isinstance(o,dict):
            for v in o.values(): rec(v)
        elif isinstance(o,list):
            for v in o: rec(v)
        elif isinstance(o,str) and 0<len(o)<80:
            vals.append(o)
    rec(m)
    txt=' '.join([title]+vals)
    stages=['小学','初中','高中']
    subjects=['语文','数学','英语','科学','物理','化学','生物学','生物','历史','地理','道德与法治','思想政治','政治','体育与健康','音乐','美术','信息科技','信息技术','劳动','艺术','日语','俄语']
    grades=['一年级','二年级','三年级','四年级','五年级','六年级','七年级','八年级','九年级','高一','高二','高三','必修','选择性必修']
    volumes=['上册','下册','全一册','必修 第一册','必修 第二册','必修 第三册','选择性必修 第一册','选择性必修 第二册','选择性必修 第三册']
    stage=pick(m,'stage','stage_name','xd','xd_name') or next((x for x in stages if x in txt),None)
    subject=pick(m,'subject','subject_name','xk','xk_name') or next((x for x in subjects if x in txt),None)
    grade=pick(m,'grade','grade_name','nj','nj_name') or next((x for x in grades if x in txt),None)
    volume=pick(m,'volume','volume_name','cebie','book','book_name') or next((x for x in volumes if x in txt),None)
    edition='新教材' if '新教材' in title or '新教材' in txt else ('旧教材' if '旧教材' in title or '旧教材' in txt else None)
    # version: rough from title between subject and grade/volume; fallback known keys
    version=pick(m,'version','version_name','bb','bb_name','publish_org_name','press')
    if not version:
        mm=re.search(r'(统编版|人教版（PEP）[^一二三四五六七八九高上下]*|人教版|北师大版|华东师大版|教科版|苏科版|冀教版|湘教版|北京版|沪科技版|青岛版|浙教版|外研版|译林版|鲁教版|粤教版|湘美版|人美版|人民音乐出版社|花城版)',txt)
        version=mm.group(1) if mm else None
    return {k:v for k,v in dict(stage=stage,subject=subject,grade=grade,volume=volume,edition=edition,version=version,title=title).items() if v}

def node_title(n):
    return str(pick(n,'title','name','node_name','label','resource_name','chapter_name') or '').strip()

def node_children(n):
    if not isinstance(n,dict): return []
    for k in ['children','child_nodes','child','nodes','subNodes','sub_nodes','list','catalogs']:
        if isinstance(n.get(k),list): return n[k]
    return []

def simplify_tree(o, depth=0, max_depth=4):
    arr=o if isinstance(o,list) else flatten_list(o)
    out=[]
    for n in arr:
        if not isinstance(n,dict): continue
        title=node_title(n)
        if not title: continue
        kids=node_children(n)
        item={'title':title}
        nid=pick(n,'id','node_id','resource_id','global_id','identifier')
        if nid: item['id']=str(nid)
        if kids and depth<max_depth:
            child=simplify_tree(kids,depth+1,max_depth)
            if child: item['children']=child
        out.append(item)
    return out

def count_nodes(nodes):
    total=0
    max_depth=0
    def rec(ns,d):
        nonlocal total,max_depth
        for n in ns:
            total+=1; max_depth=max(max_depth,d)
            rec(n.get('children',[]),d+1)
    rec(nodes,1)
    return total,max_depth

def fetch_one(m):
    mid=str(pick(m,'id','material_id','teaching_material_id','resource_id','global_id') or '')
    if not mid: return None
    meta=guess_meta(m)
    try:
        tree,tree_url=jfetch(TREE_PATH.format(id=mid))
        catalog=simplify_tree(tree)
        node_count,max_depth=count_nodes(catalog)
        if not catalog: return None
    except Exception as e:
        return {'id':mid,'error':str(e),'meta':meta}
    item={
        'id':mid,
        'title':meta.get('title') or str(pick(m,'title','name') or mid),
        **{k:v for k,v in meta.items() if k!='title'},
        'source':{'platform':'国家中小学智慧教育平台','page':'https://basic.smartedu.cn/syncClassroom','treeUrl':tree_url},
        'counts':{'nodes':node_count,'depth':max_depth,'top':len(catalog)},
        'catalog':catalog
    }
    return item

def main():
    ver,ver_url=jfetch(INDEX_PATH)
    parts=extract_parts(ver)
    if not parts:
        raise SystemExit('no part files found')
    mats=[]; part_urls=[]
    for part in parts:
        data,url=jfetch(PART_PATH.format(part=part))
        part_urls.append(url)
        rows=flatten_list(data)
        mats.extend(rows)
    # de-dup
    seen={};
    for m in mats:
        mid=str(pick(m,'id','material_id','teaching_material_id','resource_id','global_id') or '')
        if mid and mid not in seen: seen[mid]=m
    mats=list(seen.values())
    results=[]; errors=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
        futs=[ex.submit(fetch_one,m) for m in mats]
        for i,f in enumerate(concurrent.futures.as_completed(futs),1):
            r=f.result()
            if not r: continue
            if 'error' in r: errors.append(r)
            else: results.append(r)
            if i%100==0: print('progress',i,'ok',len(results),'err',len(errors), flush=True)
    # sort by stage/grade/subject/title
    order_stage={'小学':1,'初中':2,'高中':3}
    order_grade={g:i for i,g in enumerate(['一年级','二年级','三年级','四年级','五年级','六年级','七年级','八年级','九年级','高一','高二','高三','必修','选择性必修'],1)}
    results.sort(key=lambda x:(order_stage.get(x.get('stage'),9),order_grade.get(x.get('grade'),99),x.get('subject') or '',x.get('version') or '',x.get('volume') or '',x.get('edition') or '',x.get('title') or ''))
    subjects=sorted({x.get('subject') for x in results if x.get('subject')})
    stages=sorted({x.get('stage') for x in results if x.get('stage')}, key=lambda x:order_stage.get(x,9))
    grades=sorted({x.get('grade') for x in results if x.get('grade')}, key=lambda x:order_grade.get(x,99))
    out={
        'generatedAt':datetime.now(timezone.utc).isoformat(),
        'source':{
            'platform':'国家中小学智慧教育平台',
            'page':'https://basic.smartedu.cn/syncClassroom',
            'materialIndex':ver_url,
            'partUrls':part_urls,
            'treePattern':'https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/national_lesson/trees/{material_id}.json'
        },
        'counts':{'materials':len(results),'errors':len(errors),'subjects':len(subjects),'stages':len(stages),'grades':len(grades)},
        'facets':{'stages':stages,'grades':grades,'subjects':subjects},
        'materials':results,
        'errors':errors[:50]
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    (RAW/'summary.json').write_text(json.dumps({'counts':out['counts'],'facets':out['facets'],'sample':[x for x in results[:5]]},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'ok':True,'out':str(OUT),'bytes':OUT.stat().st_size,'counts':out['counts'],'facets':out['facets']},ensure_ascii=False,indent=2))
if __name__=='__main__': main()
