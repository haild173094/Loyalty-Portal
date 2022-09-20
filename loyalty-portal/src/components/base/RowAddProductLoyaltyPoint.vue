<template lang="pug">
td(
  class="add-product-list-image",
)
  Thumbnail(
    :alt="props.product.node.title || 'No Image'",
    size="medium",
    :source="props.product.node.images.edges[0].node.src || NoImage"
  )
td(
  class="text-left",
) {{ props.product.node.title }}
td(
  class="text-right",
) {{ props.product.node.variants.edges.length }}
td
  ModalProductInfo(
    :productID="productID",
    content="Set loyalty point",
    action="Set loyalty point",
  )        
</template>
<script setup lang="ts">
import ModalProductInfo from "./ModalProductInfo.vue";
import NoImage from "@/assets/no-image.jpg";
const props = defineProps(["product"]);
const productID = props.product.node.id.split("/").at(-1);
</script>
<style lang="scss">
.add-product-list-image {
  display: flex;
  justify-content: center;
}
</style>
