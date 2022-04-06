import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
        formNewBill.addEventListener("submit", this.handleSubmit)
        const file = this.document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", this.handleChangeFile)
        this.fileUrl = null
        this.fileName = null
        this.billId = null
        this._handleFile = null
        new Logout({ document, localStorage, onNavigate })

    }

    get handledFile() {
        return this._handleFile;
    }

    handleChangeFile = e => {
        e.preventDefault()
        this._handleFile = null;
        // console.log(e.target.files[0])
        if (e.target.files[0].type != "image/jpg" && e.target.files[0].type != "image/jpeg" && e.target.files[0].type != "image/png") {
            console.log(false)
            return false
        }

        const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
        const filePath = e.target.value.split(/\\/g)
        const fileName = filePath[filePath.length - 1]
        const formData = new FormData()
        const email = JSON.parse(localStorage.getItem("user")).email
        formData.append('file', file)
        formData.append('email', email)
            ////////
            // console.log(formData.get("file"));
            // console.log(formData.get("email"));

        this._handleFile = { data: formData, fileName }
        console.log(this._handleFile);
        return true;
    }



    handleSubmit = e => {
        console.log("start NewBill1");

        console.log(e);
        e.preventDefault()
        console.log("start NewBill2");
        if (!this._handleFile) {
            console.log("start NewBill3");
            console.log(this._handleFile);
            return
        }

        console.log("true newBill1");

        this.store
            .bills()
            .create({
                data: this._handleFile.data,
                headers: { noContentType: true }
            })

        .then(billData => {
            // spread operator \o/
            console.log("true newBill2");

            // console.log(billData);
            const { fileUrl, key, fileName } = billData;

            // console.log("store create working");
            this.billId = key
                // console.log(key);
            this.fileUrl = fileUrl
                // console.log(this.fileUrl);
            this.fileName = fileName;

            console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
            const email = JSON.parse(localStorage.getItem("user")).email
            const bill = {
                email,
                type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
                name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
                amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
                date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
                vat: e.target.querySelector(`input[data-testid="vat"]`).value,
                pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
                commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
                fileUrl: this.fileUrl,
                fileName: this.fileName,
                status: 'pending'
            }
            this.updateBill(bill)
            this.onNavigate(ROUTES_PATH['Bills'])

        })

        .catch(error => console.error(error))

    }

    // not need to cover this function by tests
    /* istanbul ignore next */
    updateBill = (bill) => {
        if (this.store) {
            this.store
                .bills()
                .update({ data: JSON.stringify(bill), selector: this.billId })
                .then(() => {
                    this.onNavigate(ROUTES_PATH['Bills'])
                })
                .catch(error => console.error(error))
        }
    }
}