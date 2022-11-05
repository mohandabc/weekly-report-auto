import { SideBar } from "../../components/SideBar";
import React from "react";
import { Form, Button, Schema, Whisper, Popover } from "rsuite";
import { authenticate } from "../../services/api";
import { useAuth } from "../../services/useAuth";

export const LoginPage = () => {
  const [formValue, setFormValue] = React.useState({ user: "", pass: "" });
  const [loadingValue, setLoadingValue] = React.useState(false);
  const formRef = React.useRef();
  const { login } = useAuth();
  const { user } = useAuth();

  const model = Schema.Model({
    user: Schema.Types.StringType().isRequired("This field is required."),
    pass: Schema.Types.StringType().isRequired("This field is required."),
  });

  const handleSubmit = (event) => {
    // event.preventDefault();
    if (!formRef.current.check()) {
      console.error("ERROR");
      return;
    }
    setLoadingValue(true);
    authenticate(formValue["user"], formValue["pass"]).then((res) => {
      let data = res.result;
       if (data["session"]["uid"])
        {login({
          user: formValue["user"],
          pass: formValue["pass"],
          name: data["session"]["name"],
        })} 
        else {setLoadingValue(false);}
    });

  };
  return (
    <div className="App">
      <header className="flex flex-col bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed items-center">
        {user?
        <div className="sticky top-0 z-30 w-full">
        <SideBar />
      </div>
        :
        <></>
        }
        
        <div class="flex sticky rounded-xl bg-gray-200 top-1/4 w-4/12 h-80 items-center justify-center">
          <div className="flex sticky justify-center items-center">
            <Form
              ref={formRef}
              model={model}
              onChange={setFormValue}
              onSubmit={handleSubmit}
            >
              <Form.Group controlId="username-8">
                <Form.ControlLabel className="text-black/[.6]">Username</Form.ControlLabel>
                <Form.Control placeholder="TeamSpace Username" name="user" />
                <Form.HelpText tooltip>Login can only be done using Teamspace credentials</Form.HelpText>
              </Form.Group>

              <Form.Group controlId="password-8">
                <Form.ControlLabel className="text-black/[.6]">Password</Form.ControlLabel>
                <Form.Control
                  placeholder="********"
                  name="pass"
                  type="password"
                  autoComplete="off"
                />
                <Form.HelpText tooltip className="text-blue-600">Login can only be done using Teamspace credentials</Form.HelpText>
              </Form.Group>
              <div className="flex sticky justify-center items-center">

                 <Button appearance="primary" type="submit" loading={loadingValue}
                 className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base my-3 py-2 px-4 rounded ">
                    Login
                  </Button>

              </div>
            </Form>
          </div>
        </div>
      </header>
    </div>
  );
};
