import { Info } from '@/types';
import React, { createContext, useState, useContext } from 'react';

type Props = {
  children: React.ReactNode
}


interface DisksContextType {
  disks: string[];
  diskUsage: Info;
  setDisks: (disks: string[]) => void;
  setDiskUsage: (diskUsage: Info) => void;
}

const DisksContext = createContext<DisksContextType>({
  disks: [],
  diskUsage: {},
  setDisks: () => {},
  setDiskUsage: () => {},
});

export const useDisks = () => useContext(DisksContext);

export const DisksProvider: React.FC<Props> = ({ children }: Props) => {
  const [disks, setDisks] = useState<string[]>([]);
  const [diskUsage, setDiskUsage] = useState<Info>({});


  return (
    <DisksContext.Provider value={{ disks, setDisks, diskUsage, setDiskUsage }}>
      {children}
    </DisksContext.Provider>
  );
};