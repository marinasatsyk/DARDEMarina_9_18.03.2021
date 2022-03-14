/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { row } from "../views/BillsUI.js"
import NewBillUI from "../views/NewBillUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Actions from "../views/Actions.js";
import Bills from "../containers/Bills.js";
import store from "../app/Store.js";
import router from "../app/Router.js";
import { modal } from "../views/DashboardFormUI.js"
import mockStore from "../__mocks__/store"
import { mockedBills } from "../__mocks__/store"

// jest.mock("../app/store", () => mockStore)

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
                //to-do write expect expression ... waitFor().toBeEqual(widowIcon)
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

        test("when I click on the icon eye  modal page opened", () => {
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
                // icons.forEach((icon) => {
                //     userEvent.click(icon)
                // })
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
            buttonNewBill.addEventListener("click", handleClickNewBill_test())

            userEvent.click(buttonNewBill)
            expect(handleClickNewBill_test).toHaveBeenCalled()
            expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()

        })


    })
})

//test d'integration GET
describe('Given I am a user connected as Emplyee ', () => {
    describe("When I navigate to Bill page", () => {
        test.todo("fetches bills from mock API GET contains a status")
            // test.todo("fetches bills from mock API GET contains a status", async() => {
            //     localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
            //     const root = document.createElement("div")
            //     root.setAttribute("id", "root")
            //     document.body.append(root)
            //     router()
            //     window.onNavigate(ROUTES_PATH.Bills)
            //         // to do smth
            // })
        describe("When an error occurs on API", () => {
            beforeEach(() => {
                jest.spyOn(mockStore, "bills")
                Object.defineProperty(
                    window,
                    'localStorage', { value: localStorageMock }
                )
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee',
                    email: "a@a"
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.appendChild(root)
                router()
            })

            test.todo("fetches bills from an API and fails with 404 message error")
                // test.todo("fetches bills from an API and fails with 404 message error", async() => {
                //     mockStore.bills.mockImplementationOnce(() => {
                //         return {
                //             list: () => {
                //                 return Promise.reject(new Error("Erreur 404"))
                //             }
                //         }
                //     })
                //     window.onNavigate(ROUTES_PATH.Bills)
                //     await new Promise(process.nextTick);
                //     const message = await screen.getByText(/Erreur 404/)
                //     expect(message).toBeTruthy()
                // })

            test.todo("fetches bills from an API and fails with 500 message error")
                // test.todo("fetches bills from an API and fails with 500 message error", async() => {
                //     mockStore.bills.mockImplementationOnce(() => {
                //         return {
                //             list: () => {
                //                 return Promise.reject(new Error("Erreur 500"))
                //             }
                //         }
                //     })
                //     window.onNavigate(ROUTES_PATH.Bills)
                //     await new Promise(process.nextTick);
                //     const message = await screen.getByText(/Erreur 500/)
                //     expect(message).toBeTruthy()
                // })



        })

    })


})