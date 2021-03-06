<template>
  <v-navigation-drawer v-if="$router"
                       :value="value"
                       temporary touchless
                       @input="drawer_input"
                       app>
    <router-link to="/profile" class="cursor-pointer" tag="div">
      <kopnik-vue v-if="application.user" :value="application.user" to="/profile"
                  :avatar-size="64" class="flex-grow-1">
      </kopnik-vue>
    </router-link>
    <v-divider></v-divider>
    <v-list>

      <v-list-item link to="/">
        <v-list-item-action>
          <v-icon>mdi-home-city</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.map') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item subordinates :disabled="!application.user" @click="subordinates_click">
        <v-list-item-action>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.myTen') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :disabled="!application.user"
                   @click="throwUnderConstructionError"
      >
        <v-list-item-action>
          <v-icon>mdi-chat</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.tenChat') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link
                   @click="throwUnderConstructionError"
                   :disabled="!application.user"
      >
        <v-list-item-action>
          <v-icon>mdi-chat</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.foremanChat') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="application.user.isWitness"
                   :disabled="!application.user"
                   @click="witness_click"
      >
        <v-list-item-action>
          <v-icon>mdi-human-greeting</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.witnessRequests') }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-account-question</v-icon>
        </v-list-item-action>
      </v-list-item>
      <v-list-item link to="/thanks">
        <v-list-item-action>
          <v-icon>mdi-heart</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.thanks') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-action>
          <v-icon>mdi-help-circle</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.help') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item logout link @click="logout_click">
        <v-list-item-action>
          <v-icon>mdi-location-exit</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="application.user || application.user.id===1" @click="snow_click">
        <v-list-item-action>
          <v-icon>mdi-location-snow</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title> Снежинка</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import KopnikVue from "./KopnikVue";
import {container} from "../bottle/bottle";
import logger from "./mixin/logger";
import Kopnik from "../models/Kopnik";
import Application from "@/application/Application";
import createSubordinates from "../utils/snow/createSubordinates";
import snow from '../utils/snow'
/**
 * @property {Application} application
 */
export default {
  mixins: [logger],
  components: {
    KopnikVue,
  },
  data() {
    return {
      application: container.application,
      KopnikStatus: Kopnik.Status,
    }
  },
  props: {
    value: {
      type: Boolean
    }
  },
  methods: {

    async witness_click() {
      if (await this.application.forwardUserToBeConfirmed()) {
        return
      }
      await this.application.lockSection(async () => {
        await this.application.setSection(Application.Section.Witness)
      })
    },
    async subordinates_click() {
      if (await this.application.forwardUserToBeConfirmed()) {
        return
      }
      await this.application.lockSection(async () => {
        await this.application.setSection(Application.Section.Ten)
      })
    },
    throwUnderConstructionError() {
      throw new Error(this.$t(this.application.getMessage('errors.underConstruction')))
    },
    drawer_input(event) {
      // console.log('event', event)
      this.$emit('input', event)
    },
    async logout_click() {
      await this.application.logout()
    },
    async snow_click() {
      await snow()
    }
  },
  async created() {
    await this.application.resolveUser()
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
