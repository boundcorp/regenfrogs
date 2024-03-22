import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";

import Typography from "@mui/material/Typography";
import Link from "next/link";
import {useEasySnackbar, useMutationHelper} from "../../../lib/snackbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Head from "next/head";
import {ErrorMessage} from "@hookform/error-message";
import {get} from "lodash";
import {useRouter} from "next/router";
import {
  usePasswordResetMutation,
} from "../../../generated/graphql";
import CardHeader from "@mui/material/CardHeader";
import {SendResetEmail} from ".";

type ResetPasswordProps = {
  newPassword1: string;
  newPassword2: string;
};

export const PasswordResetForm = ({token}: { token: string }) => {
  const {handleSubmit, register, formState} = useForm<ResetPasswordProps>();
  const [error, setError] = useState("");
  const [reset, ] = usePasswordResetMutation();
  const snackbar = useEasySnackbar();
  const mutate = useMutationHelper();
  const router = useRouter();

  const _onSubmit = async (data: ResetPasswordProps) => mutate({
    fn: () => reset({variables: {...data, token}}),
    successMessage: "Password reset success! Please log in...",
    unwrap: (result) => result?.data?.passwordReset,
    successTypeName: "PasswordResetSuccess",
    title: "Password Reset",
    redirect: "/login",
    onErrorResult: message => setError(message)
  })

  return (
    <form onSubmit={handleSubmit(_onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="New Password"
            fullWidth
            {...register("newPassword1")}
            required
            error={!!get(formState.errors, "newPassword1")}
            type={"password"}
            helperText={
              <ErrorMessage errors={formState.errors} name={"newPassword1"}/>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("newPassword2")}
            variant="outlined"
            label="Confirm New Password"
            fullWidth
            required
            type="password"
            error={!!get(formState.errors, "newPassword2")}
            helperText={
              <ErrorMessage errors={formState.errors} name={"newPassword2"}/>
            }
          />
        </Grid>
      </Grid>
      <Box color="red" marginTop={error ? "2em" : 0}>
        {error}
      </Box>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        style={{margin: "3em 0 1em"}}
        disabled={formState.isSubmitting}
      >
        Change Password
      </Button>
      <Box pt={1}>
        <Typography variant="body2">
          Back to <Link href="/login">Login</Link>
        </Typography>
      </Box>
    </form>
  );
};


export const PasswordResetContainer = () => {
  const router = useRouter();
  const {token} = router.query;

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>


      <Container maxWidth={"xl"}>
        <Grid container justifyContent={"center"}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{marginTop: "3em"}}>
              <CardHeader title="Password Reset"/>
              <CardContent>
                {token ? (
                  <PasswordResetForm token={token as string}/>
                ) : (
                  <SendResetEmail/>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PasswordResetContainer;
