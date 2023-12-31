import { Button, Form, Input, Tooltip } from "antd";
import { AuthenticationService } from "../../../../services/authenticationService";
import {
  checkResponseStatus,
  validateEmail,
  validatePassword,
} from "../../../helpers";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/slices/authenticationSlice";
import { useState } from "react";
export default function SignUp(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (payload: any) => {
    setIsLoading(true);
    const response = await AuthenticationService.signUp(payload);
    if (checkResponseStatus(response)) {
      dispatch(login(response?.data!));
      setIsLoading(false);
      navigate("/project");
    }
  };
  const regexHint =
    "The password must be 6 characters long and include at least one uppercase letter (A-Z), one numeric digit (0-9), and one special character.";
  return (
    <Form
      name="signUpForm"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please input your name" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="email"
        hasFeedback
        rules={[
          { required: true, message: "Please enter your email" },
          {
            validator: validateEmail,
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Please enter your password" },
          { validator: validatePassword },
        ]}
        hasFeedback
      >
        <Input
          type="password"
          placeholder="Password"
          suffix={
            <Tooltip title={regexHint}>
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        hasFeedback
        rules={[
          { required: true, message: "Please enter your confirm password" },
          { validator: validatePassword },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match")
              );
            },
          }),
        ]}
      >
        <Input type="password" placeholder="Confirm password" />
      </Form.Item>
      <Form.Item>
        <a className="login-form-forgot" onClick={props.goToLogin}>
          Already have account?
        </a>
      </Form.Item>

      <div className="text-center text-lg-start mt-4 pt-2">
        <Button
          type="default"
          className="pl-2 pr-2"
          htmlType="submit"
          loading={isLoading}
        >
          Sign up
        </Button>
      </div>
    </Form>
  );
}
