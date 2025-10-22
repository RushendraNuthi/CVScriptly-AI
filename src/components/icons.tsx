import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={32}
      height={32}
      {...props}
    >
      <g fill="hsl(var(--primary))">
        <path d="M40,40 V216 H216 V40 Z M128,128" fill="none" />
        <path d="M60,60 h136 v20 h-136z" />
        <path d="M60,90 h136 v20 h-136z" />
        <path d="M60,150 h50 v20 h-50z" />
        <path d="M60,180 h50 v20 h-50z" />
        <path d="M125,150 h71 v50 h-71z" fill="hsl(var(--accent))" />
      </g>
    </svg>
  );
}

export function ProfileAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}
