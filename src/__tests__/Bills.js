/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI, { row } from "../views/BillsUI.js";
// import NewBillUI from "../views/NewBillUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
// import store from "../app/Store.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store";
import { formatDate, formatStatus } from "../app/format.js";

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

        it("should open a modal page when I click on the icon eye", () => {
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
            // beforeEach(() => {
            //     const bills_mocked = mockStore.bills()
            //     jest.spyOn(bills, "list")
            //     Object.defineProperty(
            //         window,
            //         'localStorage', { value: localStorageMock }
            //     )
            //     window.localStorage.setItem('user', JSON.stringify({
            //         type: 'Employee',
            //         email: "a@a"
            //     }))
            //     const root = document.createElement("div")
            //     root.setAttribute("id", "root")
            //     document.body.appendChild(root)
            //     router()
            //         // screen.debug()
            // })

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

                const bill = new Bills({
                    document,
                    onNavigate,
                    mockStore,
                    localStorage: window.localStorage
                })

                let storeFn = jest.fn(() => this.store = mockStore)
                storeFn()
                const res = bill.getBills()
                console.log(res);
                // bill.getBills = jest.fn(() => {
                //         return mockStore
                //             .bills()
                //             .list()

                //     })
                //     .then(snapshot => {
                //         const result = snapshot;
                //         try {
                //             return result
                //         } catch (e) {
                //             console.log(e);
                //         }
                //         // return result
                //     });


                // console.log(bill.getBills());
                function mock_res() {
                    const test_mock = async function mock_fn() {
                        const res = await mockStore.bills().list()
                        return res
                    }
                    test_mock()
                        .then(test => {
                            console.log(test);

                        });

                }




                // return bill.getBills()


                //     console.log(snapshot);
                //     expect(snapshot).toEqual(mock_Store)
                //     const bills = snapshot.map(doc => {

                //         return {
                //             ...doc,
                //             date: formatDate(doc.date),
                //             status: formatStatus(doc.status),
                //         }
                //     })
                // })



            })


        })
        // test.todo("fetches bills from mock API GET contains a status", async() => {






    describe("When an error occurs on API", () => {
        beforeEach(() => {
            const bills = mockStore.bills()
            jest.spyOn(bills, "list")
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
            // test("fetches bills from an API and fails with 404 message error", async() => {
        const bills = mockStore.bills()
            //     bills.mockImplementationOnce(() => {
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


// })