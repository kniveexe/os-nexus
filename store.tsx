import {createContext,useContext,useEffect,useState} from 'react';
import type {ReactNode} from 'react';
import {loadProgress,STORAGE_KEY} from './logic';
import type {Progress} from './logic';
type Store={progress:Progress;update:(fn:(p:Progress)=>Progress)=>void;replace:(p:Progress)=>void;storageError:string;};
const C=createContext<Store|null>(null);
export function ProgressProvider({children}:{children:ReactNode}){const [initial]=useState(loadProgress);const [progress,setProgress]=useState(initial.data);const [storageError,setError]=useState(initial.error);const [touched,setTouched]=useState(false);
 useEffect(()=>{if(!touched)return;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));setError('')}catch{setError('Browser storage is unavailable or full. Export your progress before closing.')}},[progress,touched]);
 const update=(fn:(p:Progress)=>Progress)=>{setTouched(true);setProgress(fn)};return <C.Provider value={{progress,update,replace:p=>update(()=>p),storageError}}>{children}</C.Provider>}
export function useProgress(){const c=useContext(C);if(!c)throw Error('Missing progress provider');return c}
