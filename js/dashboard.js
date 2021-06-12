import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

let proModal = '';
let delModal = '';

const app = createApp({
    data() {
        return {
            apiUrl: "https://vue3-course-api.hexschool.io",
            apiPath: "ccyy915",
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
            pagination: {}
        }
    },
    components: {
        pagination
    },
    methods: {
        getData(page = 1) { // page default
            console.log("start getting data...");
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data);
                        this.products = res.data.products;
                        this.pagination = res.data.pagination;
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        updateData(tempProduct) {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
                http = "put";
            }

            axios[http](url, { data: tempProduct })
                .then(res => {
                    console.log(res.data);
                    if (res.data.success) {
                        alert(res.data.message);
                        proModal.hide();
                        this.getData();
                    } else {
                        alert(res.data.message);
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        deleteData(tempProduct) {
            console.log('start deleting...');
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`)
                .then(res => {
                    if (!res.data.success) {
                        alert(res.data.message);
                        return;
                    } else {
                        alert(res.data.message);
                        delModal.hide();
                        this.getData();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        openModal(isNew, item) {
            console.log("start opening modal...");
            if (isNew === "add") {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                proModal.show();
            } else if (isNew === "edit") {
                this.tempProduct = { ...item };
                this.isNew = false;
                proModal.show();
            } else if (isNew === "delete") {
                console.log("delete", item);
                this.tempProduct = { ...item };
                delModal.show();
            }
        },
        logout() {
            axios.post(`${this.apiUrl}/logout`)
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message);
                        let cookie = document.cookie.split(';');
                        for (let i = 0; i < cookie.length; i++) {
                            let chip = cookie[i],
                                entry = chip.split("="),
                                name = entry[0];
                            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        }
                        window.location.href = "index.html";
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    created() {
        console.log("start creating...");
        // get cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('您尚未登入請再次登入！');
            window.location = 'index.html';
        }
        axios.defaults.headers.common.Authorization = token;
        // Render 
        this.getData();
    },
    mounted() {
        console.log("start mounting...");
        // Modal
        proModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
    },
});

app.component('productModal', {
    props: {
        tempProduct: {
            imagesUrl: [],
        },
        isNew: false,
    },
    template:
        `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 id="productModalLabel" class="modal-title">
                        <span v-if="isNew">新增產品</span>
                        <span v-else>編輯產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <div class="input-group">
                                    <input type="file" class="form-control" id="imageFile" aria-label="Upload" accept=".jpg, .png" ref="imageFile" @change="getImage">
                                    <button class="btn btn-outline-secondary" :disabled="!imgData" type="submit" value="Upload" @click="uploadImage">上傳</button>
                                </div>
                            </div>
                            <div class="mb-1">
                                <div class="form-group">
                                    <label for="imageUrl">輸入圖片網址</label>
                                    <input type="text" class="form-control" placeholder="請輸入圖片連結"
                                        v-model="tempProduct.imageUrl">
                                </div>
                                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                            </div>
                            <!-- 多圖上傳 -->
                            <div>上傳多張圖片</div>
                            <div v-if="Array.isArray(tempProduct.imagesUrl)">
                                <div v-for="(item,key) in tempProduct.imagesUrl" :key="key" class="mb-2">
                                    <label :for="key">圖片網址</label>
                                    <div class="row mb-1">
                                        <div class="col-md-8">
                                            <input :id="key" type="text" v-model="tempProduct.imagesUrl[key]"
                                                class="form-control">
                                        </div>
                                        <div class="col-md-4">
                                            <button type="button" class="btn btn-danger"
                                                @click="tempProduct.imagesUrl.splice(key,1)">刪除圖片</button>
                                        </div>
                                    </div>
                                    <img :src="item" alt="" class="img-fluid">
                                </div>
                                <button type="button" class="btn btn-outline-primary btn-sm d-block w-100"
                                    @click="tempProduct.imagesUrl.push('')">新增圖片</button>
                                <!-- 多圖上傳 end -->
                            </div>
                            <div v-else>
                                <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">
                                    新增圖片
                                </button>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                                <label for="title">標題</label>
                                <input id="title" v-model="tempProduct.title" type="text" class="form-control"
                                    placeholder="請輸入標題">
                            </div>

                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="category">分類</label>
                                    <input id="category" v-model="tempProduct.category" type="text"
                                        class="form-control" placeholder="請輸入分類">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">單位</label>
                                    <input id="unit" v-model="tempProduct.unit" type="text" class="form-control"
                                        placeholder="請輸入單位">
                                </div>
                            </div>

                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="origin_price">原價</label>
                                    <input id="origin_price" v-model.number="tempProduct.origin_price" type="number"
                                        min="0" class="form-control" placeholder="請輸入原價">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">售價</label>
                                    <input id="price" v-model.number="tempProduct.price" type="number" min="0"
                                        class="form-control" placeholder="請輸入售價">
                                </div>
                            </div>
                            <hr>

                            <div class="form-group">
                                <label for="description">產品描述</label>
                                <textarea id="description" v-model="tempProduct.description" type="text"
                                    class="form-control" placeholder="請輸入產品描述">
                </textarea>
                            </div>
                            <div class="form-group">
                                <label for="content">說明內容</label>
                                <textarea id="content" v-model="tempProduct.content" type="text"
                                    class="form-control" placeholder="請輸入說明內容">
                </textarea>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input id="is_enabled" class="form-check-input" v-model="tempProduct.is_enabled"
                                        type="checkbox" :true-value="1" :false-value="0">
                                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-primary" @click="$emit('update-data', tempProduct)">
                        確認
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            apiUrl: "https://vue3-course-api.hexschool.io",
            apiPath: "ccyy915",
            imgData: null
        }
    },
    methods: {
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        getImage(e) {
            // console.log(e.target.files[0]);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file-to-upload', file);
            this.imgData = formData;
            // console.log(this.imgData);
        },
        uploadImage(e) {
            e.preventDefault();
            console.log(e);
            if (e.target.value == "Upload") {
                console.log("uploadImage");
                axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, this.imgData)
                    .then(res => {
                        if (res.data.success) {
                            // console.log(res.data);
                            this.imgData = null;
                            this.$refs.imageFile.value = '';
                            if (this.isNew) {
                                this.tempProduct.imageUrl = res.data.imageUrl;
                            } else {
                                this.tempProduct.imageUrl.push(res.data.imageUrl);
                            }
                            // console.log(this.tempProduct);
                        } else {
                            // console.log(res.data);
                            alert(res.data.message);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }
})

app.component('delProductModal', {
    props: ['tempProduct'],
    template:
        `<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 id="delProductModalLabel" class="modal-title">
                    <span>刪除產品</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                是否刪除
                <strong class="text-danger"></strong> {{tempProduct.title}} (刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-danger" @click="$emit('delete-data', tempProduct)">
                    確認刪除
                </button>
            </div>
        </div>
    </div>
</div>`
})

app.mount('#app');