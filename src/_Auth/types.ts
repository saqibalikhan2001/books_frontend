/** @format */

export type LoginFormProps = {
  email: string;
  password: string;
};

export type SubmitProps = Pick<LoginFormProps, "email">;

export type FogetFormProps = {
  loading: boolean;
  onSubmit: (value: SubmitProps) => void;
};

export type LoginSubmitProps = Omit<FogetFormProps, "onSubmit"> & {
  onSubmit: (value: LoginFormProps) => void;
};

export type SignUpSubmitProps = LoginFormProps & {
  name: string;
  password_confirmation: string;
};

export type ResetSubmitProps = {
  confirmation_code: string;
  passowrd: string;
  confirm_password: string;
};

export type ResetFormProps = Omit<FogetFormProps, "onSubmit"> & {
  onSubmit: (value: ResetSubmitProps) => void;
};

export type SignupFormProps = Omit<FogetFormProps, "onSubmit"> & {
  onSubmit: (value: SignUpSubmitProps) => void;
  email?: string;
  name?: string;
};
