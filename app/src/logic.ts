export type Ref = {source:string; locator:string};
export type Source = {id:string; title:string; url:string; [key:string]:unknown};
export type Lesson = {id:string;group:string;topic:string;title:string;minutes:number;intro:string;why:string;definition:string;steps:string[];example:{question:string;answer:string};misconceptions:string[];recall:string;recallAnswer:string;relatedPa:string[];refs:Ref[];diagram?:string;scopeStatus?:string};
export type PAQuestion = {id:string;assignment:string;number:number;title:string;topic:string;group:string;difficulty:string;question:string;hints:string[];checklist:string[];answer:string;explanation:string[];mistakes:string[];relatedLessons:string[];refs:Ref[];technicalNote?:string};
export type Question = {id:string;kind:string;group:string;topic:string;prompt:string;options:string[];correct:number;explanation:string;misconception:string;refs:Ref[]};
export type Lab = {id:string;title:string;topic:string;group:string;intro:string;objectives:string[];sections:{title:string;explanation:string;commands:{command:string;output:string;explanation:string}[]}[];misconceptions:string[];refs:Ref[];quizIds:string[]};
export type Attempt = {id:string;choice:number;correct:boolean;at:number;session:string};
export type LessonProgress = {completed:boolean;confidence:number;lastOpened:number;notes:string};
export type PAProgress = {draft:string;submitted:boolean;reviewed:boolean;checks:number[];hints:number;retries:number;lastAttempted:number;bookmark:boolean;mode:'learn'|'challenge'|'exam';revealed:boolean};
export type Stroke = [number,number][];
export type WrittenResponse = {text:string;strokes:Stroke[];checks:number[];revealed:boolean};
export const emptyWritten=():WrittenResponse=>({text:'',strokes:[],checks:[],revealed:false});
export const hasWrittenAnswer=(r?:WrittenResponse)=>!!r&&(!!r.text.trim()||r.strokes.some(s=>s.length>0));
export type Exam = {id:string;ids:string[];choices:Record<string,number>;start:number;end:number|null;submitted:boolean;submittedAt?:number;kind:string;written?:Record<string,WrittenResponse>};
export type PlanItem = {id:string;title:string;minutes:number;to:string;reason:string};
export type Progress = {written?:Record<string,WrittenResponse>;version:2;lessons:Record<string,LessonProgress>;pa:Record<string,PAProgress>;labs:Record<string,boolean>;attempts:Attempt[];exam:Exam|null;bookmarks:string[];lastScreen:string;plan:PlanItem[];planConfig:{hours:number;session:number;preparation:string};};
export const STORAGE_KEY='os-nexus.progress.v2';
export const freshProgress=():Progress=>({version:2,lessons:{},pa:{},labs:{},attempts:[],exam:null,bookmarks:[],lastScreen:'/',plan:[],planConfig:{hours:4,session:30,preparation:'some'}});
export const emptyPA=():PAProgress=>({draft:'',submitted:false,reviewed:false,checks:[],hints:0,retries:0,lastAttempted:0,bookmark:false,mode:'learn',revealed:false});
export const emptyLesson=():LessonProgress=>({completed:false,confidence:0,lastOpened:0,notes:''});
export function validateProgress(input:unknown):Progress {
 const p=input as Progress;
 const obj=(v:unknown)=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const numeric=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
 const strings=(v:unknown)=>Array.isArray(v)&&v.every(x=>typeof x==='string');
 if(!obj(p)||p.version!==2||!obj(p.lessons)||!obj(p.pa)||!obj(p.labs)||!Array.isArray(p.attempts)||!strings(p.bookmarks)||typeof p.lastScreen!=='string'||!p.lastScreen.startsWith('/')||!Array.isArray(p.plan)||!obj(p.planConfig))throw Error('This is not a supported OS NEXUS v2 progress file.');
 if(Object.values(p.lessons).some(v=>!obj(v)||typeof v.completed!=='boolean'||!numeric(v.confidence)||v.confidence>3||!numeric(v.lastOpened)||typeof v.notes!=='string'))throw Error('Invalid lesson progress.');
 if(Object.values(p.pa).some(v=>!obj(v)||typeof v.draft!=='string'||typeof v.reviewed!=='boolean'||typeof v.submitted!=='boolean'||typeof v.revealed!=='boolean'||typeof v.bookmark!=='boolean'||!['learn','challenge','exam'].includes(v.mode)||!Array.isArray(v.checks)||!v.checks.every(n=>numeric(n)&&Number.isInteger(n))||!numeric(v.hints)||!numeric(v.retries)||!numeric(v.lastAttempted)))throw Error('Invalid practice progress.');
 if(Object.values(p.labs).some(v=>typeof v!=='boolean')||p.attempts.some(v=>!obj(v)||typeof v.id!=='string'||!Number.isInteger(v.choice)||typeof v.correct!=='boolean'||!numeric(v.at)||typeof v.session!=='string'))throw Error('Invalid assessment history.');
 if(p.exam!==null&&(!obj(p.exam)||!strings(p.exam.ids)||!obj(p.exam.choices)||Object.values(p.exam.choices).some(x=>!Number.isInteger(x)||x<0)||!numeric(p.exam.start)||(p.exam.end!==null&&!numeric(p.exam.end))||typeof p.exam.id!=='string'||typeof p.exam.submitted!=='boolean'||typeof p.exam.kind!=='string'))throw Error('Invalid exam state.');
 const validWritten=(v:unknown)=>obj(v)&&Object.values(v as Record<string,WrittenResponse>).every(r=>obj(r)&&typeof r.text==='string'&&typeof r.revealed==='boolean'&&Array.isArray(r.checks)&&r.checks.every(n=>numeric(n)&&Number.isInteger(n))&&Array.isArray(r.strokes)&&r.strokes.every(s=>Array.isArray(s)&&s.every(pt=>Array.isArray(pt)&&pt.length===2&&pt.every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=800))));
 if(p.written!==undefined&&!validWritten(p.written)||p.exam?.written!==undefined&&!validWritten(p.exam.written))throw Error('Invalid written response.');
 if(p.plan.some(v=>!obj(v)||typeof v.id!=='string'||typeof v.title!=='string'||!numeric(v.minutes)||typeof v.to!=='string'||!v.to.startsWith('/')||typeof v.reason!=='string')||!numeric(p.planConfig.hours)||![15,30,60].includes(p.planConfig.session)||typeof p.planConfig.preparation!=='string')throw Error('Invalid study plan.');
 return p;
}
export function loadProgress():{data:Progress;error:string} {try{const s=localStorage.getItem(STORAGE_KEY);return {data:s?validateProgress(JSON.parse(s)):freshProgress(),error:''}}catch{return {data:freshProgress(),error:'Saved progress could not be read. Export a backup after studying; existing storage has not been overwritten yet.'}}}
export function mastery(attempts:Attempt[],ids:string[]) {
 const a=attempts.filter(x=>ids.includes(x.id)); if(!a.length)return {level:'Not assessed',attempts:0,correct:0,unique:0};
 const latest=new Map<string,Attempt>();a.forEach(x=>latest.set(x.id,x));const recent=[...latest.values()];
 const correct=recent.filter(x=>x.correct).length;const repeats=ids.filter(id=>a.filter(x=>x.id===id&&x.correct).length>=2).length;
 const level=correct/recent.length<.6?'Needs review':recent.length>=4&&correct/recent.length>=.8&&repeats>=2?'Demonstrated':'Developing';
 return {level,attempts:a.length,correct,unique:recent.length};
}
export function gradeExam(exam:Exam,bank:Question[]):Attempt[]{return exam.ids.filter(id=>bank.some(q=>q.id===id)).map(id=>{const q=bank.find(x=>x.id===id);const choice=exam.choices[id]??-1;return {id,choice,correct:!!q&&choice===q.correct,at:exam.submittedAt??Date.now(),session:exam.id}})}
export function remainingSeconds(exam:Exam,now:number){return exam.end===null?null:Math.max(0,Math.ceil((exam.end-now)/1000))}
export const transitions:Record<string,Record<string,string>>={New:{Ready:'Admission places the process in the ready queue.'},Ready:{Running:'The dispatcher gives the process a CPU.'},Running:{Ready:'Preemption returns the process to the ready queue.',Waiting:'The process requests I/O or waits for an event.',Terminated:'The process exits or is terminated.'},Waiting:{Ready:'The awaited event completes. The process must be dispatched before running.'},Terminated:{}};
export function transition(state:string,next:string){return transitions[state]?.[next]?{state:next,message:transitions[state][next],valid:true}:{state,message:`${state} → ${next} is not a direct transition in this teaching model. ${state==='Waiting'&&next==='Running'?'I/O completion makes the process Ready first.':state==='Ready'&&next==='Waiting'?'A ready process is not executing to request I/O.':'Choose an enabled transition or reset.'}`,valid:false}}
export function addressAllowed(logical:number,base:number,limit:number){return Number.isInteger(logical)&&logical>=0&&logical<limit?base+logical:null}
export function permissionString(mode:string){if(!/^[0-7]{3}$/.test(mode))throw Error('Use three octal digits.');return mode.split('').map(d=>{const v=Number(d);return `${v&4?'r':'-'}${v&2?'w':'-'}${v&1?'x':'-'}`}).join('')}
export type TerminalState={cwd:string;pid:number;process:'none'|'S'|'T'|'terminated';mode:string;history:string[];};
export const initialTerminal=():TerminalState=>({cwd:'/home/student',pid:4242,process:'none',mode:'644',history:[]});
export const supportedCommands=['pwd','ls','ls -l','cd /proc','cd /home/student','cd ..','man ps','history','lscpu','free -h','lsblk -t','getconf PAGESIZE','getconf LEVEL1_DCACHE_LINESIZE','uname -r','cat /proc/cpuinfo','cat /proc/meminfo','ldd /bin/ls','strace ls','chmod 640 demo.txt','sudo whoami','echo hello','echo error >&2','sleep 300 &','echo $!','jobs','ps','ps aux','cat /proc/4242/status','ls /proc/4242/fd','kill -STOP 4242','kill -CONT 4242','kill -TERM 4242','kill -KILL 4242'];
export function terminalCommand(s:TerminalState,raw:string):{state:TerminalState;output:string;explanation:string}{
 const c=raw.trim().replace(/\s+/g,' '); const state={...s,history:[...s.history,c].slice(-100)}; const result=(output:string,explanation:string)=>({state,output,explanation});
 const active=s.process==='S'||s.process==='T';
 if(c==='pwd')return result(s.cwd,'pwd prints the current working directory.');
 if(c==='ls -l'&&s.cwd!=='/home/student')return result('Long listings are demonstrated only in /home/student. Try ls here.','This subset does not invent file metadata for other directories.');
 if(c==='ls'||c==='ls -l'){const files=s.cwd==='/proc'?'cpuinfo  meminfo  4242':s.cwd==='/home/student'?'demo.txt  Documents  Downloads':'home  proc  sys  dev  usr  etc';return result(c==='ls'?files:`-`+permissionString(s.mode)+' 1 student student 42 Oct 22 demo.txt','ls lists directory entries. In long format, the permission triads are owner, group, others.');}
 if(c.startsWith('cd ')){const dest=c.slice(3);const path=dest==='~'?'/home/student':dest==='..'?(s.cwd.slice(0,s.cwd.lastIndexOf('/'))||'/'):dest.startsWith('/')?dest:`${s.cwd}/${dest}`;if(!['/','/proc','/home','/home/student','/sys','/dev','/usr','/etc'].includes(path))return result('cd: directory is outside this simulator’s supported subset.','No real filesystem is accessed.');state.cwd=path;return result('','cd changes the simulated working directory.');}
 if(c==='history')return result(state.history.map((v,i)=>`${i+1}  ${v}`).join('\n'),'history lists commands entered in this simulator.');
 if(c==='man ps')return result('PS(1) — process status\nps : snapshot of processes attached to this terminal\nps aux : all users, user-oriented format, include processes without a controlling terminal','This is a teaching excerpt, not the complete Linux manual.');
 if(c==='lscpu')return result('Architecture:          x86_64\nCPU op-mode(s):        32-bit, 64-bit\nByte Order:           Little Endian\nCPU(s):               8\nThread(s) per core:    2\nCore(s) per socket:    4\nSocket(s):            1\nL1d cache:            128 KiB (4 instances)\nL2 cache:             1 MiB (4 instances)\nL3 cache:             8 MiB (1 instance)','Illustrative topology: 1 socket × 4 physical cores × 2 hardware threads = 8 logical CPUs. Cache reporting formats vary.');
 if(c==='free -h')return result('               total    used    free  shared  buff/cache  available\nMem:           8.0Gi   2.0Gi   3.0Gi   100Mi       3.0Gi      5.7Gi\nSwap:          2.0Gi      0B   2.0Gi','Illustrative values. Available estimates memory usable without swapping; free is not the same as available.');
 if(c==='lsblk -t')return result('NAME  ALIGNMENT MIN-IO OPT-IO PHY-SEC LOG-SEC ROTA SCHED\nsda           0    512      0     512     512    0 mq-deadline','lsblk -t reports block-device topology, not PCI devices.');
 if(c==='getconf PAGESIZE')return result('4096','Illustrative page size in bytes; it is not the cache-line size.');
 if(c==='getconf LEVEL1_DCACHE_LINESIZE')return result('64','Illustrative L1 data-cache line size in bytes.');
 if(c==='uname -r')return result('6.x-teaching','Illustrative kernel release, not the actual host kernel.');
 if(c==='cat /proc/cpuinfo')return result('processor : 0\nmodel name : Teaching CPU\nphysical id : 0\ncore id : 0\ncpu cores : 4\nsiblings : 8','A real /proc/cpuinfo contains a section for each visible logical CPU. This is an excerpt.');
 if(c==='cat /proc/meminfo')return result('MemTotal:        8388608 kB\nMemFree:         3145728 kB\nMemAvailable:    5976883 kB','The kernel exposes runtime memory information through procfs.');
 if(c==='ldd /bin/ls')return result('linux-vdso.so.1\nlibc.so.6 => /lib/x86_64-linux-gnu/libc.so.6\n/lib64/ld-linux-x86-64.so.2','Illustrative dependency excerpt. ldd shows shared-library dependencies; it does not trace system calls.');
 if(c==='strace ls')return result('openat(AT_FDCWD, ".", O_RDONLY|O_DIRECTORY) = 3\ngetdents64(3, ..., 32768) = 144\nwrite(1, "demo.txt\\n", 9) = 9\nclose(3) = 0\nexit_group(0) = ?','A simplified syscall trace. A library call need not map one-to-one to a syscall; modern ls may use different calls.');
 if(/^chmod [0-7]{3} demo\.txt$/.test(c)){state.mode=c.split(' ')[1];return result('',`New permission bits: ${permissionString(state.mode)}. Owner/group/other selection matters; privileged access may bypass normal discretionary restrictions.`)}
 if(c==='sudo whoami')return result('root','Simulation only. In a real system, sudo checks authorization and may request authentication; a user program is still in user mode.');
 if(c==='echo hello')return result('hello','Standard output is file descriptor 1.');
 if(c==='echo error >&2')return result('error  [stderr]','The shell redirects the message to standard error, file descriptor 2.');
 if(c==='sleep 300 &'){if(active)return result('This teaching model already has one process. Terminate it or reset first.','Only one child job is modeled.');state.pid=s.process==='none'?4242:s.pid+1;state.process='S';return result(`[1] ${state.pid}`,'The shell starts a background job. A sleeping process normally has Linux state S (interruptible sleep).');}
 if(c==='echo $!')return result(s.process==='none'?'':String(s.pid),'$! is the PID of the most recent background job, even if it has since finished.');
 if(c==='jobs')return result(active?`[1]+ ${s.process==='T'?'Stopped':'Running'}  sleep 300 &`:s.process==='terminated'?'[1]+ Done  sleep 300':'','The shell’s job label Running means not stopped/finished; the process may actually be asleep (S).');
 if(c==='ps'||c==='ps aux')return result(c==='ps'?`PID TTY       STAT COMMAND\n100 pts/0     S    bash${active?`\n${s.pid} pts/0    ${s.process}    sleep`:''}`:`USER       PID %CPU %MEM STAT COMMAND\nstudent    100  0.0  0.1 S    bash${active?`\nstudent   ${s.pid}  0.0  0.0 ${s.process}    sleep 300`:''}`,'ps is a snapshot. R means running/runnable, S interruptible sleep, D uninterruptible sleep, T stopped, and Z zombie.');
 const status=c.match(/^cat \/proc\/(\d+)\/status$/);if(status){if(!active||Number(status[1])!==s.pid)return result('No such process in this simulation.','The process entry disappears after termination and reaping.');return result(`Name:\tsleep\nState:\t${s.process} (${s.process==='T'?'stopped':'sleeping'})\nPid:\t${s.pid}\nPPid:\t100`,'PPid identifies the parent shell. Linux states refine the abstract five-state teaching model.');}
 const fds=c.match(/^ls \/proc\/(\d+)\/fd$/);if(fds)return result(active&&Number(fds[1])===s.pid?'0  1  2':'No such process in this simulation.','File descriptors 0, 1, 2 conventionally refer to stdin, stdout, stderr.');
 const sig=c.match(/^kill(?: -([A-Z]+|\d+))? (\d+)$/);if(sig){const signal=({19:'STOP',18:'CONT',15:'TERM',9:'KILL'} as Record<string,string>)[sig[1]]??sig[1]??'TERM';if(!['STOP','CONT','TERM','KILL'].includes(signal))return result('Unsupported signal. Use STOP, CONT, TERM or KILL.','Only this documented signal subset is simulated.');if(!active||Number(sig[2])!==s.pid)return result('kill: no such process','Signals target a PID, not a reusable array position.');if(signal==='STOP')state.process='T';if(signal==='CONT')state.process='S';if(signal==='KILL'||signal==='TERM')state.process='terminated';return result('',signal==='STOP'?'SIGSTOP suspends the job and cannot be caught or ignored.':signal==='CONT'?'SIGCONT resumes the job. A sleep command normally returns to S, not permanent R.':signal==='TERM'?'SIGTERM requests termination; this simulated process uses the default action. Real programs can handle or ignore TERM. The shell reaps the child here.':'SIGKILL cannot be caught or ignored. This model immediately terminates and reaps the job; real delivery can be delayed while in uninterruptible sleep.');}
 return result(`Unsupported command: ${c||'(empty)'}`,'This is a deterministic educational simulator, not a shell. Select a supported command from the guide.');
}
export function buildPlan(p:Progress,lessons:Lesson[],questions:PAQuestion[],labs:Lab[],bank:Question[],hours:number,session:number,preparation:string):PlanItem[]{
 const items:Omit<PlanItem,'minutes'>[]=[];
 const core=lessons.filter(l=>l.scopeStatus!=='unverified-supplemental');
 for(const l of core.filter(l=>!p.lessons[l.id]?.completed))items.push({id:l.id,title:`Learn: ${l.title}`,to:`/learn/${l.id}`,reason:'Uncovered source-confirmed core material'});
 for(const q of questions.filter(q=>!p.pa[q.id]?.reviewed))items.push({id:q.id,title:`Practice ${q.id}: ${q.title}`,to:`/practice/${q.id}`,reason:'Official practice assignment'});
 for(const l of labs.filter(l=>!p.labs[l.id]))items.push({id:l.id,title:`Lab: ${l.title}`,to:`/labs/${l.id}`,reason:'Interpret the commands and take the practical quiz'});
 const weak=core.filter(l=>{const ids=bank.filter(q=>q.group===l.group).map(q=>q.id);return mastery(p.attempts,ids).level==='Needs review'||(p.lessons[l.id]?.confidence??3)===1});
 for(const l of weak)items.push({id:'review-'+l.id,title:`Recall: ${l.title}`,to:`/learn/${l.id}`,reason:'Low assessed performance or self-reported confidence'});
 items.push({id:'recall',title:'Active recall: diagnostic check',to:'/quiz',reason:'Check understanding without looking at notes'},{id:'mock',title:'Take a practice mock',to:'/exam',reason:'Mixed independently authored questions'},{id:'mistakes',title:'Review mistakes',to:'/review',reason:'Explain why each missed answer was wrong'});
 const budget=Math.max(0,Math.round(Math.min(48,Math.max(0,hours))*60));const count=Math.floor(budget/session);if(!count)return [];
 // Reserve the final block for retrieval/review when there is enough time. Never promise to fit every topic.
 const chosen=items.slice(0,count);if(count>=3&&chosen.length>=count)chosen[count-1]=preparation==='ready'?items[items.length-2]:(p.attempts.some(a=>!a.correct)?items[items.length-1]:items[items.length-3]);
 return chosen.map(x=>({...x,minutes:session}));
}
