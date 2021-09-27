<template>
  <v-app>
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" lg="5" md="10" sm="10">
          <v-card class="elevation-12 rounded-lg" style="overflow: hidden" color="primary">
            <router-view></router-view>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
}
</script>
