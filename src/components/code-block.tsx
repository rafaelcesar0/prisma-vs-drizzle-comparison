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
  highlightedHtml?: string
}

export function CodeBlock({
  code,
  language = 'txt',
  fileName,
  className,
  highlightedHtml,
}: CodeBlockProps) {
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
      <div className='flex items-center justify-between border-b px-3 py-1.5 sm:px-4 sm:py-2 text-xs text-muted-foreground'>
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
      {highlightedHtml ? (
        <div className='overflow-x-auto p-3 sm:p-4 text-[11px] sm:text-xs font-mono leading-relaxed'>
          <div
            className='[&_pre]:m-0 [&_.shiki]:bg-transparent [&_.shiki]:p-0 [&_.shiki code]:block [&_.shiki code]:min-w-full'
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      ) : (
        <pre className='overflow-x-auto p-3 sm:p-4 text-[11px] sm:text-xs font-mono leading-relaxed'>
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
