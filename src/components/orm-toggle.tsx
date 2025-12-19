'use client'

import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'
import { Button } from '@/components/ui/button'
import GithubLogo from '@/components/logos/github-logo'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import PrismaLogo from './logos/prisma-logo'
import DrizzleLogo from './logos/drizzle-logo'

type OrmType = 'drizzle' | 'prisma'

interface OrmToggleProps {
  value: OrmType
  onChange: (orm: OrmType) => void
}

export function OrmToggle({ value, onChange }: OrmToggleProps) {
  return (
    <div className='flex items-center gap-4'>
      <div className='inline-flex rounded-full p-1 bg-muted space-x-1'>
        <button
          onClick={() => onChange('drizzle')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out',
            value === 'drizzle'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          )}
        >
          <DrizzleLogo
            className={cn(value === 'drizzle'
                ? 'text-primary-foreground '
                : 'text-muted-foreground hover:text-foreground'
            )}
          />
          Drizzle
        </button>
        <button
          onClick={() => onChange('prisma')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out',
            value === 'prisma'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          )}
        >
          <PrismaLogo
            className={cn(
              value === 'prisma'
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          />
          Prisma
        </button>
      </div>
      <ModeToggle />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' asChild>
            <a
              href='https://github.com/rafaelcesar0/prisma-vs-drizzle-comparison'
              target='_blank'
              rel='noopener noreferrer'
            >
              <GithubLogo />
              <span className='sr-only'>GitHub</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>GitHub</TooltipContent>
      </Tooltip>
    </div>
  )
}
