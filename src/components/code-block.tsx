'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  language?: string
  fileName?: string
  className?: string
}

export function CodeBlock({ code, language = 'txt', fileName, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={cn('relative rounded-lg border bg-muted/40', className)}>
      <div className='flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground'>
        <span className='font-medium text-foreground'>
          {fileName ?? `.${language}`}
        </span>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-7 gap-2 px-2'
          onClick={handleCopy}
        >
          {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
      <pre className='overflow-x-auto p-4 text-xs font-mono leading-relaxed'>
        <code>{code}</code>
      </pre>
    </div>
  )
}
