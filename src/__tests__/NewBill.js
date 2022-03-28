/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import VerticalLayout from "../views/VerticalLayout"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
// import store from "../app/Store.js";
import router from "../app/Router.js";
import mockStore, { mockedBills } from "../__mocks__/store"

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then  It should renders NewBill Page", () => {
            //on initialise newBill page
            const html = NewBillUI();
            document.body.innerHTML = html;

            //variables pour créer un newBill 
            const inputData = {
                type: "Restaurants et bars",
                name: "welcome bisnes dinner",
                date: "2022-03-25",
                amount: "350",
                vat: "70",
                pct: "20",
                commentary: "on s'amuse",
                fileUrl: "",
                fileName: "Bill_test.jpg",
                // type: "Employee",
                email: "johndoe@email.com",
                // status: "connected"
            };
            const type = screen.getByTestId("expense-type");
            fireEvent.change(type, { target: { value: inputData.type } });
            expect(type.value).toBe(inputData.type);

            const name = screen.getByTestId("expense-name");
            fireEvent.change(name, { target: { value: inputData.name } });
            expect(name.value).toBe(inputData.name);

            const date = screen.getByTestId("datepicker");
            fireEvent.change(date, { target: { value: inputData.date } });
            expect(date.value).toBe(inputData.date);

            const amount = screen.getByTestId("amount");
            fireEvent.change(amount, { target: { value: inputData.amount } });
            expect(amount.value).toBe(inputData.amount);

            const vat = screen.getByTestId("vat");
            fireEvent.change(vat, { target: { value: inputData.vat } });
            expect(vat.value).toBe(inputData.vat);

            const pct = screen.getByTestId("pct");
            fireEvent.change(pct, { target: { value: inputData.pct } });
            expect(pct.value).toBe(inputData.pct);

            const commentary = screen.getByTestId("commentary");
            fireEvent.change(commentary, { target: { value: inputData.commentary } });
            expect(commentary.value).toBe(inputData.commentary);

        })




    })
    describe("When I am on the NewBill page and I click choose file", () => {

        beforeEach(() => {
            const html = NewBillUI();
            document.body.innerHTML = html;
        })

        test("It should attach a file after  func handleChangeFile", async() => {
            //variables pour créer un newBill 
            const inputData = {
                file: "Bill_test.jpg",
            };

            // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            const user = JSON.stringify({
                type: 'Employee'
            })

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee',
                    email: 'johndoe@email.com',
                }))
                // we have to mock navigation to test it. data is for BillsUI
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname, data: [] });
            };

            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            })
            newBill.updateBill = jest.fn()

            const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
            const Inputfile = screen.getByTestId("file");
            expect(Inputfile).toBeTruthy()

            Inputfile.addEventListener("change", handleChangeFile)

            fireEvent.change(Inputfile, {
                target: {
                    files: [
                        new File(["image"],
                            inputData.file, { type: 'image/jpg' })
                    ]
                }
            });
            // await newBill.store()
            expect(handleChangeFile).toHaveBeenCalled();
            expect(Inputfile.files[0].name).toEqual(inputData.file);

        })

    })

})
describe("when I click submit", () => {
    //test d'intégration POST
    test.todo("handleSubmit")
    test.todo("when I click submit the bill must post on the data POST")


})