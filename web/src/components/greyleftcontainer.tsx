import { ReactNode } from 'react';

interface LeftContainerProps {
  children: ReactNode;
}

export function LeftContainer({ children }: LeftContainerProps) {
  return (
    <div className="flex-shrink-0 w-2/3 bg-[#F2F5FA] p-8 pt-12 rounded-lg m-4 space-y-4">
      {children}
    </div>
  );
}
