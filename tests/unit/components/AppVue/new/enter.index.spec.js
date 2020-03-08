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
            it('/', async () => {
                console.log('---> inside test 1')
                vm.$mount()
                await application.authenticate()
                await flushPromises()
                expect(vm.$el.textContent).not.toContain('Войти через ВКонтакте')
                expect(application.section).toBe(Application.Section.Profile)
                expect(vm.$route.name).toBe('Profile')
                console.log('inside test 1')
            })
        })
    })

})
