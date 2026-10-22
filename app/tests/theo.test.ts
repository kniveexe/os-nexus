import {describe,it,expect} from 'vitest';
import {schedule,scheduleCases} from '../src/scheduling';
import curriculum from '../src/data/curriculum.json';
import assessments from '../src/data/assessments.json';
import assignments from '../src/data/assignments.json';
import theo from '../src/data/theo.json';
import katex from 'katex';
describe('Theo slide scheduling answers',()=>{
 for(const c of scheduleCases)it(c.title,()=>{
  const r=schedule(c);r.averages.forEach((n,i)=>expect(n).toBeCloseTo(c.expected[i],6));
  for(const m of r.metrics){expect(r.segments.filter(s=>s.id===m.id).reduce((n,s)=>n+s.end-s.start,0)).toBe(m.burst);expect(m.response).toBeLessThanOrEqual(m.waiting);expect(m.waiting).toBeGreaterThanOrEqual(0)}
  r.segments.forEach((s,i)=>{expect(s.end).toBeGreaterThan(s.start);if(i)expect(s.start).toBe(r.segments[i-1].end);if(s.id!=='Idle')expect(s.start).toBeGreaterThanOrEqual(c.jobs.find(j=>j.id===s.id)!.arrival)})
 });
 it('enqueues boundary arrivals before an expired RR process',()=>{const r=schedule(scheduleCases.find(c=>c.id==='5-4')!);expect(r.segments.map(s=>s.id)).toEqual(['P1','P2','P3','P1','P4','P5','P2','P3','P1','P4','P3'])});
 it('keeps the running process on equal remaining time',()=>{const r=schedule(scheduleCases.find(c=>c.id==='srt-2')!);expect(r.segments.find(s=>s.start===3)).toEqual({id:'P2',start:3,end:6})});
});
it('typesets every content formula without errors',()=>{
 const text=JSON.stringify([curriculum,assessments,assignments,theo]);
 const strings: string[]=[];function walk(v:unknown){if(typeof v==='string')strings.push(v);else if(v&&typeof v==='object')Object.values(v).forEach(walk)}walk([curriculum,assessments,assignments,theo]);
 let count=0;for(const s of strings)for(const part of s.match(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g)??[]){const tex=part.startsWith('$$')?part.slice(2,-2):part.slice(1,-1);if(tex.includes('PID')||tex.includes('?'))continue;expect(()=>katex.renderToString(tex,{throwOnError:true,trust:false})).not.toThrow();count++}
 expect(count).toBeGreaterThan(10);expect(text.length).toBeGreaterThan(1000);
});
