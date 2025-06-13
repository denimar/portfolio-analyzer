import CustomModal from "@/app/components/CustomModal";
import { Button } from "@/components/ui/button";
import { FC, useTransition } from "react";

type IbkrConnectModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const IbkrConnectModal: FC<IbkrConnectModalProps> = ({ open, setOpen }) => {
  const [isPending, startTransition] = useTransition()
  return (
    <CustomModal
      title="Connect to IBKR"
      className="w-[650px] h-[450px] border border-green-500"
      open={open}
      content={(
        <div className="flex flex-col items-center gap-2 px-4 py-4 border border-red-400 w-full h-full">
          <iframe src="iframe-test.html" sandbox="allow-scripts allow-same-origin" />
        </div>
      )}
      actionButtons={(
        <>
          <Button disabled={isPending} variant={"outline"} onClick={() => setOpen(false)}>
            Go Back
          </Button>
          <Button disabled={isPending} >
            Confirm
          </Button>
        </>
      )}
    />
  )
}

export default IbkrConnectModal