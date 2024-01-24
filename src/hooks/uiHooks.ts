import { useEffect, useRef } from 'react';

interface Attributes {
  key: string;
  value: string;
}

export const useSetAttribute = (attributes: Attributes[]) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    attributes.map((attribute) => {
      if (ref?.current)
        ref?.current?.setAttribute(attribute.key, attribute.value);
    });
  }, [ref, attributes]);
  return ref;
};
