import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../../../test-setup";
import AppVue from "../../../../../src/components/AppVue";
import {bottle, container} from "../../../../../src/bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../../../../src/application/Application";

describe('unit components AppVue', () => {
    let vm,
        application

    beforeEach(() => {
        bottle.resetProviders(['application', 'cookieService'])
        console.log('inside before each')
        application = container.application
        const router= routerFactory()
        vm = new Vue({
            ...AppVue,
            i18n,
            vuetify,
            router
        })
    })

    describe('status=new', () => {
        beforeEach(async () => {
            await login(2)
        })

        describe('enter', () => {
            it('/witness', async () => {
                application.authenticate()
                vm.$mount()
                try {
                    await vm.$router.push({name: Application.Section.Witness})
                    throw new Error('should not be hire')
                } catch (err) {
                    expect(err).toBe(false)
                    await flushPromises()
                    expect(vm.$router.currentRoute.name).toBe(Application.Section.Profile)
                    expect(application.section).toBe(Application.Section.Profile)
                }
            })
        })
    })

})
