import { toast } from "sonner";

export default function useToast() {
  const addToast = ({ type, message }: ToastProps) => {
    if (type === "error") {
      toast.error(message);
    } else if (type === "success") {
      toast.success(message);
    } else if (type === "warning") {
      toast.warning(message);
    } else if (type === "info") {
      toast.info(message);
    } else {
      toast.message(message);
    }
  }

  return addToast
}