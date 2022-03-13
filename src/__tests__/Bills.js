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
                // expect(windowIcon).toBeTruthy();
            expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
            // expect(waitFor(() => screen.getByTestId('icon-window'))).toEqual(windowIcon);

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
                // 

            //     let billUrl = "/fake_url"
            //     let icon_eye = `<div class="icon-actions">
            //     <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
            //     </div>
            //   </div>`;
            //     document.body.innerHTML += icon_eye;

            const bill = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })

            const html = BillsUI({ data: bills });
            document.body.innerHTML = html
            const icons = screen.getAllByTestId('icon-eye')
            const handleClickIconEye_test = jest.fn((e) => bill.handleClickIconEye(e, icons[0]))


            // icons.forEach((icon) => {
            //     icon.addEventListener('click', handleClickIconEye(icon))
            // })


            userEvent.click(icons[0])


            expect(handleClickIconEye_test).toHaveBeenCalled()


            // const modale = screen.getByRole('dialog')
            // expect(modale).toBeTruthy

            // const handleClickIconEye_test = jest.fn(bill, 'handleClickIconEye')

            // const modal_test = fn(() => bill.handleClickIconEye(icons[0]))

            // fireEvent.click(icons[0])
            // expect(modal_test).toHaveBeenCalled()
            // screen.debug()


        })


    })
})