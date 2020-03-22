import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../../../test-setup";
import AppVue from "../../../../../src/components/AppVue";
import {bottle, container} from "../../../../../src/bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../../../../src/application/Application";

describe('unit components AppVue status=pending', () => {
    let vm,
        application

    beforeEach(async () => {
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
        const router = routerFactory()
        vm = new Vue({
            ...AppVue,
            i18n,
            vuetify,
            router
        })
        await login(3)
    })

    describe('enter', () => {
        it('/profile', async () => {
            await vm.$router.push({name: Application.Section.Profile})
            application.authenticate()
            vm.$mount()

            await flushPromises()
            expect(vm.$router.currentRoute.name).toBe(Application.Section.Profile)
            expect(application.section).toBe(Application.Section.Profile)
        })
    })
})