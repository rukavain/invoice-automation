"use client";

import { useFormStatus } from "react-dom";
import Image from "next/image";

interface SubmitButtonProps {
  className?: string;
  label: string;
  type?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  className,
  label,
  type,
}) => {
  const { pending } = useFormStatus();

  return (
    <button className={className} type={type} disabled={pending}>
      {pending ? (
        <Image
          src="/loading.gif"
          alt="loading"
          width={20}
          height={20}
          className="animate-spin"
        />
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;
