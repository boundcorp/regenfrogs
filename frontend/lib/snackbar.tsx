import {useSnackbar} from "notistack";
import {useRouter} from "next/router";

export function useEasySnackbar() {
  const {enqueueSnackbar} = useSnackbar();
  return {
    showSuccess: (message: string) =>
      enqueueSnackbar(message, {variant: "success"}),
    showSnackbar: (message: string, options?: any) =>
      enqueueSnackbar(message, options),
    showError: (message: string, error?: any) => {
      console.error("Snackbar Error:", message, error);
      const firstGQLError = error ? error?.graphQLErrors?.[0] : {}
      const errorMessage = firstGQLError?.extensions?.validationErrors?.[0]?.meta?.message ||
      firstGQLError?.message || error?.message || error ? error.toString() : "";
      enqueueSnackbar(
        errorMessage ? (
          <>
            {message}
            <br/>
            {errorMessage}
          </>
        ) : (
          `${message}`
        ),
        {variant: "error"}
      );
    },
  };
}

export type MutationHelperOptions = {
  title: string;
  fn: (args?: any) => Promise<any>;
  unwrap: (result: any) => any;
  successTypeName: string;
  successMessage?: string;
  errorMessage?: string;
  redirect?: string;
  onSuccess?: (result: any) => void;
  onErrorResult?: (message: string, result: any) => void;
}

export function useMutationHelper() {
  const snackbar = useEasySnackbar();
  const router = useRouter();
  return async (opts: MutationHelperOptions) => {
    const defaultError = opts.errorMessage || `Unable to ${opts.title}, please contact support.`
    try {
      const result = await opts.fn();
      const unwrapped = opts.unwrap(result)
      if (unwrapped.__typename === opts.successTypeName) {
        snackbar.showSuccess(opts.successMessage || `${opts.title} Success`);
        if (opts.redirect) {
          router.push(opts.redirect)
        }
        if (opts.onSuccess) {
          opts.onSuccess(unwrapped)
        }
      } else {
        if (opts.onErrorResult && unwrapped.__typename === "Error")
          opts.onErrorResult(unwrapped.message, unwrapped)
        snackbar.showError(unwrapped.message || defaultError)
      }
    } catch (e) {
      snackbar.showError(defaultError, e);
    }
  }
}