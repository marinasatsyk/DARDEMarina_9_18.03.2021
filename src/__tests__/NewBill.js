/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test.todo("tester la présence de champs")



        test.todo("type de depense")
        test.todo("nom de depense")
        test.todo("date")
        test.todo("montant")
        test.todo("commnetaire")
        test.todo("joindre un fichier")

        //test d'intégration
        test.todo("when I click submit the bill added on the data")
            // test("Then ...", () => {
            //   const html = NewBillUI()
            //   document.body.innerHTML = html
            //   //to-do write assertion
            // })
    })
})