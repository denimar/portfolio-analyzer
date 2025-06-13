import { FC, ReactNode } from "react"
import CustomDialog from "../CustomDialog/CustomDialog"
import { Button } from "@/components/ui/button"

type CustomDialogInfoProps = {
  className?: string
  message: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  onOkClick: () => void
}

const CustomDialogInfo: FC<CustomDialogInfoProps> = ({ className, message, open, setOpen, onOkClick }) => {
  return (
    <CustomDialog
      className={`${className}`}
      open={open}
      message={message}
      title={'Info'}
      actionButtons={
        <>
          <Button onClick={() => {
            setOpen(false)
            onOkClick()
          }}
          >Ok
          </Button>
        </>
      }
    />
  )
}

export default CustomDialogInfo



