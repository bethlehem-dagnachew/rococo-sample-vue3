<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="profile-container q-pa-md">
      <q-card bordered class="q-pa-lg shadow-10 rounded-borders">
        <!-- Profile Header -->
        <div class="row items-center q-gutter-md q-mb-md">
          <q-avatar size="60px" color="primary" text-color="white" icon="person" class="shadow-4" />
          <div class="column">
            <template v-if="isLoading">
              <q-skeleton type="text" width="200px" height="24px" class="q-mb-sm" />
              <q-skeleton type="text" width="120px" height="16px" />
            </template>
            <template v-else>
              <div class="row items-center q-gutter-xs">
                <div class="text-h5 text-weight-bold text-primary">
                  {{ profile.first_name }} {{ profile.last_name }}
                </div>
              </div>
              <div class="text-subtitle2 text-grey-7 q-mt-xs">User Profile</div>
            </template>
          </div>
        </div>
        <q-separator color="primary" class="q-my-md" />

        <!-- View Mode -->
        <template v-if="!isEditing">
          <div v-if="isLoading" class="q-gutter-y-md q-my-sm">
            <q-skeleton type="text" width="100%" height="48px" v-for="n in 2" :key="n" />
          </div>
          <div v-else class="q-gutter-y-md q-my-sm">
            <div class="row items-center q-pa-sm rounded-borders bg-grey-2">
              <div class="col-4 text-grey-7 text-weight-medium text-subtitle1">First Name</div>
              <div class="col text-subtitle1 text-primary">{{ profile.first_name }}</div>
            </div>
            <div class="row items-center q-pa-sm rounded-borders bg-grey-2">
              <div class="col-4 text-grey-7 text-weight-medium text-subtitle1">Last Name</div>
              <div class="col text-subtitle1 text-primary">{{ profile.last_name }}</div>
            </div>

            <div class="row justify-end q-mt-lg">
              <q-btn
                outline
                color="primary"
                label="Edit"
                icon="edit"
                class="text-weight-medium text-body2 q-px-md"
                size="md"
                @click="startEditing"
              />
            </div>
          </div>
        </template>

        <!-- Edit Mode -->
        <q-form v-else @submit="saveProfile" class="q-gutter-y-sm">
          <q-input
            v-model="editedProfile.first_name"
            label="First Name"
            :rules="[(val) => !!val || 'First name is required']"
            class="text-body2"
            outlined
            stack-label
            label-class="text-subtitle2 text-weight-medium text-grey-8"
            input-class="text-body2"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="editedProfile.last_name"
            label="Last Name"
            :rules="[(val) => !!val || 'Last name is required']"
            class="text-body2"
            outlined
            stack-label
            label-class="text-subtitle2 text-weight-medium text-grey-8"
            input-class="text-body2"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              flat
              color="grey-6"
              icon="close"
              label="Cancel"
              class="text-body2 q-px-md"
              size="md"
              @click="cancelEditing"
            />
            <q-btn
              outline
              type="submit"
              color="primary"
              icon="check"
              label="Save"
              class="text-weight-medium text-body2 q-px-md"
              size="md"
              :loading="isSaving"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ProfileService from 'src/services/profile.service'

const $q = useQuasar()

const profile = ref({
  first_name: '',
  last_name: '',
})
const editedProfile = ref({
  first_name: '',
  last_name: '',
})
const isEditing = ref(false)
const isSaving = ref(false)
const isLoading = ref(true)

const fetchProfile = async () => {
  isLoading.value = true
  try {
    profile.value = await ProfileService.getProfile()
  } catch (error) {
    console.error('Error fetching profile:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Failed to load profile',
    })
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  editedProfile.value = { ...profile.value }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedProfile.value = { ...profile.value }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    const updates = {}
    if (editedProfile.value.first_name !== profile.value.first_name) {
      updates.first_name = editedProfile.value.first_name
    }
    if (editedProfile.value.last_name !== profile.value.last_name) {
      updates.last_name = editedProfile.value.last_name
    }

    if (Object.keys(updates).length > 0) {
      profile.value = await ProfileService.updateProfile(updates)
      $q.notify({
        color: 'positive',
        message: 'Profile updated successfully',
      })
    }
    isEditing.value = false
  } catch (error) {
    console.error('Profile update error:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Failed to update profile',
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchProfile)
</script>

<style lang="scss" scoped>
@import '../css/profile.scss';
</style>
