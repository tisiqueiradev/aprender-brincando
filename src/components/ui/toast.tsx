import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

/* ===============================
   Provider
=============================== */

export const ToastProvider = ToastPrimitives.Provider

/* ===============================
   Viewport
=============================== */

type ToastViewportProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Viewport
>

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))

ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/* ===============================
   Variants
=============================== */

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ToastVariantProps = VariantProps<typeof toastVariants>

/* ===============================
   Toast Root
=============================== */

type ToastProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Root
> &
  ToastVariantProps

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))

Toast.displayName = ToastPrimitives.Root.displayName

/* ===============================
   Action
=============================== */

type ToastActionProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Action
>

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
      className
    )}
    {...props}
  />
))

ToastAction.displayName = ToastPrimitives.Action.displayName

/* ===============================
   Close
=============================== */

type ToastCloseProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Close
>

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  ToastCloseProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn("absolute right-2 top-2 rounded-md p-1", className)}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))

ToastClose.displayName = ToastPrimitives.Close.displayName

/* ===============================
   Title
=============================== */

type ToastTitleProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Title
>

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))

ToastTitle.displayName = ToastPrimitives.Title.displayName

/* ===============================
   Description
=============================== */

type ToastDescriptionProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Description
>

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))

ToastDescription.displayName =
  ToastPrimitives.Description.displayName

/* ===============================
   Extra Types
=============================== */

export type { ToastProps }
export type ToastActionElement = React.ReactElement<typeof ToastAction>
