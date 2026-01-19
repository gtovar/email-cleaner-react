import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils.js';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SheetPortal>
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed right-0 top-0 z-50 h-screen w-80 max-w-[90vw] translate-x-full border-l bg-background shadow-lg transition-transform duration-200 data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full sm:w-96',
          className
        )}
        {...props}
      />
    </SheetPortal>
  )
);
SheetContent.displayName = 'SheetContent';

export { Sheet, SheetTrigger, SheetClose, SheetContent };
