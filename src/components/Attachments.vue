<template>
  <div class="Attachments">
    <label
      class="Attachments__container rounded-lg mb-4"
      for="Attachments"
      :class="[isLoading ? 'disabled' : '']"
    >
      <input
        id="Attachments"
        class="Attachments__input"
        type="file"
        @change="chooseFile"
      />
      <p class="Attachments__text">Click to add / drop your files here</p>
    </label>

    <div class="Attachments__wrapper" name="insert" is="transition-group">
      <div
        class="Attachments__download-container d-flex justify-space-between align-center mb-4"
        v-for="(item, index) in data"
        :key="item.id"
      >
        <v-btn
          icon
          target="_blank"
          rel="noopener noreferrer"
          class="Attachments__icon-download mr-2"
          @click="downloadFile(item.file.name)"
          ><v-icon color="accent" x-large>mdi-download-box</v-icon></v-btn
        >
        <div class="Attachments__progress-container flex-grow-1 mr-2">
          <p
            class="mb-0 ellipes"
            :class="[
              item.done
                ? 'dark--text subtitle-2'
                : 'gainsBorough--text caption',
            ]"
          >
            {{ item.file.name }}
          </p>
          <v-progress-linear
            class="rounded-lg"
            v-if="progress !== 100 && !item.done"
            v-model="progress"
            color="blue-grey"
            height="10"
          >
          </v-progress-linear>
        </div>
        <p v-if="item.done" class="Attachments__date dark--text caption mb-0">
          {{ item.date | formatDate }}
        </p>
        <v-btn
          class="Attachments__remove"
          icon
          @click="deleteFile(item.file.name, index)"
          ><v-icon color="gainsBorough">mdi-close-circle-outline</v-icon></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes } from '@/store/modules/attachments'
import { actionsTypes as alert } from '@/store/modules/alert'
import formatDate from '@/filters/formatDate.js'

export default {
  name: 'Attachments',
  props: {
    attachmentsFiles: {
      type: Array,
      requred: false,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      data: null,
      file: null,
      message: '',
    }
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.attachments.isLoading,
      progress: (state) => state.attachments.progress,
    }),
  },
  watch: {
    progress(val) {
      if (val === 100) {
        this.uploadFile()
      }
    },
  },
  filters: { formatDate },
  methods: {
    chooseFile(event) {
      const fileSize = event.target.files[0].size / 1024 / 1024 // in MB
      if (fileSize > 1.5) {
        this.message = 'Размер файла не должен превышать 1,5 МБ.'
        this.$store.dispatch(alert.callAlert, {
          message: this.message,
          type: 'error',
        })
        return false
      }
      this.file = {
        file: {
          name: event.target.files[0].name,
          size: event.target.files[0].size,
          type: event.target.files[0].type,
        },
        date: new Date(),
        done: false,
        id: Date.now(),
      }
      this.data.push(this.file)
      const file = event.target.files[0]

      this.$store.dispatch(actionsTypes.upload, file)
    },
    uploadFile() {
      this.file.done = true
      this.$emit('upload', this.data)
    },
    downloadFile(fileName) {
      this.$store.dispatch(actionsTypes.download, fileName).then((url) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = function () {
          const blob = xhr.response
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          URL.revokeObjectURL(link.href)
        }
        xhr.open('GET', url)
        xhr.send()
      })
    },
    deleteFile(fileName, index) {
      this.$store.dispatch(actionsTypes.delete, fileName)
      this.data = this.data.filter((item, i) => i !== index)
      this.$emit('upload', this.data)
    },
  },
  mounted() {
    this.data = this.attachmentsFiles ? this.attachmentsFiles : []
  },
}
</script>

<style lang="scss">
.disabled {
  cursor: progress;
  user-select: none;
  opacity: 0.5;
  pointer-events: none;
}

.Attachments {
  &__container {
    cursor: pointer !important;
    width: 100%;
    min-height: 48px;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    border: 1px dashed #a2a2a2;
    color: #a2a2a2;
    transition: all 0.2s;
    text-align: center;

    &:hover {
      border: 1px dashed #00a4e1;
      color: #00a4e1;
    }
  }
  &__input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: -1;
  }
  &__text {
    margin: 0 !important;
  }
}
</style>
