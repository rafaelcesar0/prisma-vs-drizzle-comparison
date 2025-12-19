'use client'

import { cn } from '@/lib/utils'
import { Zap, Database } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

type OrmType = 'drizzle' | 'prisma'

interface OrmToggleProps {
  value: OrmType
  onChange: (orm: OrmType) => void
}

export function OrmToggle({ value, onChange }: OrmToggleProps) {
  return (
    <div className='flex items-center gap-4'>
      <div className="inline-flex rounded-full p-1 bg-muted">
        <button
          onClick={() => onChange('drizzle')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out',
            value === 'drizzle'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          )}
        >
          <Zap className="w-4 h-4" />
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
          <Database className="w-4 h-4" />
          Prisma
        </button>
      </div>
      <ModeToggle />
    </div>
  )
}
