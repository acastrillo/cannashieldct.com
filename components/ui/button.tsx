import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'focus-ring inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-brand-accent text-brand-background hover:bg-brand-accent-hover',
        outline:
          'border border-brand-border bg-transparent text-brand-primary hover:border-brand-accent hover:text-brand-accent',
        ghost:
          'bg-transparent text-brand-primary hover:bg-brand-surface hover:text-brand-accent',
        link: 'h-auto min-h-0 rounded-none p-0 text-brand-accent underline-offset-4 hover:text-brand-accent-hover hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
