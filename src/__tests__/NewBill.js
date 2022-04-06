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
import { header } from "express/lib/response"
import store from "../app/Store"

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {


    })

    describe("When I am on the NewBill page and I click choose file", () => {

        beforeEach(() => {
            const html = NewBillUI();
            document.body.innerHTML = html;
        })

        test("It should attach a file after func handleChangeFile", () => {
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
            });
            newBill.updateBill = jest.fn();

            const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
            const Inputfile = screen.getByTestId("file");
            expect(Inputfile).toBeTruthy()

            Inputfile.addEventListener("change", handleChangeFile)

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
            // await newBill.store()
            expect(handleChangeFile).toHaveBeenCalled();
            expect(Inputfile.files[0].name).toEqual(inputData.file);
            expect(newBill.handledFile).not.toBeNull();

        })

        test("it should display null when I attach a file that is not jpg,jpeg,png", () => {
            //variables pour créer un newBill 
            const inputData = {
                file: "Bill_test.pdf",
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
            expect(Inputfile).toBeTruthy();

            Inputfile.addEventListener("change", handleChangeFile);
            //write smth for show an error 
            const err = true;
            // function func_event (){

            // }
            // console.log("test false");
            fireEvent.change(Inputfile, {
                target: {
                    files: [
                        new File(["image"],
                            inputData.file, { type: 'image/pdf' })
                    ]
                }
            });

            // newBill.handleChangeFile()
            // console.log(handleChangeFile);
            expect(handleChangeFile).toHaveBeenCalled();
            expect(newBill.handledFile).toBeNull();
        })

    })

})
describe("when I click submit", () => {
    test("It  should calle handleSubmit function and show bill page", () => {
        //on initialise newBill page
        const html = NewBillUI();
        document.body.innerHTML = html;

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        const user = JSON.stringify({
            type: 'Employee'
        })

        // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: 'employee@test.tld',
            }))
            // we have to mock navigation to test it. data is for BillsUI


        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname, data: [] });
        };

        const newBill = new NewBill({
            document,
            onNavigate,
            store: null,
            localStorage: window.localStorage,
        })

        const SpyHandleSubmit = jest.spyOn(newBill, "handleSubmit")
        newBill.handleSubmit = jest.fn(() => {
            onNavigate(ROUTES_PATH['Bills'])
        })
        const form = screen.getByTestId("form-new-bill");
        expect(form).toBeTruthy()
        form.addEventListener("submit", newBill.handleSubmit)
        fireEvent.submit(form)
        expect(newBill.handleSubmit).toHaveBeenCalled()
            // screen.debug()
        expect(screen.getByText("Mes notes de frais")).toBeTruthy()

    })


    //test d'integration POST
    //tests d'intégration 

    test("when I click submit form it execute with post", async() => {

        const mockSt = mockStore.bills();
        const spyCreate = jest.spyOn(mockSt, "create");
        const bill = {
            fileName: "bill-abcde.jpg"
        };

        const response_create = await mockStore
            .bills()
            .create(bill);
        expect(spyCreate).toHaveBeenCalled();

        expect(response_create.fileUrl.includes("bill-abcde.jpg")).toBeTruthy()

    })

    test("when I click submit form it return json.obj bill  ", async() => {
        console.log("debut");

        //on initialise newBill page
        const html = NewBillUI();
        document.body.innerHTML = html;

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })

        const user = JSON.stringify({
            type: 'Employee'
        })

        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email: 'employee@test.tld',
        }))

        // we have to mock navigation to 
        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname, data: [] });
        };

        const newBill = new NewBill({
            document,
            onNavigate,
            store: store,
            localStorage: window.localStorage,
        })


        const inputData = {
            vat: "20",
            type: "Hôtel et logement",
            commentary: "",
            name: "Hôtel du centre ville",
            fileName: "bill-abcde.jpg",
            date: "2021-11-22",
            amount: "120",
            pct: "20"
        };

        const file = new File(
            ["image"],
            inputData.fileName, { type: 'image/jpg' }
        )

        const formData = new FormData();
        const email = JSON.parse(localStorage.getItem("user")).email;
        formData.append('file', file);
        formData.append('email', email);

        const _handleFile = {
            data: formData,
            fileName: inputData.fileName
        }
        newBill.handleSubmit = jest.fn((e) => {
            console.log("test start")

            e.preventDefault()
            console.log("1_1")

            if (!_handleFile) {
                console.log("err no info");
                return;
            }

            // return console.log(store
            //     .bills()
            //     .create({
            //         data: _handleFile.data,
            //         headers: { noContentType: true }
            //     }));
            store
                .bills()
                .create({
                    data: _handleFile.data,
                    headers: { noContentType: true }
                })
                .then(res => {
                    console.log(res)
                })
            console.log("2")


        })

        const spyMockstore = jest.spyOn(newBill, "create");


        const SpyHandleSubmit = jest.spyOn(newBill, "handleSubmit");
        console.log("3")

        const form = screen.getByTestId("form-new-bill");
        expect(form).toBeTruthy()
        console.log("4")
        const submit = newBill.handleSubmit;
        form.addEventListener("submit", submit)
        console.log("5")

        fireEvent.submit(form)
            // await  newBill.handleSubmit()
        console.log("6")

        expect(newBill.handleSubmit).toBeCalled()
        expect(SpyHandleSubmit).toBeCalled()

    })
})







//     //variables pour créer un newBill 
//     const type = screen.getByTestId("expense-type");
//     fireEvent.change(type, { target: { value: inputData.type } });
//     expect(type.value).toBe(inputData.type);

//     const name = screen.getByTestId("expense-name");
//     fireEvent.change(name, { target: { value: inputData.name } });
//     expect(name.value).toBe(inputData.name);

//     const date = screen.getByTestId("datepicker");
//     fireEvent.change(date, { target: { value: inputData.date } });
//     expect(date.value).toBe(inputData.date);

//     const amount = screen.getByTestId("amount");
//     fireEvent.change(amount, { target: { value: inputData.amount } });
//     expect(amount.value).toBe(inputData.amount);

//     const vat = screen.getByTestId("vat");
//     fireEvent.change(vat, { target: { value: inputData.vat } });
//     expect(vat.value).toBe(inputData.vat);

//     const pct = screen.getByTestId("pct");
//     fireEvent.change(pct, { target: { value: inputData.pct } });
//     expect(pct.value).toBe(inputData.pct);

//     const commentary = screen.getByTestId("commentary");
//     fireEvent.change(commentary, { target: { value: inputData.commentary } });
//     expect(commentary.value).toBe(inputData.commentary);

//     //============file mock

//     const handleFile = {
//         data: new FormData(),
//         fileName: inputData.fileName
//     }


//     // console.log(handleFile());
//     const Inputfile = screen.getByTestId("file");
//     expect(Inputfile).toBeTruthy();
//     //============file


//     // newBill.handleSubmit = jest.fn(async() => {
//     //     newBill.store.bills().create() = jest.fn(() => {
//     //         await Promise.resolve({ fileUrl: 'https://localhost:3456/images/Bill_test.jpg', key: '1234' })
//     //     })


//     //     .then(bD => {
//     //         const { fileUrl, key, fileName } = bD;

//     //         console.log("store create working");
//     //         this.billId = key
//     //         console.log(key);
//     //         this.fileUrl = fileUrl
//     //         console.log(this.fileUrl);
//     //         this.fileName = fileName;
//     //     })

//     // })

// })