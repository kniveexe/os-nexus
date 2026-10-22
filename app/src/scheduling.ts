export type Algorithm='FCFS'|'SJF'|'Priority'|'RR'|'SRT'|'Preemptive Priority';
export type Job={id:string;arrival:number;burst:number;priority:number};
export type Segment={id:string;start:number;end:number};
export type ScheduleCase={id:string;title:string;algorithm:Algorithm;quantum:number;jobs:Job[];expected:number[];note:string};
function example(id:string,title:string,algorithm:Algorithm,rows:number[][],expected:number[],note:string,quantum=3):ScheduleCase{return {id,title,algorithm,quantum,jobs:rows.map((r,i)=>({id:`P${i+1}`,arrival:r[0],burst:r[1],priority:r[2]??0})),expected,note}}
export const scheduleCases:ScheduleCase[]=[
 example('5-1','Exercise 5-1 · FCFS','FCFS',[[0,7],[2,4],[4,6],[5,3],[8,5]],[12.2,7.2,7.2],'A short job can wait behind a long one: the convoy effect.'),
 example('fcfs-1','FCFS · initial idle time','FCFS',[[2,5],[3,3],[4,1],[6,4]],[7,3.75,3.75],'No process has arrived before time 2. Draw the idle interval.'),
 example('fcfs-2','FCFS · idle gap in the middle','FCFS',[[1,4],[3,2],[10,3],[11,2],[12,1]],[3.8,1.4,1.4],'The CPU is idle from 7 to 10. P3 does not wait before it arrives.'),
 example('5-2','Exercise 5-2 · SJF','SJF',[[0,9],[1,5],[3,2],[5,7],[6,4]],[13.4,8,8],'At time 0 only P1 is available; later shorter arrivals do not preempt it.'),
 example('sjf-1','SJF · shortest ready job','SJF',[[1,6],[2,8],[3,2],[4,3]],[9.5,4.75,4.75],'At time 7, compare bursts only among processes that have arrived.'),
 example('sjf-2','SJF · breaking a tie','SJF',[[2,3],[3,7],[4,4],[5,4],[6,2]],[8.4,4.4,4.4],'At time 5, P3 and P4 both need 4. Earlier arrival P3 wins.'),
 example('5-3','Exercise 5-3 · non-preemptive priority','Priority',[[0,6,3],[2,4,1],[3,7,4],[5,3,2],[7,5,5]],[11.4,6.4,6.4],'Priority 1 is highest, but P2 must wait until P1 finishes.'),
 example('priority-1','Priority · better arrival must wait','Priority',[[1,4,3],[2,3,1],[3,5,4],[4,2,2]],[7,3.5,3.5],'A higher-priority arrival cannot preempt in this algorithm.'),
 example('priority-2','Priority · equal priorities','Priority',[[3,5,2],[4,2,4],[5,3,1],[6,4,3],[7,2,1]],[8.6,5.4,5.4],'P3 and P5 tie on priority; earlier arrival P3 runs first. A finite long wait illustrates starvation risk, not actual infinite starvation.'),
 example('5-4','Exercise 5-4 · Round Robin','RR',[[0,8],[1,5],[2,7],[4,4],[6,3]],[20.6,15.2,4.6],'At time 6, new arrival P5 joins before P2 is requeued. Keep the ready queue in order.'),
 example('rr-1','Round Robin · quantum 2','RR',[[1,5],[2,3],[4,2],[5,4]],[9.25,5.75,2],'At time 5, P4 arrives before P2 is requeued.',2),
 example('rr-2','Round Robin · quantum 3','RR',[[2,6],[3,4],[5,2],[6,5]],[10.75,6.5,3],'At time 5, P3 joins before P1 is requeued.'),
 example('5-5','Exercise 5-5 · shortest remaining time','SRT',[[0,10],[2,4],[3,2],[5,6],[7,3]],[9.8,4.8,1.4],'Compare remaining work, not original bursts. P1 starts immediately but waits 15 units in total.'),
 example('srt-1','SRT · two successive preemptions','SRT',[[1,7],[2,4],[3,1],[5,3]],[6.5,2.75,0.5],'At time 2, P2 preempts P1; at time 3, P3 preempts P2.'),
 example('srt-2','SRT · equal remaining times','SRT',[[2,6],[3,3],[5,1],[6,4],[12,2]],[5.6,2.4,0.4],'At time 5, P3 and the running P2 each need 1. Equality does not preempt P2.'),
 example('5-6','Exercise 5-6 · preemptive priority','Preemptive Priority',[[0,9,5],[2,5,3],[4,3,1],[6,4,2],[8,6,4]],[11.8,6.4,1.4],'P2 preempts P1, then P3 preempts P2. A smaller priority number wins.'),
 example('preemptive-1','Preemptive priority · urgent arrival','Preemptive Priority',[[1,5,3],[2,3,1],[3,2,4],[4,4,2]],[8,4.5,2.75],'P2 preempts P1 at time 2. P4 later waits until the higher-priority P2 finishes.'),
 example('preemptive-2','Preemptive priority · repeated interruptions','Preemptive Priority',[[2,4,2],[4,3,3],[5,2,1],[7,5,4],[9,2,1]],[6,2.8,2],'P3 interrupts P1 at time 5; P5 interrupts P2 at time 9.')
];
export function schedule(c:ScheduleCase){
 const remaining=c.jobs.map(j=>j.burst),first=c.jobs.map(()=>-1),completion=c.jobs.map(()=>0),segments:Segment[]=[];
 let time=0,current=-1,done=0;const ready:number[]=[];const admitted=new Set<number>();
 const enqueue=()=>{c.jobs.map((j,i)=>({j,i})).filter(({j,i})=>j.arrival<=time&&!admitted.has(i)).sort((a,b)=>a.j.arrival-b.j.arrival||a.i-b.i).forEach(({i})=>{ready.push(i);admitted.add(i)})};
 const run=(i:number,duration:number)=>{if(i>=0&&first[i]<0)first[i]=time;const id=i<0?'Idle':c.jobs[i].id;const last=segments.at(-1);if(last?.id===id&&last.end===time&&c.algorithm!=='RR')last.end+=duration;else segments.push({id,start:time,end:time+duration});time+=duration;if(i>=0){remaining[i]-=duration;if(remaining[i]===0){completion[i]=time;done++}}};
 while(done<c.jobs.length){
  if(c.algorithm==='RR'){enqueue();if(!ready.length){run(-1,Math.min(...c.jobs.filter((_,i)=>!admitted.has(i)).map(j=>j.arrival))-time);continue}const i=ready.shift()!;run(i,Math.min(c.quantum,remaining[i]));enqueue();if(remaining[i]>0)ready.push(i);continue}
  const candidates=c.jobs.map((_,i)=>i).filter(i=>remaining[i]>0&&c.jobs[i].arrival<=time);
  if(!candidates.length){run(-1,Math.min(...c.jobs.filter((_,i)=>remaining[i]>0).map(j=>j.arrival))-time);current=-1;continue}
  const score=(i:number)=>c.algorithm==='FCFS'?c.jobs[i].arrival:c.algorithm==='SJF'?c.jobs[i].burst:c.algorithm==='SRT'?remaining[i]:c.jobs[i].priority;
  candidates.sort((a,b)=>score(a)-score(b)||c.jobs[a].arrival-c.jobs[b].arrival||a-b);
  const preemptive=c.algorithm==='SRT'||c.algorithm==='Preemptive Priority';
  let i=candidates[0];if(preemptive&&current>=0&&remaining[current]>0&&score(current)===score(i))i=current;
  current=i;run(i,preemptive?1:remaining[i]);
 }
 const metrics=c.jobs.map((j,i)=>({...j,start:first[i],completion:completion[i],turnaround:completion[i]-j.arrival,waiting:completion[i]-j.arrival-j.burst,response:first[i]-j.arrival}));
 const averages=['turnaround','waiting','response'].map(k=>metrics.reduce((sum,m)=>sum+m[k as 'turnaround'],0)/metrics.length);
 return {segments,metrics,averages};
}
