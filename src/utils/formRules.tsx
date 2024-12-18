import { Rule } from "antd/es/form";
import { RuleType } from "rc-field-form/lib/interface";

const passwordValidator = ({ getFieldValue }: any) => ({
  validator(_ex: any, value: any) {
    if (!value || getFieldValue("password") === value) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("Password not matched!"));
  },
});

type RuleProps = {
  name?: RuleType;
  message?: string;
  required?: boolean;
  valEmail?: boolean;
  validEmail?: boolean;
};

export const rules = ({
  message = "",
  name = "email",
  required = true,
  valEmail = false,
  validEmail = false,
}: RuleProps): Rule[] =>
  validEmail
    ? [{ type: name, required: false, message }]
    : valEmail
    ? [{ type: name, required: true, message }]
    : [{ required, message }];

export const passwordRules = (message: string, is_confirm: boolean = false): Rule[] =>
  !is_confirm
    ? [
        { required: true, message },
        { type: "string", min: 8 },
      ]
    : [{ required: true, message }, passwordValidator];
