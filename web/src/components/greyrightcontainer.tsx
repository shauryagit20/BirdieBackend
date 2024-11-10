import { ReactNode } from 'react';

interface RightContainerProps {
  children?: ReactNode;
}

export function RightContainer({ children }: RightContainerProps) {
  return (
    <div className="flex-shrink-0 w-1/4 h-screen p-200  bg-white rounded-lg m-4">
      {children}
    </div>
  );
}
