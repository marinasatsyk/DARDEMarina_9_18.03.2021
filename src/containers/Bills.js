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
        new Logout({ document, localStorage, onNavigate })
    }

    handleClickNewBill = () => {
        this.onNavigate(ROUTES_PATH['NewBill'])
    }

    handleClickIconEye = (icon) => {
        console.log("environement du code");
        const billUrl = icon.getAttribute("data-bill-url")
        console.log(billUrl);
        //for search an error
        if (billUrl.type != "image/jpg" && billUrl.type != "image/jpeg" && billUrl.type != "image/png") {
            console.log(false)

        }
        // in jest environment methode modal() doesn't work  
        if (typeof jest !== 'undefined') {
            $.fn.modal = jest.fn();
        }
        const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
        $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
        $('#modaleFile').modal('show')

    }

    getBills = () => {

        if (this.store) {
            return this.store
                .bills()
                .list()
                .then(snapshot => {
                    console.log(snapshot);
                    const bills = snapshot
                        .map(doc => {
                            try {
                                return {
                                    ...doc,
                                    dateOrigin: doc.date,
                                    // formatDate : ne fonctionne pas -> 'jui'n ==='jui'llet
                                    // new Date(date) -> ne fonctionne pas pour toutes les dates.
                                    date: formatDate(doc.date),
                                    status: formatStatus(doc.status),
                                }
                            } catch (e) {
                                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                                // log the error and return unformatted date in that case
                                console.log(e, 'for', doc)
                                return {
                                    ...doc,
                                    dateOrigin: doc.date,
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