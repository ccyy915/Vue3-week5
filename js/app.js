import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/api';
const apiPath = 'ccyy915';

const app = Vue.createApp({
    data() {
        return {
            // 讀取效果
            loadingStatus: {
                loadingItem: '',
            },
            // 產品列表
            products: [],
            // props 傳遞到內層的暫存資料
            product: {},
            // 表單結構
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            // 購物車列表
            cart: {},
        };
    },
    methods: {
        getProducts() {
            const api = `${apiUrl}/${apiPath}/products`;
            axios.get(api)
                .then(res => {
                    this.products = res.data.products;
                })
        },
        openModal(item) {
            this.loadingStatus.loadingItem = item.id;
            const api = `${apiUrl}/${apiPath}/product/${item.id}`;
            axios.get(api)
                .then(res => {
                    this.product = res.data.product;
                    this.loadingStatus.loadingItem = '';
                    this.$refs.userProductModal.openModal();
                })
        },
        addCart(id, qty = 1) {
            this.loadingStatus.loadingItem = id;
            const cart = {
                product_id: id,
                qty
            }
            const api = `${apiUrl}/${apiPath}/cart`;
            axios.post(api, { data: cart })
                .then(res => {
                    this.loadingStatus.loadingItem = ''
                    this.getCart();
                })
        },
        getCart() {
            const api = `${apiUrl}/${apiPath}/cart`;
            axios.get(api)
                .then(res => {
                    this.cart = res.data.data
                    this.$refs.userProductModal.hideModal();
                })
        },
        removeCartItem(id) {
            this.loadingStatus.loadingItem = id;
            const api = `${apiUrl}/${apiPath}/cart/${id}`;
            axios.delete(api)
                .then(res => {
                    this.loadingStatus.loadingItem = ''
                    this.getCart();
                })
        },
        deleteAllCart() {
            const api = `${apiUrl}/${apiPath}/carts`;
            axios.delete(api)
                .then(res => {
                    this.getCart();
                })
        },
        updateCart(item) {
            this.loadingStatus.loadingItem = item.id;
            const api = `${apiUrl}/${apiPath}/cart/${item.id}`;
            const cart = {
                product_id: item.product.id,
                qty: item.qty
            }
            axios.put(api, { data: cart })
                .then(res => {
                    this.loadingStatus.loadingItem = '';
                    this.getCart()
                })
        },
        submitOrder() {
            const api = `${apiUrl}/${apiPath}/order`;
            const form = this.form;
            axios.post(api, { data: form })
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message);
                        this.$refs.form.resetForm();
                        this.getCart()
                    } else {
                        alert(res.data.message);
                    }
                })
        }
    },
    mounted() {
        this.getProducts();
        this.getCart();
        // this.$refs.userProductModal.openModal();
    },
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


app.component('userProductModal', productModal)
app.mount('#app');