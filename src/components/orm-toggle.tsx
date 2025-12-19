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
    <div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
      <div className='inline-flex rounded-full p-0.5 sm:p-1 bg-muted space-x-0.5 sm:space-x-1'>
        <button
          onClick={() => onChange('drizzle')}
          className={cn(
            'flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-out',
            value === 'drizzle'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          )}
        >
          <DrizzleLogo
            className={cn(
              'w-4 h-4 sm:w-5 sm:h-5',
              value === 'drizzle'
                ? 'text-primary-foreground '
                : 'text-muted-foreground hover:text-foreground'
            )}
          />
          <span className='hidden sm:inline'>Drizzle</span>
        </button>
        <button
          onClick={() => onChange('prisma')}
          className={cn(
            'flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-out',
            value === 'prisma'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          )}
        >
          <PrismaLogo
            className={cn(
              'w-4 h-4 sm:w-5 sm:h-5',
              value === 'prisma'
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          />
          <span className='hidden sm:inline'>Prisma</span>
        </button>
      </div>
      <ModeToggle />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' className='h-8 w-8 sm:h-9 sm:w-9' asChild>
            <a
              href='https://github.com/rafaelcesar0/prisma-vs-drizzle-comparison'
              target='_blank'
              rel='noopener noreferrer'
            >
              <GithubLogo className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='sr-only'>GitHub</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>GitHub</TooltipContent>
      </Tooltip>
    </div>
  )
}
