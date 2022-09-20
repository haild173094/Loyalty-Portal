<template lang="pug">
td(
  class="collection-list-image",
)
  Thumbnail(
    :alt="props.collection?.title || 'No Image'",
    size="medium",
    :source="props.collection?.image_src || NoImage"
  )
td(
  class="text-left",
) {{ props.collection.title }}
td {{ props.collection.created_at }}
td {{ props.collection.updated_at ? 0 : 0}}
td(
  class="text-right",
) {{ props.collection.loyalty_point ? 0: 0 }}
td
  //- ModalCollectionInfo(
  //-   :collectionID="props.collection.collection_id",
  //-   :content="`Edit loyalty point`",
  //-   :action="`Edit loyalty point`",
  //- )
  Button Edit Loyalty Point
</template>
<script setup lang="ts">
import ModalCollectionInfo from "./ModalCollectionInfo.vue";
import NoImage from "../../assets/no-image.jpg";
const props = defineProps(["collection"]);
</script>
<style scoped lang="scss">
.collection-list-image {
  display: flex;
  justify-content: center;
}
</style>
