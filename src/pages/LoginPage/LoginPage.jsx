
import { SideBar } from "../../components/SideBar";
import React from "react";
import { Form, Button, Schema  } from "rsuite";
import { authenticate } from '../../services/api';
import {useAuth} from '../../services/useAuth';

export const LoginPage = () => {
  const [formValue, setFormValue] = React.useState({user:"",pass:""});
  const formRef = React.useRef();
  const { login } = useAuth();

  const model = Schema.Model({
    user: Schema.Types.StringType().isRequired('This field is required.'),
    pass: Schema.Types.StringType().isRequired('This field is required.')
  });

  const handleSubmit = (event) => {
    // event.preventDefault();
    if (!formRef.current.check()) {
        console.error("ERROR");
        return;
    }
    authenticate(formValue['user'],formValue['pass']).then(res=> {
        let data = res.result;
        data["session"]["uid"]? login({user:formValue['user'],pass:formValue['pass'],name:data["session"]["name"]}) : setFormValue(null);
      });

  };
  return (
    <div className="App">
      <header className="flex flex-col bg-header min-h-screen items-center">
        <div className="sticky top-0 z-30 w-full">
          <SideBar/>
        </div>
        <div class="flex sticky rounded-xl bg-gray-400 top-1/4 w-4/12 h-60 items-center justify-center">
          <div className="flex sticky justify-center items-center">
            <Form ref={formRef} model={model} onChange={setFormValue} onSubmit={handleSubmit}>
              <Form.Group controlId="username-8">
                <Form.ControlLabel>Username</Form.ControlLabel>
                <Form.Control placeholder="Username" name="user" />
              </Form.Group>

              <Form.Group controlId="password-8">
                <Form.ControlLabel>Password</Form.ControlLabel>
                <Form.Control
                  placeholder="Password"
                  name="pass"
                  type="password"
                  autoComplete="off"
                />
              </Form.Group>

              <Button appearance="primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
        </div>
      </header>
    </div>
  );
};
