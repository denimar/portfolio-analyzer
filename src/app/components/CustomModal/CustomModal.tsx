import { FC, ReactNode } from "react"
import CustomDialog from "../CustomDialog/CustomDialog"

type CustomModalProps = {
  className?: string
  title: string
  content: ReactNode
  open: boolean
  actionButtons?: ReactNode
}

const CustomModal: FC<CustomModalProps> = ({ className, title, content, open, actionButtons }) => {
  return (
    <CustomDialog 
      className={className}
      open={open} 
      message={content} 
      title={title} 
      actionButtons={actionButtons}
    />
  )
}

export default CustomModal



