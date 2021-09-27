module.exports = {
  runtimeCompiler: true,
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      scss: {
        prependData: ` @import "~@/styles/styles.scss";`,
      },
    },
  },
}
