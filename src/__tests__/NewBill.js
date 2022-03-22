/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import store from "../app/Store.js";
import router from "../app/Router.js";
import mockStore, { mockedBills } from "../__mocks__/store"

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {






        test.todo("func handleChangeFile")





    })

    describe("when I click submit", () => {
        //test d'intégration POST
        test.todo("handleSubmit")
        test.todo("when I click submit the bill added on the data POST")
            // test("Then ...", () => {
            //   const html = NewBillUI()
            //   document.body.innerHTML = html
            //   //to-do write assertion
            // })

    })
})