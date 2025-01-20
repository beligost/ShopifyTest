class CustomFeaturesProducts extends HTMLElement {
    constructor() {
        super();

        this.cartNotification = new CartNotification();
        this.customFeaturesProducts = document.querySelector('.custom-features-products');
        this.productList = document.getElementById('product-list');
        this.sectionId = document.querySelector('#product-list').dataset.sectionId;
    }

    connectedCallback() {

        this.customFeaturesProducts.addEventListener('submit', (event) => {
            event.preventDefault();

            const config = fetchConfig('javascript');
            const formData = new FormData(event.target);

            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];

            formData.append('sections', this.cartNotification
                .getSectionsToRender()
                .map((section) => section.id)
            );

            formData.append('sections_url', window.location.pathname);
            config.body = formData;

            this.cartNotification.setActiveElement(document.activeElement);

            this.addToCart(config);
        })
    }

    async addToCart(config) {
        try {
            const response = await fetch(routes.cart_add_url, config);
            const cartResult = await response.json();

            this.renderCartNotification(cartResult);
            this.renderSection();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    async renderSection() {
        try {
            const response = await fetch(`${window.location.pathname}?section_id=${this.sectionId}`);
            const sectionHtml = await response.text();
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(sectionHtml, 'text/html');
            const updatedSection = htmlDoc.querySelector('#product-list');

            if (updatedSection) {
                this.updateProductList(updatedSection);
            }
        } catch (error) {
            console.error('Error rendering section:', error);
        }
    }

    renderCartNotification(result) {
        this.cartNotification.renderContents(result);
    }

    updateProductList(updatedSection) {
        if (this.productList) {
            this.productList.innerHTML = updatedSection.innerHTML;
        }
    }
}

customElements.define('custom-features-products', CustomFeaturesProducts);