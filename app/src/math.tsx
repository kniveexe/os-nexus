import katex from 'katex';
import {useMemo} from 'react';
export function Equation({tex,block=false}:{tex:string;block?:boolean}) {
 const html=useMemo(()=>katex.renderToString(tex,{displayMode:block,output:'mathml',throwOnError:false,trust:false,strict:'warn'}),[tex,block]);
 return <span className={block?'equation equation-block':'equation'} dangerouslySetInnerHTML={{__html:html}}/>;
}
// Only explicitly marked formulas are typeset. Shell commands and normal prose remain text.
export function RichText({text}:{text:string}){return <>{text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g).map((s,i)=>s.startsWith('$$')?<Equation key={i} tex={s.slice(2,-2)} block/>:s.startsWith('$')&&s.endsWith('$')?<Equation key={i} tex={s.slice(1,-1)}/>:s)}</>}
const formulas:Record<string,{title:string;tex:string;note:string}[]>={
 'memory-protection':[{title:'Physical address range (limit is a size)',tex:'B \\le a < B+L',note:'B = base, L = length, a = physical address. The last valid address is B + L − 1.'},{title:'Logical offset and relocation',tex:'0 \\le x < L,\\qquad a=B+x',note:'Do not compare a physical address directly with a length.'}],
 'parallelism-amdahl':[{title:'Amdahl’s law',tex:'\\mathrm{Speedup}(N)=\\frac{1}{S+\\frac{1-S}{N}}',note:'S = serial fraction of original runtime; N = equal cores. Assumes a fixed workload and no added overhead.'},{title:'Worked substitution',tex:'\\mathrm{Speedup}(4)=\\frac{1}{0.5+\\frac{0.5}{4}}=1.6',note:'50% serial work, four cores. The ideal limit as N grows is 1/S = 2.'}],
 'scheduling-metrics':[{title:'Turnaround time',tex:'TT_i=CT_i-AT_i',note:'Time from arrival until final completion.'},{title:'Waiting time',tex:'WT_i=TT_i-BT_i',note:'Applies to these single CPU-burst problems with no I/O. Waiting means time in Ready.'},{title:'Response time',tex:'RT_i=ST_i-AT_i',note:'ST is the first CPU start, not a later resumption.'},{title:'Average across n processes',tex:'\\overline{TT}=\\frac{\\sum_{i=1}^{n} TT_i}{n}',note:'Use the same averaging method for WT and RT.'},{title:'CPU utilization',tex:'U=\\frac{T_{\\mathrm{busy}}}{T_{\\mathrm{elapsed}}}\\times100\\%',note:'Keep idle intervals in the elapsed-time denominator.'}],
 'multicore-realtime':[{title:'Interrupt-to-task timeline',tex:'T_{\\mathrm{total}}=L_{\\mathrm{interrupt}}+T_{\\mathrm{ISR}}+L_{\\mathrm{dispatch}}',note:'Theo Exercise 5-12: 2 + 3 + 3 = 8 ms. Do not omit time spent executing the ISR.'}],
 'boot-sequence':[{title:'Timer counter (OS timer example)',tex:'\\mathrm{ticks}=\\mathrm{seconds}\\times\\mathrm{frequency\\ (Hz)}',note:'A 3-second interval at 1,000 Hz requires 3,000 ticks. This is the scheduling timer, distinct from the real-time clock.'}]
};
export function FormulaGuide({id}:{id:string}){const items=formulas[id];return items?<section className="formula-guide"><h2>Equations & symbols</h2>{items.map(x=><div className="formula-card" key={x.title}><strong>{x.title}</strong><Equation tex={x.tex} block/><p>{x.note}</p></div>)}</section>:null}
const givenData:Record<string,{headers:string[];rows:(string|number)[][]}>={
 'GEN-06':{headers:['Given','Value'],rows:[['Base',6000],['Limit (length)',800]]},
 'GEN-11':{headers:['Given','Value'],rows:[['Serial fraction','25% = 0.25'],['Parallel fraction','75% = 0.75'],['Equal CPU cores',2],['Extra overhead',0]]},
 'GEN-12':{headers:['Process','Arrival','CPU burst'],rows:[['P1',0,6],['P2',0,2],['P3',0,4]]},
 'GEN-13':{headers:['Process','Arrival','CPU burst'],rows:[['P1',0,6],['P2',0,2],['P3',0,4]]},
 'GEN-14':{headers:['Process','Arrival','CPU burst'],rows:[['P1',0,5],['P2',0,3],['Quantum','—',2]]},
 'GEN-29':{headers:['Process','Arrival','CPU burst'],rows:[['P1',0,8],['P2',1,3]]},
 'PA2-07':{headers:['Given','Value'],rows:[['Base',4000],['Limit (length)',1200],['Addresses to check','4200, 5100, 5500']]}
};
export function QuestionData({id}:{id:string}){const d=givenData[id];return d?<div className="table-scroll question-data"><table><caption>Given values</caption><thead><tr>{d.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{d.rows.map((r,i)=><tr key={i}>{r.map((v,j)=>j===0?<th key={j} scope="row">{v}</th>:<td key={j}>{v}</td>)}</tr>)}</tbody></table></div>:null}
