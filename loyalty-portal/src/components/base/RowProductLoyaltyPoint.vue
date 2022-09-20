<template lang="pug">
td(
  class="product-list-image",
)
  Thumbnail(
    :alt="props.product?.title || 'No Image'",
    size="medium",
    :source="props.product?.image_src || NoImage"
  )
td(
  class="text-left",
) {{ props.product.title }}
td {{ props.product.created_at }}
td {{ props.product.updated_at ? 0 : 0 }}
td(
  class="text-right",
) {{ props.product.loyalty_point ? 0 : 0 }}
td
  //- ModalProductInfo(
  //-   :productID="props.product.product_id",
  //-   :content="`Edit loyalty point`",
  //-   :action="`Edit loyalty point`"
  //- )
  Button Edit Loyalty Point

</template>
<script setup lang="ts">
import ModalProductInfo from "./ModalProductInfo.vue";
import NoImage from "@/assets/no-image.jpg";
const props = defineProps(["product"]);
</script>
<style lang="scss">
.product-list-image {
  display: flex;
  justify-content: center;
}
</style>
