<template>
  <div class="Search" ref="search" :class="{ open: !searchClosed, closed: searchClosed }">
    <div class="d-flex align-center">
      <v-btn fab icon small color="dark" @click="toggle">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-text-field
        class="Search__text-field Search__expanding-search"
        placeholder="Поиск задач"
        filled
        solo
        hide-details
        dense
        color="dark"
        v-model="search"
        autocomplete="new-password"
        ref="input"
      ></v-text-field>
    </div>

    <v-card class="Search__card rounded-lg overflow-hidden" v-if="search" min-width="300" color="primary">
      <v-list
        ref="list"
        class="Search__list Search__list_result"
        v-if="this.concatenationArrays.length > 0"
        :style="{ height: heightList }"
        color="primary"
      >
        <my-scroll>
          <v-list-item
            class="text-subtitle-2 d-flex align-center"
            dense
            v-for="item in concatenationArrays"
            :key="item.id"
            :ripple="false"
            link
            @click="openTask(item)"
          >
            <v-list-item-title class="Search__title">
              <v-icon v-if="!item.complited && !item.sub" class="mr-4" color="accent">mdi-checkbox-marked</v-icon>
              <v-icon v-if="item.complited && !item.sub" class="mr-4" color="gainsBorough">mdi-checkbox-marked</v-icon>
              <v-icon v-if="!item.complited && item.sub" class="mr-4" color="accent">mdi-file-tree</v-icon>
              <v-icon v-if="item.complited && item.sub" class="mr-4" color="gainsBorough">mdi-file-tree</v-icon>

              <span class="Search__text subtitle-2 font-weight-bold">{{ item.title }}</span>
            </v-list-item-title>
          </v-list-item>
        </my-scroll>
      </v-list>

      <v-list v-else class="Search__list Search__list_no-result d-flex flex-column align-center justify-center">
        <svg width="104" height="77" viewBox="0 0 104 77">
          <defs>
            <path
              id="svg-b-561"
              d="M23.138 55.258c20.75-9.759 40.253-10.816 58.513-3.173C99.91 59.727 72.926 63.549.699 63.549l22.44-8.291z"
            ></path>
            <filter id="svg-a-561" width="139.3%" height="306.1%" x="-19.7%" y="-78.8%" filterUnits="objectBoundingBox">
              <feOffset dy="4" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
              <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="5"></feGaussianBlur>
              <feColorMatrix
                in="shadowBlurOuter1"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0212013134 0"
              ></feColorMatrix>
            </filter>
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(8)">
            <circle cx="50.5" cy="13.5" r="13.5" fill="#FFC422"></circle>
            <path
              stroke="#2FC14A"
              stroke-linecap="round"
              stroke-width="4"
              d="M28 23v22.635a3.434 3.434 0 0 0 3.428 3.435h3.428"
            ></path>
            <path
              stroke="#2FC14A"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="4"
              d="M35 59V30M65 49V34"
            ></path>
            <path
              stroke="#2FC14A"
              stroke-linecap="round"
              stroke-width="4"
              d="M42.1 14v22.576a3.489 3.489 0 0 1-3.485 3.488H35.13"
            ></path>
            <g transform="rotate(3 43.938 55.3)">
              <use fill="#000" filter="url(#svg-a-561)" xlink:href="#svg-b-561"></use>
              <use fill="#FFC422" xlink:href="#svg-b-561"></use>
            </g>
          </g>
        </svg>
        <span class="mt-2">Нет результатов</span>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { gettersTypes } from '@/store/modules/tasks'
import { actionsTypes, mutationTypes } from '@/store/modules/dialog'

export default {
  name: 'Search',
  data() {
    return {
      search: '',
      searchClosed: true,
      heightList: '',
    }
  },
  computed: {
    ...mapGetters({
      getTasks: gettersTypes.getTasks,
    }),

    notDeletedTasks() {
      return this.getTasks.filter((todo) => !todo.deleteTask)
    },

    filteredList() {
      return this.notDeletedTasks.filter((post) => {
        return post.title.toLowerCase().includes(this.search.toLowerCase())
      })
    },

    filterSubTasks() {
      let array = []

      this.notDeletedTasks.forEach((item) => {
        if (item.subTasks) {
          item.subTasks.forEach((post) => {
            if (post.text.toLowerCase().includes(this.search.toLowerCase())) {
              array.push({
                title: post.text,
                id: post.id,
                idParent: item.id,
                sub: true,
                complited: post.isComplited,
              })
            }
          })
        }
      })

      return array
    },

    concatenationArrays() {
      const array = this.filterSubTasks.reduce(
        (acc, el) => {
          let subElement

          acc.forEach((item, index) => {
            if (el.idParent === item.id) {
              subElement = {
                el,
                idx: index,
              }
            }
          })

          if (subElement && subElement.el.id == el.id) {
            acc.splice(subElement.idx + 1, 0, subElement.el)
          } else {
            acc.push(el)
          }

          return acc
        },
        [...this.filteredList]
      )

      return array
    },
  },
  watch: {
    search() {
      this.heightList = ''

      if (this.search !== '' && this.concatenationArrays.length > 0) {
        setTimeout(() => {
          const height = this.$refs.list.$el.clientHeight

          if (height >= 380) {
            this.heightList = `calc(100vh - 100px)`
          }
        }, 0)
      }
    },
  },
  methods: {
    toggle() {
      if (this.searchClosed) {
        this.$refs.input.focus()
      }

      this.searchClosed = !this.searchClosed

      if (this.search !== '') {
        this.search = ''
      }
    },

    openTask(item) {
      const task = this.notDeletedTasks.filter((post) => {
        let id = item.sub ? item.idParent : item.id
        return post.id === id
      })

      this.$store.dispatch(actionsTypes.callDialog, task[0]).then(() => {
        this.$store.commit(mutationTypes.dialogName, 'updateTask')
      })
      this.toggle()
    },
  },

  mounted() {
    const search = this.$refs.search

    if (search) {
      document.addEventListener('click', (e) => {
        const target = e.target
        const isSearch = target == search || search.contains(target)
        const searchIsActive = search.classList.contains('open')

        if (!isSearch && searchIsActive) {
          this.toggle()
        }
      })
    }
  },
}
</script>

<style lang="scss">
.Search {
  position: relative;

  &__expanding-search {
    width: 300px;
    transition: width 0.3s;
    .v-input__slot {
      padding: 0px !important;

      & .v-text-field__slot {
        padding-left: 10px !important;
      }
    }
  }

  &.closed {
    .Search__expanding-search {
      width: 0px;
    }

    .v-input__slot {
      & .v-text-field__slot {
        padding-left: 20px !important;
      }
    }
  }

  &__card {
    position: absolute;
    right: -10px;
    margin-top: 10px;
  }

  &__list_no-result {
    height: 173px;
  }

  &__list_result {
    max-height: 380px !important;
  }

  &__title {
    width: 50px;
    overflow: hidden;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
