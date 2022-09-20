<template lang="pug">
td(
  class="add-collection-list-image",
)
  Thumbnail(
    :alt="props.collection?.node?.title || 'No Image'",
    size="medium",
    :source="props.collection?.node?.image?.url || NoImage"
  )
td(
  class="text-left",
) {{ props.collection.node.title }}
td(
  class="text-right",
) {{ props.collection.node.productsCount }}
td
  ModalCollectionInfo(
    :collectionID="collectionID",
    :content="`Set loyalty point`",
    :action="`Set loyalty point`"
  )  
</template>
<script setup lang="ts">
import ModalCollectionInfo from "./ModalCollectionInfo.vue";
import NoImage from "../../assets/no-image.jpg";
const props = defineProps(["collection"]);
const collectionID = parseInt(props.collection.node.id.split("/").at(-1));
</script>đ
<style scoped lang="scss">
.add-collection-list-image {
  display: flex;
  justify-content: center;
}
</style>
