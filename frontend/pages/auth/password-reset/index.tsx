import { ErrorMessage } from "@hookform/error-message";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SendPasswordResetEmailMutationVariables, useSendPasswordResetEmailMutation } from "../../../generated/graphql";
import {get} from "lodash"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import {useMutationHelper} from "../../../lib/snackbar";

export const SendResetEmail = () => {
    const [sendReset, response] = useSendPasswordResetEmailMutation();
    const { handleSubmit, register, formState } =
      useForm<SendPasswordResetEmailMutationVariables>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const mutate = useMutationHelper();

    const _onSubmit = (data: SendPasswordResetEmailMutationVariables) => mutate({
      title: "Password Reset",
      fn: () => sendReset({ variables: data }),
      successTypeName: "SendPasswordResetEmailSuccess",
      successMessage: "Success! Check your email.",
      unwrap: (result) => result?.data?.sendPasswordResetEmail,
      onErrorResult: message => setError(message),
      onSuccess: () => setSuccess(true)
    })

    return (
      <form onSubmit={handleSubmit(_onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              required
              {...register("email")}
              error={!!get(formState.errors, "email")}
              helperText={
                <ErrorMessage errors={formState.errors} name={"email"} />
              }
            />
          </Grid>
          {error ? <Grid item xs={12}>
            <Box color="red" marginTop={"2em"}>
              {error}
            </Box>
          </Grid> : null}
          
          <Grid item xs={12}>
            {success ? (
              <Typography variant="h6" color="green">Success! Check your email.</Typography>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="flex-end">
              <Grid item>
                <Typography variant="body2">
                  Back to <Link href="/login">Login</Link>
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={formState.isSubmitting}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  };

export const PasswordResetContainer = () => {
  
    return (
      <>
        <Head>
          <title>Register</title>
        </Head>
  

        <Container maxWidth={"xl"}>
          <Grid container justifyContent={"center"}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ marginTop: "3em" }}>
                <CardHeader title="Password Reset" />
                <CardContent>
                    <SendResetEmail />

                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  };
  
  export default PasswordResetContainer;