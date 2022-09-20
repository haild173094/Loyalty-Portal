<template lang="pug">
Modal(
  :open="active",
  @close="toggleActive"
)
  template(#activator)
    Button( 
      @click="getCollection",
    ) {{ props.action }}
  template(#title) 
    h1 {{ props.content }}
  template(#content)
    div(
      v-if="collectionInfo.collection",
      class="container",
    )   
      div(class="detail-container")
        div(class="header-container")
          div(class="header-content")
            h2 {{ collectionInfo.collection?.title }}     
            h4 {{ collectionInfo.collection?.products_count || 0 }} products
          div(class="action")
            div(class="loyalty-point") loyalty point(s)
            input(
              type="number",
              v-model="loyaltyPoint",
              @focus="onFocus",
            )
            Button(
              v-if="props.content==='Set loyalty point'",
              :disabled="isDisable",
              @click="addLoyaltyCollection",
            )  Save 
            Button(
              v-if="props.content==='Edit loyalty point'",
              :disabled="isDisable",
              @click="updateLoyalCollection",
            ) Save
            Button(
              v-if="props.content==='Edit loyalty point'",
              :disabled="isDisable",
              @click="refeshLoyaltyPoint",
            ) Reset
        hr
        ul(
          id="product-list",
        )
          li(
            v-for="(product, index) in products",
            :key="index"
          )
            div(class="index") {{ index + 1 }}. 
            Thumbnail(
              :alt="product.title || 'No Image'",
              size="small",
              :source="product.image?.src || NoImage"
            )
            div(class="title") {{ product.title }}
            TextStyle(
              class="status",
              :variation="productStatus(product.status)",
            ) {{ product.status }}
        div( class="product-list-more")
          Spinner(
            v-if="isLoading",
            size="large")
          Button(
            v-else
            :plain="true",
            @click="getMoreProducts",
            :disabled="NextProducts === null",
          ) Show more products
    SkeletonPage(
      v-else,
      :primaryAction="false",
      :breadcrumbs="false",
    )
      Layout
        LayoutSection
          Card(:sectioned="true")
            SkeletonBodyText
          Card(:sectioned="true")
            SkeletonBodyText
          Card(:sectioned="true")
            SkeletonBodyText
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "@/bootstrap/api-interceptor";
import NoImage from "@/assets/no-image.jpg";
const props = defineProps(["content", "collectionID", "action"]);
const active = ref(false);
const isLoading = ref(false);
const loyaltyPoint = ref(0);
const collectionInfo = reactive({});
const products = reactive([]);
const NextProducts = ref("");
const isDisable = ref(true);
const router = useRouter();
const toggleActive = () => {
  active.value = !active.value;
};
const onFocus = () => {
  isDisable.value = false;
};
const productStatus = (status) => {
  if (status === "active") {
    return "positive";
  } else if (status === "draft") {
    return "warning";
  } else return "negative";
};
const addLoyaltyCollection = () => {
  axios
    .post(`/loyal-collections/${props.collectionID}`, {
      loyalty_point: loyaltyPoint.value,
      title: collectionInfo.collection.title,
      image_src: collectionInfo.collection.image.src,
    })
    .then((data) => {
      console.log(data);
      isDisable.value = false;
      if (!collectionInfo.loyaltyInfo) {
        alert(
          collectionInfo.collection.title + " collection loyalty points created"
        );
      } else {
        alert(
          collectionInfo.collection.title + " collection loyalty points updated"
        );
      }
      router.go();
    })
    .catch((error) => {
      console.log(error);
    });
};
const refeshLoyaltyPoint = () => {
  loyaltyPoint.value = collectionInfo.loyaltyInfo.loyalty_point;
  isDisable.value = true;
};
const updateLoyalCollection = () => {
  axios
    .post(`/loyal-collections/${props.collectionID}`, {
      loyalty_point: loyaltyPoint.value,
      title: collectionInfo.collection.title,
      image_src: collectionInfo.collection.image,
    })
    .then((data) => {
      console.log(data);
      isDisable.value = true;
      alert(collectionInfo.collection.title + " loyalty points updated");
      router.go();
    })
    .catch((error) => {
      console.log(error);
    });
};
const getCollection = () => {
  active.value = !active.value;
  isLoading.value = true;
  axios
    .get(`/collections/${props.collectionID}`)
    .then((data) => {
      isLoading.value = false;
      Object.assign(collectionInfo, data);
      loyaltyPoint.value = data.loyaltyInfo
        ? collectionInfo.loyaltyInfo.loyalty_point
        : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getProducts = () => {
  axios.get(`/collections/${props.collectionID}/products`).then((data) => {
    products.push(...data.body.products);
    NextProducts.value = data.link.next;
  });
};

const getMoreProducts = () => {
  isLoading.value = true;
  axios
    .get(
      `/collections/${props.collectionID}/products?page_info=${NextProducts.value}`
    )
    .then((data) => {
      isLoading.value = false;
      products.push(...data.body.products);
      NextProducts.value = data.link.next;
      setTimeout(() => {
        goToBottomScroll();
      }, 0);
    });
};
const goToBottomScroll = () => {
  let elem = document.getElementById("product-list");
  if (elem) {
    elem.scrollTop = elem.scrollHeight;
  }
};
getProducts();
</script>
<style scoped lang="scss">
@import "@/scss/base/_modal-collection-info.scss";
</style>
