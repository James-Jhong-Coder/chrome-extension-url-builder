import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import InputText from 'primevue/inputtext';
import type { App } from 'vue';

export const registerPrimeVue = (app: App) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });
  app.component('InputText', InputText);
};
