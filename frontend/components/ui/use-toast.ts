import { ReactNode } from "react"
import * as React from "react"

import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000 // 5 seconds by default instead of the previous very long timeout

// Define valid toast variant types for better type safety
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
  variant?: ToastVariant
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type ActionType = typeof actionTypes
export type ToastId = string

let count = 0

function genId(): ToastId {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
    type: ActionType["ADD_TOAST"]
    toast: ToasterToast
  }
  | {
    type: ActionType["UPDATE_TOAST"]
    toast: Partial<ToasterToast>
  }
  | {
    type: ActionType["DISMISS_TOAST"]
    toastId?: ToastId
  }
  | {
    type: ActionType["REMOVE_TOAST"]
    toastId?: ToastId
  }

export interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<ToastId, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Cancel the removal timeout if dismissing early
      if (toastId && toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId))
        toastTimeouts.delete(toastId)
      }

      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId))
        toastTimeouts.delete(toastId)
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

export type ToastOptions = Omit<ToasterToast, "id">

function toast(props: ToastOptions) {
  const id = genId()

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss()
        }
      },
    },
  })

  // Set up the auto-dismiss timeout
  const timeout = setTimeout(() => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    // Remove the toast after animation completes
    setTimeout(() => {
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id })
    }, 300) // typical animation duration
  }, props.duration || TOAST_REMOVE_DELAY)

  toastTimeouts.set(id, timeout)

  return {
    id,
    dismiss,
    update,
  }
}

export interface ToastAPI {
  toast: (props: ToastOptions) => {
    id: string
    dismiss: () => void
    update: (props: Partial<ToasterToast>) => void
  }
  dismiss: (toastId?: string) => void
  toasts: ToasterToast[]
}

function useToast(): ToastAPI {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }

      // Clear all timeouts when the component unmounts
      toastTimeouts.forEach((timeout) => {
        clearTimeout(timeout)
      })
      toastTimeouts.clear()
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
