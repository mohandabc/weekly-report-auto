
import { SideBar } from "../../components/SideBar";
import React from "react";
import { Form, Button, Schema  } from "rsuite";
import { authenticate } from '../../services/api';
import {useRecoilState} from 'recoil';
import {sessionState} from '../../shared/globalState';

export const MainPage = () => {
  const [formValue, setFormValue] = React.useState({user:"",pass:""});
  const [session, setSession] = useRecoilState(sessionState);

  const formRef = React.useRef();

  const model = Schema.Model({
    user: Schema.Types.StringType().isRequired('This field is required.'),
    pass: Schema.Types.StringType().isRequired('This field is required.')
  });

  const handleSubmit = () => {
    if (!formRef.current.check()) {
        console.error("ERROR");
        return;
    }
    authenticate(formValue['user'],formValue['pass']).then(res=> {
        let data = res.result;
        setSession(data || {});
        console.log(data);
      });

  };
  return (
    <div className="App">
      <header className="flex flex-col bg-header min-h-screen">
        <div className="sticky top-0 z-30 w-full">
          <SideBar/>
        </div>

        <div className="flex sticky top-40 justify-center items-center">
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
      </header>
    </div>
  );
};
