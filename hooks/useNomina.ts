import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { altatecaApi } from "../constants/Backend";
import { PayrollDetails } from "../types";
import { currency } from "../utils/Formats";

export function useNomina(employee_code: string) {
  const [details, setDetails] = useState<PayrollDetails>({
    code: "",
    net_pay: "",
    total_deduction: "",
    total_perception: "",
    errorCode: null,
  });

  const fetchDetails = useCallback(async () => {
    try {
      const res = await altatecaApi.get(
        `employees/nominas/${encodeURIComponent(
          employee_code //"000141"
        )}/`
      );
      setDetails({ ...res.data });
    } catch (error: any | AxiosError) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status) {
          console.log(error);

          setDetails((prev) => ({
            ...prev,
            errorCode: error.response?.status,
          }));
          return;
        }
      }
      console.error(error);
    }
  }, [employee_code]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    ...details,
    total_deduction: currency.format(Number(details.total_deduction)),
    total_perception: currency.format(Number(details.total_perception)),
    net_pay: currency.format(Number(details.net_pay)),
  };
}
