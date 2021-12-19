<template>
  <div class="CardMenu">
    <v-card color="primary" elevation="0">
      <v-card-title class="secondary dark--text font-weight-bold subtitle-1 py-3"> Настройки </v-card-title>
      <my-scroll>
        <v-card-text class="pa-0" style="max-height: calc(100vh - 168px)">
          <v-list color="primary" class="CardMenu-list pb-0" v-for="(item, index) in array" :key="index">
            <v-subheader class="dark--text font-weight-bold subtitle-2 text-uppercase">{{
              item.subheader
            }}</v-subheader>

            <v-list-item
              dense
              link
              v-for="(subItem, i) in item.subArray"
              :key="i"
              @click="toLink(subItem)"
              :ripple="false"
            >
              <v-list-item-content>
                <v-list-item-title class="dark--text subtitle-2">{{ subItem.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon color="dark"> mdi-chevron-right </v-icon>
              </v-list-item-action>
              <my-divider :index="i" :array="item.subArray" />
            </v-list-item>
          </v-list>
        </v-card-text>
      </my-scroll>
    </v-card>
  </div>
</template>

<script>
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import MyDivider from '@/components/MyDivider.vue'

export default {
  name: 'CardMenu',
  components: {
    MyDivider,
  },
  data() {
    return {
      array: [
        {
          subheader: 'Аккаунт',
          subArray: [
            { name: 'Мой профиль', path: 'profile', direction: 'left' },
            {
              name: 'Выполненные задания',
              path: 'completedTasks',
              direction: 'left',
            },
          ],
        },
        {
          subheader: 'Настройки',
          subArray: [
            { name: 'Тема', path: 'themes', direction: 'left' },
            { name: 'Фон', path: 'background', direction: 'left' },
            {
              name: 'Список по умолчанию',
              path: 'defaultList',
              direction: 'left',
            },
          ],
        },
      ],
    }
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },
  },
}
</script>

<style lang="scss">
.CardMenu-title {
  cursor: pointer;
  transition: all 0.3s;

  & .v-icon {
    transition: all 0.3s;
  }
  &:hover {
    color: #00a4e1 !important;
    .v-icon {
      color: #00a4e1 !important;
    }
  }
}
</style>
