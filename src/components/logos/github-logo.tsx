'use client'

import Image from 'next/image'

interface GithubLogoProps {
  className?: string
}

export function GithubLogo({ className }: GithubLogoProps) {
  return (
    <>
      <Image
        src="/github-mark.svg"
        alt="GitHub"
        width={20}
        height={20}
        className={`dark:hidden ${className ?? ''}`}
      />
      <Image
        src="/github-mark-white.svg"
        alt="GitHub"
        width={20}
        height={20}
        className={`hidden dark:block ${className ?? ''}`}
      />
    </>
  )
}
