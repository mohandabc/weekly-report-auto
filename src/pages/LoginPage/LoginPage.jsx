/*****************************************************************************************
 * TO AUTHENTICATE USERS USING "REPORT/AUTHENTICATE" CONTROLLER (WEEKLY_REPORT_AUTO.PY), *
 *       GENERATING A TOKEN FOR THEM AND KEEPING THEM SIGNED IN USING LOCALSTORAGE       *
 *****************************************************************************************/

import { SideBar } from "../../components/SideBar";
import React, { useEffect, useState } from "react";
import { Form, Button, Schema } from "rsuite";
import { authenticate } from "../../services/api";
import { useAuth } from "../../services/useAuth";
import { SONATRACH_LOGO } from "../../constants/logos";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const LoginPage = () => {
  const darkMode = useRecoilValue(darkModeState);

  const [formValue, setFormValue] = React.useState({ user: "", pass: "" });
  const [loadingValue, setLoadingValue] = React.useState(false);
  const [loginfailed, setLoginfailed] = React.useState(false);
  const formRef = React.useRef();
  const { login, user } = useAuth();

  const model = Schema.Model({
    user: Schema.Types.StringType().isRequired("This field is required."),
    pass: Schema.Types.StringType().isRequired("This field is required."),
  });

  const handleSubmit = () => {
    setLoginfailed(false);
    if (!formRef.current.check()) {
      console.error("ERROR");
      return;
    }
    setLoadingValue(true);
    authenticate(formValue["user"], formValue["pass"]).then((res) => {
      let data = res.result;
      if (data["session"]["uid"]) {
        login({
          name: data["session"]["name"],
        });
      } else {
        setLoadingValue(false);
        setLoginfailed(true);
      }
    });
  };

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  });

  return (
    <div className="App">
      <header
        className={`flex flex-row bg-${
          darkMode ? "dark-mode" : "light-mode"
        }  min-h-screen bg-no-repeat bg-cover bg-center bg-fixed items-center justify-center`}
      >
        {user ? (
          <div
            className={`fixed top-0 z-30 w-full ${darkMode ? "bg-black" : ""}`}
          >
            <SideBar appearance={`${darkMode ? "subtle" : "default"}`} />
          </div>
        ) : (
          <></>
        )}

        <div
          className={`flex sticky rounded-xl bg-gray-200 w-3/12 h-5/6 items-center justify-center transform transition-all duration-500 ease-out ${
            loginfailed ? "animate-shake" : ""
          }
          ${animation ? "scale-100" : "scale-0"}`}
        >
          <div
            className={`flex sticky justify-center items-center delay-200 duration-1000 transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
          >
            <Form
              ref={formRef}
              model={model}
              formValue={formValue}
              onChange={(formValue) => setFormValue(formValue)}
              onSubmit={handleSubmit}
              onCheck={() =>
                setFormValue({ user: formValue["user"], pass: "" })
              }
            >
              <div className="flex flex-col my-7 justify-center items-center">
                <img src={SONATRACH_LOGO}></img>
              </div>
              <h3 className="mb-4">Sign In</h3>
              <Form.Group controlId="username-8">
                <Form.ControlLabel className="text-black/[.6]">
                  Username
                </Form.ControlLabel>
                <Form.Control placeholder="Username" name="user" />
                <Form.HelpText tooltip>
                  Login can only be done using Teamspace credentials
                </Form.HelpText>
              </Form.Group>

              <Form.Group controlId="password-8">
                <Form.ControlLabel className="text-black/[.6]">
                  Password
                </Form.ControlLabel>
                <Form.Control
                  placeholder="********"
                  name="pass"
                  type="password"
                  autoComplete="off"
                />
                <Form.HelpText tooltip className="text-blue-600">
                  Login can only be done using Teamspace credentials
                </Form.HelpText>
              </Form.Group>
              <div className="flex flex-col justify-center items-center">
                <Button
                  appearance="primary"
                  type="submit"
                  loading={loadingValue}
                  className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base my-3 py-2 px-4 rounded "
                >
                  Login
                </Button>
                {loginfailed ? (
                  <div className="text-red-600 my-6">
                    Your username or password is incorrect.
                  </div>
                ) : (
                  <a
                    href="http://10.171.59.80:8069/web/reset_password?"
                    target="_blank"
                    className="my-5 no-underline hover:underline ..."
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
            </Form>
          </div>
        </div>
      </header>
    </div>
  );
};
