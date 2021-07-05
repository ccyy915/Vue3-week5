export default {
    template: `<div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
            <span class="badge bg-success me-1">{{ productDetail.category }}</span>
            <h5 class="modal-title">{{ productDetail.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <img class="img-fluid mb-1" :src="productDetail.imageUrl">
            <p class="h6">商品描述： <span class="fw-light">{{ productDetail.description }}</span></p>
            <p class="h6">商品內容： <span class="fw-light">{{ productDetail.content }}</span></p>
            <div class="float-end">
                <div class="h5" v-if="!productDetail.price">{{ productDetail.origin_price }} 元</div>
                <div class="h6" v-if="productDetail.price">原價{{ productDetail.origin_price }} 元</div>
                <div class="h5" v-if="productDetail.price">{{ productDetail.price }} 元</div>
            </div>
        </div>
        <div class="modal-footer">
            <div class="input-group mb-3">
                <input type="number" class="form-control" v-model.number="qty" min="1">
                <button type="button" class="btn btn-outline-success" @click="$emit('add-cart', productDetail.id, qty)">加入購物車</button>
            </div>
        </div>
      </div>
    </div>
  </div>`,
    props: ['product'],
    data() {
        return {
            status: {},
            productDetail: {},
            modal: '',
            qty: 1,

        };
    },
    watch: {
        product() {
            this.productDetail = this.product;
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
    },
}