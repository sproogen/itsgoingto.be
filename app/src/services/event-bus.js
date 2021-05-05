import { EventEmitter } from 'fbemitter'

let instance

const EventBus = {
  getEventBus() {
    if (!instance) {
      instance = new EventEmitter()
    }
    return instance
  }
}

export default EventBus
