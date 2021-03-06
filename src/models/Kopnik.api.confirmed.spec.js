import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User get confirmed', () => {
  let main
  beforeEach(async () => {
    AbstractSync.clearCache()
    main = await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
    }, 'main')
    await main.login()
  })

  it('get(self)', async () => {
    const user = new Kopnik()
    await user.reload()
    expect(user.id).toBe(main.id)
  })
  it('get(somebody)', async () => {
    const somebody = await Kopnik.create()
    const user = await Kopnik.get(somebody.id)
    expect(user.id).toBe(somebody.id)
  })
  it('reloadWitnessRequests()', async () => {
    try {
      await main.reloadWitnessRequests()
      throw new Error('should not be hire')
    } catch (err) {
      expect(err.code).toBe(403)
    }
  })
  it('isMessagesFromGroupAllowed()', async () => {
    let result = await main.isMessagesFromGroupAllowed()
  })
  it('setLocale()', async () => {
    await main.setLocale({name: 'en'})
    await main.reload()
    expect(main.locale).toMatchObject({name: "en"})
  })
  it('updateProfile()', async () => {
    const witness = await Kopnik.create({
      isWitness: true,
    }, 'witness')
    const state = {
      role: Kopnik.Role.Female,
      passport: '0001',
      location: {
        lat: 1,
        lng: 1
      },
      firstName: '1',
      lastName: '2',
      patronymic: '3',
      birthyear: 2000,
      locale: 'en',
    }
    await main.updateProfile(state)

    await main.login()
    await main.reload()
    expect(main.status).toBe(Kopnik.Status.PENDING)
    expect(main.plain).toMatchObject(state)
  })
  it('updateWitnessRequestStatus()', async () => {
    try {
      await main.updateWitnessRequestStatus({
        id: 666,
        status: Kopnik.Status.CONFIRMED,
      })
      throw new Error("should not be hire")
    } catch (err) {
      expect(err).toBeKopnikError(403)
    }
  })

  describe('tree', () => {
    describe('putForemanRequest()', () => {
      it('success', async () => {
        const foreman = await Kopnik.create({}, 'foreman')
        foreman.foremanRequests = []

        await main.putForemanRequest(foreman)
        await main.reload()
        expect(main.foremanRequest).toBe(foreman)
        expect(foreman.foremanRequests).toHaveLength(1)
        expect(foreman.foremanRequests[0]).toBe(main)
      })
      it('success reset', async () => {
        const foreman = await Kopnik.create({}, 'foreman')
        foreman.foremanRequests = []

        await main.putForemanRequest(foreman)
        await main.putForemanRequest(null)
        await main.reload()
        expect(main.foremanRequest).toBeNull()
        expect(foreman.foremanRequests).toHaveLength(0)
      })

      it('woman', async () => {
        const woman = await Kopnik.create({
          role: Kopnik.Role.Female
        }, 'female')
        try {
          await main.putForemanRequest(woman)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 510)
        }
      })
    })
    it('getForemanRequests()', async () => {
      const requester = await Kopnik.create({
        foremanRequest_id: main.id,
      }, 'requester')
      await main.reloadForemanRequests()
      expect(main.foremanRequests).toBeInstanceOf(Array)
      expect(main.foremanRequests).toHaveLength(1)
      expect(main.foremanRequests[0].id).toBe(requester.id)
    })
    describe('confirmForemanRequest()', () => {
      it('success', async () => {
        const requester = await Kopnik.create({
          status: Kopnik.Status.PENDING,
          foremanRequest_id: main.id,
        }, 'requester')
        await main.confirmForemanRequest(requester)

        await main.reloadForemanRequests()
        expect(main.foremanRequests).toBeInstanceOf(Array)
        expect(main.foremanRequests).toHaveLength(0)

        await main.logout()
        await requester.login()
        await requester.reload()
        expect(requester.foremanRequest).toBeNull()
        expect(requester.foreman).toBe(main)
      })
      it('not found', async () => {
        const foreman = await Kopnik.create({
          foremanRequest_id: main.id,
        }, 'foreman')
        const somebody = await Kopnik.create({
          status: Kopnik.Status.PENDING,
          foremanRequest_id: foreman.id,
        }, 'somebody')

        try {
          await main.confirmForemanRequest(somebody)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 511)
        }
      })
    })
    describe('declineForemanRequest()', () => {
      it('success', async () => {
        const requester = await Kopnik.create({
          status: Kopnik.Status.PENDING,
          foremanRequest_id: main.id,
        }, 'requester')
        await main.declineForemanRequest(requester)

        await main.reloadForemanRequests()
        expect(main.foremanRequests).toBeInstanceOf(Array)
        expect(main.foremanRequests).toHaveLength(0)

        await main.logout()
        await requester.login()
        await requester.reload()
        expect(requester.foremanRequest).toBeNull()
        expect(requester.foreman).toBeNull()
      })
      it('not found', async () => {
        const foreman = await Kopnik.create({
          foremanRequest_id: main.id,
        }, 'foreman')
        const somebody = await Kopnik.create({
          status: Kopnik.Status.PENDING,
          foremanRequest_id: foreman.id,
        }, 'somebody')

        try {
          await main.declineForemanRequest(somebody)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 511)
        }
      })
    })
    it('getForeman()', async () => {
      const subordinate = await Kopnik.create({
        foreman_id: main.id,
      }, 'subordinate')
      await subordinate.reload()
      expect(subordinate.foreman).toBe(main)
    })
    it.skip('getAllForemans()', async () => {
      const subordinate = await Kopnik.create({
        foreman_id: main.id,
      }, 'subordinate')
      const subsub = await Kopnik.create({
        foreman_id: subordinate.id,
      }, 'subsub')
      const foremans = await subsub.getAllForemans()
      expect(foremans[o]).toBe(subordinate)
      expect(foremans[0]).toBe(main)
    })
    it('loadedSubordinates()', async () => {
      const subordinate = await Kopnik.create({
        foreman_id: main.id,
      }, 'subordinate')

      const subordinated = await main.loadedSubordinates()
      expect(subordinated).toBeInstanceOf(Array)
      expect(subordinated).toHaveLength(1)
      expect(subordinated[0]).toBe(subordinate)
    })
    describe('removeFromSubordinates()', () => {
      it('success', async () => {
        const subordinate = await Kopnik.create({
          foreman_id: main.id,
        }, 'subordinate')
        await main.removeFromSubordinates(subordinate)
        await main.reloadSubordinates()
        expect(main.subordinates).toHaveLength(0)

        await subordinate.reload()
        expect(subordinate.foreman).toBeNull()
      })
      it('not found', async () => {
        const foreman = await Kopnik.create({}, 'foreman')
        const somebody = await Kopnik.create({
          foreman_id: foreman.id,
        }, 'somebody')

        try {
          await main.removeFromSubordinates(somebody)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 512)
        }
      })
    })
    describe('resetForeman()', () => {
      it('self reset success', async () => {
        const subordinate = await Kopnik.create({
          foreman_id: main.id,
        }, 'subordinate')
        await main.reload()
        await main.logout()
        await subordinate.login()
        await subordinate.resetForeman()
        await subordinate.reload()

        expect(subordinate.foreman).toBeNull()
        expect(main.rank).toBe(1)
      })
      it('self reset when foreman not setted', async () => {
        await main.resetForeman()
        await main.reload()
        expect(main.foreman).toBeNull()
      })
    })
  })
})
