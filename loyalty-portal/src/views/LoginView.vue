<template lang="pug">
.login-page
  LoginForm
</template>
<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const isProcessing = ref(false);
const route = useRoute();
const router = useRouter();

const doAuth = async (): Promise<void> => {
  isProcessing.value = true;
  try {
    console.log("Login");
    await auth.refresh();
    router.push(`${route.query.redirect || '/'}`);
  } catch (error) {
    console.error(error);
  }
  isProcessing.value = false;
};

// const auth = async (): Promise<void> => {


//   console.log(payload);

//   await useAuthStore().login(payload);
//   await useAuthStore().getUser();

//   // Go to home
//   router.push({ name: 'home' });
// };

onMounted(() => {
  console.log("Mounted",route.query.redirect);
  doAuth();
});
</script>
