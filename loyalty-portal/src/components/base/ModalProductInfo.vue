<template lang="pug">
Modal(
  :open="active",
  @close="toggleActive"
)
  template(#activator)
    Button(
      @click="getProduct",
    ) {{ props.action }}
  template(#title)
    h1 {{ props.content }}
  template(#content)
    div(
      v-if="!isLoading",
      class="container",
    )
      .flex-product
        div(class="image-container")
          div(class="product-image")
            img(
              v-if="isHasImage",
              :src="productInfo.product.image.src",
              :alt="productInfo.product.title",
            )
            img(
              v-else,
              :src="NoImage",
            )
          ul(
            v-if="isHasImage",
            class="image-list"
          )
            li(
              v-for="(image, index) in productInfo.product.images",
              class="image-item",
              :key="index",
            )
              img(
                v-if="image.src",
                :src="image.src",
              )
          ul(
            v-else,
            class="image-list",
          )
            li( class="image-item" )
              img( :src="NoImage" )
            li( class="image-item" )
              img( :src="NoImage" )
            li( class="image-item" )
              img( :src="NoImage" )
        div(class="detail-container")
          p title
          h3 {{ productInfo.product.title }}
          h4 ${{ productInfo.product.variants[0].price }}
          hr
          p color/size
          ul(class="variant-list")
            li(
              v-for="(variant, index) in productInfo.product.variants",
              :key="index"
            )
              h4 {{ variant.title }}
          hr
          div(class="action")
            div()
              p loyalty point(s)
              input(
                type="number",
                v-model="loyaltyPoint",
                @focus="onFocus",
              )
            Button(
              v-if="props.content==='Edit loyalty point'",
              :disabled="isDisable",
              @click="updateLoyalProduct",
            ) Save
            Button(
              v-if="props.content==='Edit loyalty point'",
              :disabled="isDisable",
              @click="refeshLoyaltyPoint",
            ) Reset
            Button(
              v-if="props.content==='Set loyalty point'",
              :disabled="isDisable",
              @click="addLoyalProduct",
            )  Set loyalty point
    div(v-else)
        Layout
          LayoutSection
            Card(:sectioned="true")
              SkeletonBodyText
            Card(:sectioned="true")
              SkeletonBodyText
            Card(:sectioned="true")
              SkeletonBodyText
          LayoutSection(:secondary="true")
            Card(:sectioned="true")
              SkeletonBodyText
            Card(:sectioned="true")
              SkeletonBodyText
            Card(:sectioned="true")
              SkeletonBodyText
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import NoImage from "@/assets/no-image.jpg";
import axios from "@/bootstrap/api-interceptor";
const props = defineProps(["content", "productID", "action"]);
const active = ref(false);
const loyaltyPoint = ref(0);
const productInfo = reactive({});
const isDisable = ref(true);
const isLoading = ref(false);
const router = useRouter();

const onFocus = () => {
  isDisable.value = false;
};
const toggleActive = () => {
  active.value = !active.value;
};

const refeshLoyaltyPoint = () => {
  loyaltyPoint.value = productInfo.loyaltyInfo?.loyalty_point;
  isDisable.value = true;
};

const isHasImage = computed(() => {
  return productInfo.product.images.length > 0;
});
const updateLoyalProduct = () => {
  axios
    .post(`/loyal-products/${props.productID}`, {
      loyalty_point: loyaltyPoint.value,
      title: productInfo.product.title,
      image_src: productInfo.product.image.src,
    })
    .then((data) => {
      console.log(data);
      isDisable.value = true;
      alert(`${productInfo.product.title} loyalty points updated`);
      router.go();
    })
    .catch((error) => {
      console.log(error);
    });
};
const addLoyalProduct = () => {
  axios
    .post(`/loyal-products/${props.productID}`, {
      loyalty_point: loyaltyPoint.value,
      title: productInfo.product.title,
      image_src: productInfo.product.image.src,
    })
    .then((data) => {
      console.log(data);
      isDisable.value = false;
      if (!productInfo.loyaltyInfo) {
        alert(productInfo.product.title + " loyalty points created");
      } else {
        alert(productInfo.product.title + " loyalty points updated");
      }
      router.push({ name: "product-loyalty-point-list" });
    })
    .catch((error) => {
      console.log(error);
    });
};
const getProduct = () => {
  active.value = !active.value;
  isLoading.value = true;
  axios
    .get(`/products/${props.productID}`)
    .then((data) => {
      isLoading.value = false;
      Object.assign(productInfo, data);
      if (productInfo.loyaltyInfo) {
        loyaltyPoint.value = productInfo.loyaltyInfo?.loyalty_point;
      }
      console.log(productInfo);
    })
    .catch((error) => {
      console.log(error);
    })
};
</script>
<style scoped lang="scss">
.flex-product {
  display: flex;
  flex-direction: row;
  .image-container {
    max-width: 64.5%;
    width: calc(64.5% - var(--grid-desktop-horizontal-spacing) / 2);
    .variant-list {
      list-style-type: none;
    }
    .product-image {
      width: 70%;
      height: 69%;
      margin-left: 15%;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
    .image-list {
      width: 94%;
      height: 29%;
      display: flex;
      list-style-type: none;
      flex-direction: row;
      li {
        width: 100%;
        height: 100%;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .detail-container {
    max-width: 34.5%;
    width: calc(34.5% - var(--grid-desktop-horizontal-spacing) / 2);
    p {
      font-size: 0.8rem;
      text-align: left;
    }
    .action {
      display: flex;
      flex-direction: column;
      input {
        width: 100%;
        border-radius: 0%;
      }
      button {
        margin-top: 3%;
      }
    }
  }
}
</style>
