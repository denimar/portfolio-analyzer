import { FC, ReactNode } from "react"
import CustomDialog from "../CustomDialog/CustomDialog"
import { Button } from "@/components/ui/button"

type CustomDialogConfirmProps = {
  className?: string
  title: string
  message: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
}

const CustomDialogConfirm: FC<CustomDialogConfirmProps> = ({ className, title, message, open, setOpen, onConfirm }) => {
  return (
    <CustomDialog 
      className={`${className}`}
      open={open} 
      message={message} 
      title={title} 
      actionButtons={
        <>
          <Button variant={'outline'} onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
          >Continue
          </Button>
        </>
      }
    />
  )
}

export default CustomDialogConfirm



