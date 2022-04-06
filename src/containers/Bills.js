import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
        if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
        const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
        if (iconEye) iconEye.forEach(icon => {
            icon.addEventListener('click', (e) => this.handleClickIconEye(icon))
        })
        this.v = 12;
        new Logout({ document, localStorage, onNavigate })
    }

    handleClickNewBill = () => {
        this.onNavigate(ROUTES_PATH['NewBill'])
    }

    handleClickIconEye = (icon) => {

        const billUrl = icon.getAttribute("data-bill-url")
        if (billUrl.type != "image/jpg" && billUrl.type != "image/jpeg" && billUrl.type != "image/png") {
            console.log(false)

        }
        // in jest environment
        if (typeof jest !== 'undefined') {
            $.fn.modal = jest.fn();
        }
        const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
        $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
        $('#modaleFile').modal('show')

    }

    getBills = () => {
        //env jest
        // if (typeof jest !== 'undefined') {
        //     this.store = jest.fn();
        // }
        if (this.store) {
            return this.store
                .bills()
                .list()
                .then(snapshot => {
                    console.log(snapshot);
                    const bills = snapshot
                        .map(doc => {
                            if (this.vv == 12) {
                                console.log("salut");
                            }
                            // console.log(doc);
                            try {
                                return {
                                    ...doc,
                                    date: formatDate(doc.date),
                                    status: formatStatus(doc.status),

                                }
                            } catch (e) {
                                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                                // log the error and return unformatted date in that case
                                console.log(e, 'for', doc)
                                return {
                                    ...doc,
                                    date: doc.date,
                                    status: formatStatus(doc.status)
                                }
                            }
                        })
                    console.log('length', bills.length)
                    console.log(window.location.hash);
                    return bills
                })
        }
    }
}