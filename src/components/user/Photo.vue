<template>
  <div class="Photo">
    <label class="Photo__attachments rounded-lg mb-4" for="Photo__attachments">
      <input
        id="Photo__attachments"
        class="Photo__attachments-input"
        type="file"
        @change="chooseFile"
      />
      <v-icon v-if="!userPhoto" class="profile__icon border rounded-circle">
        mdi-camera-plus-outline
      </v-icon>
      <v-img v-else :src="userPhoto"></v-img>
    </label>
  </div>
</template>

<script>
import { actionsTypes as photo } from '@/store/modules/userPhoto'
import { actionsTypes as alert } from '@/store/modules/alert'
import { actionsTypes as profile } from '@/store/modules/profile'
import { mapState } from 'vuex'

export default {
  name: 'Photo',
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
      userPhoto: (state) => state.userPhoto.userPhoto,
    }),
  },

  methods: {
    chooseFile(event) {
      const file = event.target.files[0]
      const fileSize = file.size / 1024 / 1024 // in MB
      const extension = file.name.split('.').pop()

      if (extension !== 'jpeg') {
        this.message = 'Загрузите файл с расширением .jpeg'
        this.$store.dispatch(alert.callAlert, {
          message: this.message,
          type: 'error',
        })
        return false
      }
      if (fileSize > 1.5) {
        this.message = 'Размер файла не должен превышать 1,5 МБ.'
        this.$store.dispatch(alert.callAlert, {
          message: this.message,
          type: 'error',
        })
        return false
      }

      this.$store.dispatch(photo.uploadUserPhoto, file).then(() => {
        this.$store.dispatch(photo.downloadUserPhoto)
        this.$store.dispatch(profile.updateUser, {
          userPhoto: 'userPhoto.jpeg',
        })
      })
    },
  },
  mounted() {
    if (this.userPhoto) {
      return
    }

    this.$store.dispatch(photo.downloadUserPhoto)
  },
}
</script>

<style lang="scss">
.Photo {
  width: 100%;
  height: 100%;
  position: relative;

  &__attachments {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  &__attachments-input {
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
}

.border {
  border: 1px solid white !important;
}
</style>
