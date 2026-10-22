import data from './data/midterm.json';
import {bank} from './data';
import type {Exam} from './logic';
export type WrittenQuestion={id:string;kind:string;group:string;title:string;prompt:string;pages:string;answer:string;checks:string[];diagram?:string;table?:{headers:string[];rows:string[][]}};
export const writtenBank=data.questions as WrittenQuestion[];
export function shuffled<T>(items:T[],random= Math.random):T[]{const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
export function makeMidterm(minutes:number|null,now=Date.now()):Exam {
 // Aim for five per group; the existing Threads pool has four. Fill from unused questions.
 const groups=[...new Set(bank.map(q=>q.group))];
 const objective=groups.flatMap(g=>{const all=bank.filter(q=>q.group===g);const tf=shuffled(all.filter(q=>q.kind==='truefalse'))[0];return [tf,...shuffled(all.filter(q=>q.id!==tf.id)).slice(0,4)]});
 const used=new Set(objective.map(q=>q.id));
 objective.push(...shuffled(bank.filter(q=>!used.has(q.id))).slice(0,30-objective.length));
 const written=['Theory','Diagram','Scenario','Calculation'].map(k=>shuffled(writtenBank.filter(q=>q.kind===k))[0].id);
 return {id:`midterm-${now}`,ids:[...shuffled(objective).map(q=>q.id),...written],choices:{},written:{},start:now,end:minutes===null?null:now+minutes*60000,submitted:false,kind:'Midterm-style practice'};
}
