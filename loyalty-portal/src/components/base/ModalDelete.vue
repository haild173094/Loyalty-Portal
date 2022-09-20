<template lang="pug">
Modal(
  v-if="props.secondaryAction"
  :open="active",
  @close="toggleActive",
  :primaryAction="{ content: props.primaryAction, onAction: onHandlePrimaryAction }"
  :secondaryActions="[{ content: props.secondaryAction, onAction: onHandleSecondaryAction },]"
)
  template(#activator)
    Button( 
      @click="toggleActive",
    ) {{ props.content }}
  template(#title)
    h2 {{ props.content }}
  template(#content)
    ModalSection
      TextContainer
        p Are you sure to delete this discount type ? Deactivate for use in the future ?
Modal(
  v-else,
  :open="active",
  @close="toggleActive",
  :primaryAction="{ content: props.primaryAction, onAction: onHandlePrimaryAction }"
)
  template(#activator)
    Button( 
      @click="toggleActive",
    ) {{ props.content }}
  template(#title)
    h2 {{ props.content }}
  template(#content)
    ModalSection
      TextContainer
        p Are you sure to delete this discount type ?
</template>
<script setup lang="ts">
import { ref } from "vue";
import axios from "@/bootstrap/api-interceptor";
import { useRouter } from "vue-router";

const props = defineProps([
  "discountType",
  "primaryAction",
  "secondaryAction",
  "content",
]);

const active = ref(false);
const router = useRouter();

const toggleActive = () => {
  active.value = !active.value;
};
const onHandlePrimaryAction = () => {
  axios
    .delete(`/price-rule-molds/${props.discountType.id}`)
    .then((data) => {
      console.log(data);
      alert("Delete Discount Type Successfully");
      router.go();
    })
    .catch((error) => {
      console.log(error);
    });
  active.value = false;
};
const onHandleSecondaryAction = () => {
  axios
    .post(`/price-rule-molds/${props.discountType?.id}/deactivate`)
    .then(() => {
      alert("Deactivate Discount Type Successfully");
      router.go();
    });
};
</script>
