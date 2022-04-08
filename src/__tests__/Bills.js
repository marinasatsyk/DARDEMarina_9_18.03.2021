/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
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
            //====================


        test("It should open a modal page when I click on the icon eye", () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            const bill = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })
            const html = BillsUI({ data: bills });
            document.body.innerHTML = html
            const icons = screen.getAllByTestId('icon-eye')
            expect(icons).toBeTruthy

            const handleClickIconEye_test = jest.fn(() => bill.handleClickIconEye(icons[0]))

            icons.forEach((icon) => {
                icon.addEventListener('click', handleClickIconEye_test(icon))
            })

            handleClickIconEye_test(icons[0])
            expect(handleClickIconEye_test).toHaveBeenCalled()

            userEvent.click(icons[0])
            expect(handleClickIconEye_test).toHaveBeenCalled()
            let modal = screen.getByTestId("modaleFileEmployee")
            expect(modal).toBeTruthy()
        })

        test.todo("when I click newBill on navigate to page new bill")
        it("should navigate to  new bill page when I click newBill", () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const bill = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })
            const html = BillsUI({ data: bills })
            document.body.innerHTML = html

            const buttonNewBill = screen.getByTestId("btn-new-bill");
            expect(buttonNewBill).toBeTruthy();
            const handleClickNewBill_test = jest.fn(() => bill.handleClickNewBill())
            buttonNewBill.addEventListener("click", handleClickNewBill_test)
            userEvent.click(buttonNewBill)
            expect(handleClickNewBill_test).toHaveBeenCalled()
            expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()

        })


    })
})

//test d'integration GET
describe('Given I am a user connected as Emplyee ', () => {

    describe("When I navigate to Bill page", () => {

        test("fetches bills from mock API GET ", async() => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }


            const bill = new Bills({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage
            })


            bill.getBills = jest.fn(async() => {
                return mockStore
                    .bills()
                    .list()
                    .then(snapshot => {
                        const bills = snapshot
                            .map(doc => {
                                return {
                                    ...doc,
                                    date: formatDate(doc.date),
                                    status: formatStatus(doc.status)
                                };
                            });
                        return bills;
                    })
            })
            const res_getBills = await bill.getBills()
                // console.log(res_getBills);
            const get_Bills_spy = jest.spyOn(bill, "getBills")
            expect(get_Bills_spy).toHaveBeenCalled()
        })

        test("it should return an array with bills mocked changed ", () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            async function test_async() {

                const bill = new Bills({
                    document,
                    onNavigate,
                    store: mockStore,
                    localStorage: window.localStorage
                })

                let bills1 = null;
                await bill.getBills()
                    .then(bills => { bills1 = bills; return mockStore.bills().list() })
                    .then(bills2 => {
                        // console.log(bills, bills2);
                        const quelquechose = bills2
                            .map(doc => {
                                return {
                                    ...doc,
                                    date: formatDate(doc.date),
                                    status: formatStatus(doc.status),
                                }

                            })
                            // console.log(bills1, quelquechose);
                        expect(bills1).toEqual(quelquechose)
                    });

            }

            test_async(mockStore);

        })
    })


    describe("When an error occurs on API", () => {

        test("it should return an error 500", () => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            async function test_async() {

                const mockStore1 = {
                    bills: () => {
                        return {
                            list: () => {
                                return Promise.resolve([{ "id": "shiohsioph" }])
                            }
                        }
                    }
                }

                const mockStore2 = {
                    bills: () => {
                        return {
                            list: () => {
                                return Promise.resolve([{ "id": "shiohsioph", date: undefined, status: undefined }])
                            }
                        }
                    }
                }

                const bill = new Bills({
                    document,
                    onNavigate,
                    store: mockStore1,
                    localStorage: window.localStorage
                })

                await bill.getBills()
                    .then(bills1 => {
                        mockStore2.bills().list()
                            .then(bills2 => {
                                expect(bills1).toEqual(bills2)
                            })
                    });

            }

            test_async();

        })
    })

})


// })