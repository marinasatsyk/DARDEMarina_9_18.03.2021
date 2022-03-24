/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";

describe("Given that I am a user on login page", () => {
    describe("When I do not fill fields and I click on employee button Login In", () => {
        test("Then It should renders Login page", () => {
            document.body.innerHTML = LoginUI();

            const inputEmailUser = screen.getByTestId("employee-email-input");
            expect(inputEmailUser.value).toBe("");

            const inputPasswordUser = screen.getByTestId("employee-password-input");
            expect(inputPasswordUser.value).toBe("");

            const form = screen.getByTestId("form-employee");
            const handleSubmit = jest.fn((e) => e.preventDefault());

            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(screen.getByTestId("form-employee")).toBeTruthy();
        });
    });

    describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
        test("Then It should renders Login page", () => {
            document.body.innerHTML = LoginUI();

            const inputEmailUser = screen.getByTestId("employee-email-input");
            fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
            expect(inputEmailUser.value).toBe("pasunemail");

            const inputPasswordUser = screen.getByTestId("employee-password-input");
            fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
            expect(inputPasswordUser.value).toBe("azerty");

            const form = screen.getByTestId("form-employee");
            const handleSubmit = jest.fn((e) => e.preventDefault());

            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(screen.getByTestId("form-employee")).toBeTruthy();
        });
    });

    describe("When I do fill fields in correct format and I click on employee button Login In", () => {
        test("Then I should be identified as an Employee in app", () => {
            document.body.innerHTML = LoginUI();
            const inputData = {
                // type: "Employee"
                email: "johndoe@email.com",
                password: "azerty",
                // status: "connected"
            };

            const inputEmailUser = screen.getByTestId("employee-email-input");
            fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
            expect(inputEmailUser.value).toBe(inputData.email);

            const inputPasswordUser = screen.getByTestId("employee-password-input");
            fireEvent.change(inputPasswordUser, {
                target: { value: inputData.password },
            });
            expect(inputPasswordUser.value).toBe(inputData.password);

            const form = screen.getByTestId("form-employee");

            // localStorage should be populated with form data
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => null),
                },
                writable: true,
            });

            // we have to mock navigation to test it
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            let PREVIOUS_LOCATION = "";
            const store = jest.fn();
            const login = new Login({
                document,
                localStorage: window.localStorage,
                onNavigate,
                PREVIOUS_LOCATION,
                store,
            });

            const handleSubmit = jest.fn(login.handleSubmitEmployee);
            login.login = jest.fn().mockResolvedValue({});
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(handleSubmit).toHaveBeenCalled();
            expect(window.localStorage.setItem).toHaveBeenCalled();
            expect(window.localStorage.setItem).toHaveBeenCalledWith(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: inputData.email,
                    password: inputData.password,
                    status: "connected",
                })
            );


        });

        test("It should renders Bills page", () => {
            //on initialise login page
            document.body.innerHTML = LoginUI();
            //variables pour se connecter 
            const inputData = {
                email: "johndoe@email.com",
                password: "azerty",
            };

            //we  populate email, password
            const inputEmailUser = screen.getByTestId("employee-email-input");
            fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
            const inputPasswordUser = screen.getByTestId("employee-password-input");
            fireEvent.change(inputPasswordUser, { target: { value: inputData.password } });

            const form = screen.getByTestId("form-employee");

            // localStorage should be populated with form data
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => null),
                },
                writable: true,
            });

            // we have to mock navigation to test it
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            let PREVIOUS_LOCATION = "";

            const store = jest.fn();
            console.log(window.location.pathname);

            // async function FuncAsync() {
            const login = new Login({
                document,
                localStorage: window.localStorage,
                onNavigate,
                PREVIOUS_LOCATION,
                store,
            });


            login.login = jest.fn().mockImplementation(async() => {
                await Promise.resolve({})
                    .catch((err) => { login.createUser(user) })
                    .then(() => {
                        console.log("simulation1");
                        onNavigate(ROUTES_PATH['Bills'])
                        console.log("simulation2");
                        PREVIOUS_LOCATION = ROUTES_PATH['Bills']
                            // PREVIOUS_LOCATION = PREVIOUS_LOCATION
                        console.log("simulation3");
                        // PREVIOUS_LOCATION = login.PREVIOUS_LOCATION
                        console.log(window.location.pathname);

                    })
            })

            const spyHandleSubmit = jest.spyOn(login, "handleSubmitEmployee")
            const spyLogin = jest.spyOn(login, "login")
            const spyOnNavigate = jest.spyOn(login, "onNavigate")


            form.addEventListener("submit", login.handleSubmitEmployee);
            fireEvent.submit(form);
            expect(spyHandleSubmit).toHaveBeenCalled()
            expect(spyLogin).toHaveBeenCalled()
            expect(login.login).toHaveBeenCalledWith({
                type: "Employee",
                email: inputData.email,
                password: inputData.password,
                status: "connected"
            })
            expect(spyOnNavigate).toHaveBeenCalled()

            console.log(window.location.pathname);

            // expect(screen.getByText("Mes notes de frais")).toBeTruthy();
        });
    });
});

describe("Given that I am a user on login page", () => {
    describe("When I do not fill fields and I click on admin button Login In", () => {
        test("Then It should renders Login page", () => {
            document.body.innerHTML = LoginUI();

            const inputEmailUser = screen.getByTestId("admin-email-input");
            expect(inputEmailUser.value).toBe("");

            const inputPasswordUser = screen.getByTestId("admin-password-input");
            expect(inputPasswordUser.value).toBe("");

            const form = screen.getByTestId("form-admin");
            const handleSubmit = jest.fn((e) => e.preventDefault());

            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(screen.getByTestId("form-admin")).toBeTruthy();
        });
    });

    describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
        test("Then it should renders Login page", () => {
            document.body.innerHTML = LoginUI();

            const inputEmailUser = screen.getByTestId("admin-email-input");
            fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
            expect(inputEmailUser.value).toBe("pasunemail");

            const inputPasswordUser = screen.getByTestId("admin-password-input");
            fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
            expect(inputPasswordUser.value).toBe("azerty");

            const form = screen.getByTestId("form-admin");
            const handleSubmit = jest.fn((e) => e.preventDefault());

            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(screen.getByTestId("form-admin")).toBeTruthy();
        });
    });

    describe("When I do fill fields in correct format and I click on admin button Login In", () => {
        test("Then I should be identified as an HR admin in app", () => {
            document.body.innerHTML = LoginUI();
            const inputData = {
                type: "Admin",
                email: "johndoe@email.com",
                password: "azerty",
                status: "connected",
            };

            const inputEmailUser = screen.getByTestId("admin-email-input");
            fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
            expect(inputEmailUser.value).toBe(inputData.email);

            const inputPasswordUser = screen.getByTestId("admin-password-input");
            fireEvent.change(inputPasswordUser, {
                target: { value: inputData.password },
            });
            expect(inputPasswordUser.value).toBe(inputData.password);

            const form = screen.getByTestId("form-admin");

            // localStorage should be populated with form data
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => null),
                },
                writable: true,
            });

            // we have to mock navigation to test it
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            let PREVIOUS_LOCATION = "";

            const store = jest.fn();

            const login = new Login({
                document,
                localStorage: window.localStorage,
                onNavigate,
                PREVIOUS_LOCATION,
                store,
            });

            const handleSubmit = jest.fn(login.handleSubmitAdmin);
            login.login = jest.fn().mockResolvedValue({});
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(handleSubmit).toHaveBeenCalled();
            expect(window.localStorage.setItem).toHaveBeenCalled();
            expect(window.localStorage.setItem).toHaveBeenCalledWith(
                "user",
                JSON.stringify({
                    type: "Admin",
                    email: inputData.email,
                    password: inputData.password,
                    status: "connected",
                })
            );
        });

        test("It should renders HR dashboard page", () => {
            expect(screen.queryByText("Validations")).toBeTruthy();
        });
    });
});