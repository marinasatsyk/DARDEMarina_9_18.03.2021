/**
 * @jest-environment jsdom
 */

import { fireEvent, getByText, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI, { row } from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store";
import { formatDate, formatStatus } from "../app/format.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async() => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')

            expect(windowIcon.classList.contains("active-icon")).toBeTruthy();

        })

        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills })
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })
    })
})


describe("Given I am connected as an employee", () => {

    describe("When I navigate to Bill page", () => {

        let onNavigate, bill;
        beforeEach(() => {
            //we have to mock localStorage
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            //we have to mock navifation
            onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname, data: [] })
            }

            //we have to declarate an instance of Bills for populate the screen
            bill = new Bills({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage
            })

            document.body.innerHTML = BillsUI({ data: bills });
        })

        test("fetches bills from mock API GET should be display on the screen", async() => {

            //we have to spy the function (getBills) being checked 
            const get_Bills_spy = jest.spyOn(bill, "getBills")
            const results = await bill.getBills();
            expect(get_Bills_spy).toHaveBeenCalled();

            //we verify to all elements of mockstore being display on the screen
            results.map(r => {
                // try to find name and type of each bill
                expect(screen.getByText(r.name)).toBeTruthy();
                expect(screen.getByText(r.type)).toBeTruthy();
            })
        })


        test("it should return an array with bills mocked with changed date, status", async() => {
            // expected formated status
            const statusExpected = ['Refused', 'Accepté', 'En attente'];
            // original mocked data
            const mockedData = await mockStore.bills().list();
            // formatted data (after getBills)
            const formattedData = await bill.getBills();
            // for each bill ...
            formattedData.map(formatedBill => {
                // assert status is in the expected results array
                expect(statusExpected.includes(formatedBill.status)).toBeTruthy();
                // get mocked bill by its id
                const mockedBill = mockedData.find(m => m.id === formatedBill.id);
                // compare mocked date formatted with formattedBill date
                let mockedDate;
                try {
                    mockedDate = formatDate(mockedBill.date);
                } catch (err) {
                    mockedDate = mockedBill.date;
                }
                // finally compare dates
                expect(formatedBill.date).toBe(mockedDate);
            })
        })
    })

})

describe("Given I am connected as an employee", () => {

    describe("When I am on Bills Page", () => {

        beforeAll(() => { //we have to mock localStorage
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
        })

        let onNavigate, bill;
        beforeEach(() => {

            //we have to mock navifation
            onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname, data: [] })
            }

            bill = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })

            document.body.innerHTML = BillsUI({ data: bills });
        })


        test("It should open a modal page when I click on the icon eye", () => {
            //we get all elements being checking
            const icons = screen.getAllByTestId('icon-eye')
            expect(icons).toBeTruthy

            //we have get an element for check
            let icon_test = icons[0];

            // we spy the function being checking
            const handleClickIconEye_test = jest.spyOn(bill, "handleClickIconEye");


            icon_test.addEventListener('click', bill.handleClickIconEye(icon_test))

            //we emulate user event
            userEvent.click(icon_test)
            expect(handleClickIconEye_test).toHaveBeenCalled()
            expect(handleClickIconEye_test).toBeCalledWith(icon_test);

            let modal = screen.getByTestId("modaleFileEmployee")
            expect(modal).toBeTruthy()
        })


        test("should navigate to  new bill page when I click newBill", () => {

            //we get all elements being checking
            const buttonNewBill = screen.getByTestId("btn-new-bill");
            expect(buttonNewBill).toBeTruthy();

            buttonNewBill.addEventListener("click", bill.handleClickNewBill);
            userEvent.click(buttonNewBill)

            expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
        })

    })

})


describe("Given I am connected as an employee", () => {

    describe("When an error occurs on API", () => {

        let onNavigate, bill;

        beforeEach(() => {
            //we have to mock localStorage
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            //we have to mock navifation
            onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname, data: [] })
            }

            bill = new Bills({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage
            })

            document.body.innerHTML = BillsUI({ data: bills });
        })

        test('it should return an error page while seeding an error value', async() => {
            const errorMessage = "Something's wrong like a 404 or 500";
            const html = BillsUI({ error: errorMessage });
            document.body.innerHTML = html;
            const message = await screen.getByText(errorMessage);
            expect(message).toBeTruthy();
        })

        test("it should return an error 500", async() => {
            //we have to mock an promisse reject
            const mockStoreFail = {
                bills: () => {
                    return {
                        list: () => {
                            return Promise.reject([{}])
                        }
                    }
                }
            }

            const bill = new Bills({
                document,
                onNavigate,
                store: mockStoreFail,
                localStorage: window.localStorage
            })

            try {
                await bill.getBills()
                expect(false).toBeTruthy();
            } catch (err) {
                expect(true).toBeTruthy();
                expect(false).not.toBeTruthy();

            }
        })
    })

})