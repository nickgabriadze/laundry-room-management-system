import { useEffect, useState } from "react";

export function useMachineTokenValidation(qrToken: string | undefined, machineCode: string) {
  const [tokenValid, setTokenValid] = useState(!!qrToken);
  const [tokenMessage, setTokenMessage] = useState("");
  const [isTokenMessageError, setIsTokenMessageError] = useState(false);

  useEffect(() => {
    if (!qrToken) {
      setTokenValid(true);
      return;
    }

    let active = true;

    import("@/src/lib/jwt-utils").then(({ validateToken }) => {
      if (!active) return;
      
      const isValid = validateToken(qrToken, machineCode);
      if (!isValid) {
        setTokenValid(false);
        setTokenMessage("Either machine was not found or you should scan the QR code once again.");
        setIsTokenMessageError(true);
      } else {
        setTokenValid(true);
        setTokenMessage("");
      }
    });

    return () => {
      active = false;
    };
  }, [qrToken, machineCode]);

  return { tokenValid, tokenMessage, isTokenMessageError };
}
