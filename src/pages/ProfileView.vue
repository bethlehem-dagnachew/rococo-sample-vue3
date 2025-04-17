<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="profile-container q-pa-md">
      <q-card bordered class="q-pa-xl shadow-10 rounded-borders">
        <!-- Profile Header -->
        <div class="row items-center q-gutter-lg q-mb-">
          <q-avatar size="80px" color="primary" text-color="white" icon="person" class="shadow-4" />
          <div class="column">
            <div class="row items-center q-gutter-xs">
              <div class="text-h4 text-weight-bold text-primary">
                {{ profile.first_name }} {{ profile.last_name }}
              </div>
            </div>
            <div class="text-subtitle1 text-grey-7 q-mt-sm">User Profile</div>
          </div>
        </div>
        <q-separator color="primary" class="q-my-lg" />

        <!-- View Mode -->
        <div v-if="!isEditing" class="q-gutter-y-lg q-my-md">
          <div class="row items-center q-pa-md rounded-borders bg-grey-2">
            <div class="col-4 text-grey-7 text-weight-medium text-h6">First Name</div>
            <div class="col text-h6 text-primary">{{ profile.first_name }}</div>
          </div>
          <div class="row items-center q-pa-md rounded-borders bg-grey-2">
            <div class="col-4 text-grey-7 text-weight-medium text-h6">Last Name</div>
            <div class="col text-h6 text-primary">{{ profile.last_name }}</div>
          </div>

          <div class="row justify-end q-mt-xl">
            <q-btn
              outline
              color="primary"
              label="Edit "
              icon="edit"
              class="text-weight-medium text-body1 q-px-lg"
              size="lg"
              @click="startEditing"
            />
          </div>
        </div>

        <!-- Edit Mode -->
        <q-form v-else @submit="saveProfile" class="q-gutter-y-sm">
          <q-input
            v-model="editedProfile.first_name"
            label="First Name"
            :rules="[(val) => !!val || 'First name is required']"
            class="text-body1"
            outlined
            stack-label
            label-class="text-subtitle1 text-weight-medium text-grey-8"
            input-class="text-body1"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="editedProfile.last_name"
            label="Last Name"
            :rules="[(val) => !!val || 'Last name is required']"
            class="text-body1"
            outlined
            stack-label
            label-class="text-subtitle1 text-weight-medium text-grey-8"
            input-class="text-body1"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <div class="row justify-end q-gutter-sm q-mt-xl">
            <q-btn
              flat
              color="grey-6"
              icon="close"
              label="Cancel"
              class="text-body1 q-px-lg"
              size="lg"
              @click="cancelEditing"
            />
            <q-btn
              outline
              type="submit"
              color="primary"
              icon="save"
              label="Save"
              class="text-weight-medium text-body1 q-px-lg"
              size="lg"
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

const fetchProfile = async () => {
  try {
    profile.value = await ProfileService.getProfile()
  } catch (error) {
    console.error('Error fetching profile:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Failed to load profile',
    })
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
