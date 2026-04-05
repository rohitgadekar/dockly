import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | DOCKLY.PRO`;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
