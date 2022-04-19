/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore, { mockedBills } from "../__mocks__/store"
import router from "../app/Router"
import store from "../__mocks__/store";


describe("Given I am connected as an employee on NewBill Page", () => {
    /**we prepare the environement for all tests */
    //we have to mock localStorage before all tests
    beforeAll(() => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email: 'johndoe@email.com',
        }))
    })

    afterAll(() => {
            window.localStorage.clear();
        })
        //we declare an variable for navigation
    var onNavigate;

    beforeEach(() => {
        document.body.innerHTML = NewBillUI();

        /* we have to mock navigation to test it. 
        data is for BillsUI*/

        onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname, data: [] });
        };

    })

    describe("then when I click 'choose file'", () => {

        var newBill;

        //variables for create one newBill 
        const inputData = {
            file: "bill-abcde.jpg",
        };
        var handleChangeFile;

        beforeEach(() => {
            newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });
            //we have to spy the function being check
            handleChangeFile = jest.spyOn(newBill, "handleChangeFile");
            const Inputfile = screen.getByTestId("file");
            // expect(Inputfile).toBeTruthy()

            Inputfile.addEventListener("change", newBill.handleChangeFile)

            fireEvent.change(Inputfile, {
                target: {
                    files: [
                        new File(
                            ["image"],
                            inputData.file, { type: 'image/jpg' }
                        )
                    ]
                }
            });
        })

        test("It should attach a file to the filerequester", () => {
            // step 1 : function called
            expect(handleChangeFile).toHaveBeenCalled();
        })

        test("when a file is changed then newBill contains file data", () => {
            expect(newBill.fileName).toEqual(inputData.file);
        })



        test("when I  click submit newBill form It displays bill page", () => {

            const inputData = {
                vat: "20",
                type: "Hôtel et logement",
                commentary: "",
                name: "AAAZZZaaazz0.123456789",
                date: "2021-11-22",
                amount: "120",
                pct: "20"
            };

            //variables pour créer un newBill 
            const form = screen.getByTestId("form-new-bill");
            expect(form).toBeTruthy()

            const type = screen.getByTestId("expense-type");
            const name = screen.getByTestId("expense-name");
            const date = screen.getByTestId("datepicker");
            const amount = screen.getByTestId("amount");
            const vat = screen.getByTestId("vat");
            const pct = screen.getByTestId("pct");
            const commentary = screen.getByTestId("commentary");
            //we do a simulation of the input actions of user in order to populate the fields required
            fireEvent.change(type, { target: { value: inputData.type } });
            fireEvent.change(name, { target: { value: inputData.name } });
            fireEvent.change(date, { target: { value: inputData.date } });
            fireEvent.change(amount, { target: { value: inputData.amount } });
            fireEvent.change(vat, { target: { value: inputData.vat } });
            fireEvent.change(pct, { target: { value: inputData.pct } });
            fireEvent.change(commentary, { target: { value: inputData.commentary } });

            //we have to spy the fucntion being check
            const SpyHandleSubmit = jest.spyOn(newBill, "handleSubmit");
            form.addEventListener("submit", newBill.handleSubmit);
            fireEvent.submit(form);

            expect(SpyHandleSubmit).toHaveBeenCalled();
            //we check if the page of bills opened
            expect(screen.getByText("Mes notes de frais")).toBeTruthy();

        })

    })

})