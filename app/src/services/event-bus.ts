import { EventEmitter } from 'fbemitter'

let instance: EventEmitter

const EventBus = {
  getEventBus(): EventEmitter {
    if (!instance) {
      instance = new EventEmitter()
    }
    return instance
  },
}

export default EventBus
