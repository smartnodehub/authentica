'use client';
import { forwardRef, TextareaHTMLAttributes } from 'react';

const AutoTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => (
    <textarea
      ref={ref}
      {...props}
      className={
        'w-full min-h-[140px] rounded-xl border p-3 ' +
        'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white ' +
        'focus:outline-none focus:ring-2 focus:ring-lime-300'
      }
    />
  ),
);
AutoTextarea.displayName = 'AutoTextarea';
export default AutoTextarea;