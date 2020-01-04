import {bottle, container} from "../../src/plugins/bottle";
import {Kopnik} from "../../src/models";
import Application from "../../src/Application";

describe('unit/Application', () => {
    let application
    beforeEach(() => {
        // сбросить application, потому что в конце каждого теста user уже установлен
        // сбросить cookieService, потому что кука тоже устанавливается
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
    })
    describe('anonymous', () => {
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBe(null)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Main)
            })
            it('witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
        })
    })

    describe('status=new', () => {
        beforeEach(async () => {
            await login(2)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it.skip('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
        })
    })

    describe('status=pending', () => {
        beforeEach(async () => {
            await login(3)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it.skip('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
        })
    })
    
    describe('status=confirmed', () => {
        beforeEach(async () => {
            await login(1)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Witness)
            })
        })
    })

    describe('status=declined', () => {
        beforeEach(async () => {
            await login(4)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it.skip('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
        })
    })
})
