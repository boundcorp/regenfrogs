import React, {useState} from "react";
import {get, useForm} from "react-hook-form";
import {setAuthToken} from "../../lib/auth";
import {parseGQLErrorMessage} from "../../lib/validation";
import {useEasySnackbar} from "../../lib/snackbar";
import {ErrorMessage} from "@hookform/error-message"

// mui
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";

// types
import {
  MutationTokenAuthArgs,
  useMyProfileQuery,
  useTokenAuthMutation,
} from "../../generated/graphql";

export default function LoginForm() {
  const {handleSubmit, control, formState, register} = useForm<MutationTokenAuthArgs>();
  const [error, setError] = useState("");
  const [tokenAuth, tokenAuthResult] = useTokenAuthMutation();
  const profileQuery = useMyProfileQuery();
  const snackbar = useEasySnackbar()

  const _onSubmit = async (input: MutationTokenAuthArgs) => {
    try {
      const result = (await tokenAuth({
        variables: {
          username_Iexact: input.username_Iexact || "",
          password: input.password,
        }
      })).data?.tokenAuth;
      setError("");

      if (result?.__typename === "TokenAuthSuccess" && result?.token) {
        setAuthToken(result.token, result.refreshToken || "");
        snackbar.showSuccess("Logged in successfully, welcome back!");
        await profileQuery.refetch();
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      snackbar.showError(err as string, "Error logging in");
      setError(
        parseGQLErrorMessage(err) || "An error occurred, please contact support"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Username"
            {...register("username_Iexact")}
            fullWidth
            required
            error={!!get(formState.errors, "username_Iexact")}
            helperText={
              <ErrorMessage
                errors={formState.errors}
                name={"username_Iexact"}
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Verification Code"
            fullWidth
            required
            type="password"
            {...register("password")}
            error={!!get(formState.errors, "password")}
          />
        </Grid>
      </Grid>
      {error ? <Grid item xs={12} color="red" marginTop="2em">
        <Typography variant={"body1"}>{error}</Typography>
      </Grid> : null}

      <Grid item xs={12} sx={{marginTop: "1em"}}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="secondary"
          sx={{fontWeight: 'bold'}}
          loading={tokenAuthResult.loading}
          fullWidth
        >
          Login
        </LoadingButton>
      </Grid>
    </form>
  );
};
